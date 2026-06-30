import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/** Renders markdown with syntax-highlighted code blocks. Shared by the
 *  read-only Sidebar and the editor's live preview. */
export default function MarkdownView({ content }: { content: string }) {
  return (
    <div className="prose prose-slate prose-sm sm:prose-base max-w-none">
      <ReactMarkdown
        components={{
          code(props: any) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={oneDark}
                customStyle={{
                  margin: '1rem 0',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                }}
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
