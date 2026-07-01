import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Deep, bordered code block that stands out against both the white (light)
// and slate-800 (dark) panels, plus brighter comments than oneDark's default.
const codeStyle = {
  ...oneDark,
  comment: { ...(oneDark as Record<string, React.CSSProperties>).comment, color: '#9fb0c9', fontStyle: 'italic' },
} as typeof oneDark;

const codeBlockStyle: React.CSSProperties = {
  margin: '1rem 0',
  padding: '1rem',
  borderRadius: '0.75rem',
  fontSize: '0.875rem',
  background: '#0f172a',
  border: '1px solid #334155',
};

/** Renders markdown with syntax-highlighted code blocks. Shared by the
 *  read-only Sidebar and the editor's live preview. */
export default function MarkdownView({
  content,
  onNodeLink,
}: {
  content: string;
  onNodeLink?: (id: string) => void;
}) {
  return (
    <div className="prose prose-slate prose-sm sm:prose-base max-w-none">
      <ReactMarkdown
        // Keep our custom `node:` scheme (default sanitizer would strip it).
        urlTransform={(url) => url}
        components={{
          a(props: any) {
            const { href, children, node, ...rest } = props;
            if (typeof href === 'string' && href.startsWith('node:')) {
              const id = href.slice('node:'.length);
              return (
                <a
                  {...rest}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNodeLink?.(id);
                  }}
                  className="cursor-pointer font-medium text-blue-600 underline decoration-dotted underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {children}
                </a>
              );
            }
            return (
              <a {...rest} href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          code(props: any) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={codeStyle}
                customStyle={codeBlockStyle}
                className="shadow-sm"
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
