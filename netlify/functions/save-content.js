// Netlify Function: persists the mind-map content by committing
// public/content.json back to the GitHub repo.
//
// Security: only requests carrying a valid Netlify Identity token are allowed
// (Netlify populates context.clientContext.user for those). Unauthenticated
// requests get 401, so the public site cannot modify anything.
//
// Required environment variables (set in Netlify site settings):
//   GITHUB_TOKEN  - PAT with Contents: read/write on the repo
//   GITHUB_REPO   - "owner/name", e.g. "KennyNescius/python-mind-map"
//   GIT_BRANCH    - branch to commit to (optional, default "main")

const CONTENT_PATH = 'public/content.json';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return json(401, { error: 'Требуется вход (Netlify Identity).' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GIT_BRANCH || 'main';
  if (!token || !repo) {
    return json(500, { error: 'Сервер не настроен: задайте GITHUB_TOKEN и GITHUB_REPO.' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '');
  } catch {
    return json(400, { error: 'Тело запроса не является корректным JSON.' });
  }
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges) || typeof data.concepts !== 'object') {
    return json(400, { error: 'Неверная структура: ожидаются nodes[], edges[], concepts{}.' });
  }

  const apiBase = `https://api.github.com/repos/${repo}/contents/${CONTENT_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'python-mind-map-editor',
  };

  try {
    // Look up the current file SHA (required to update an existing file).
    let sha;
    const head = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers: ghHeaders });
    if (head.status === 200) {
      sha = (await head.json()).sha;
    } else if (head.status !== 404) {
      return json(502, { error: `GitHub GET ${head.status}: ${await head.text()}` });
    }

    const body = JSON.stringify(data, null, 2) + '\n';
    const put = await fetch(apiBase, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `content: update map via editor (${user.email || 'editor'})`,
        content: Buffer.from(body, 'utf-8').toString('base64'),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (put.status !== 200 && put.status !== 201) {
      return json(502, { error: `GitHub PUT ${put.status}: ${await put.text()}` });
    }

    const result = await put.json();
    return json(200, { ok: true, commit: result.commit && result.commit.sha });
  } catch (e) {
    return json(500, { error: String(e && e.message ? e.message : e) });
  }
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  };
}
