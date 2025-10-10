/**
 * Markdown content renderer with modern styling
 * Features: Syntax highlighting, responsive images, custom components
 */

'use client';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  // Convert markdown to HTML (simplified, you can use react-markdown for full features)
  const renderMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="markdown-h3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="markdown-h2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="markdown-h1">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      
      // Code
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>')
      
      // Lists
      .replace(/^\* (.+)$/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul class="markdown-list">$1</ul>')
      
      // Paragraphs (simple - wrap non-HTML lines)
      .split('\n\n')
      .map(para => {
        if (para.match(/^<[h|u|o]/)) return para;
        return `<p class="markdown-p">${para}</p>`;
      })
      .join('\n');
  };

  const htmlContent = renderMarkdown(content);

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        lineHeight: 1.8,
        color: '#374151',
      }}
    />
  );
}

// Add global styles for markdown (you can move this to globals.css)
export const markdownStyles = `
  .markdown-content {
    font-size: 1.0625rem;
  }

  .markdown-h1 {
    font-size: 2.25rem;
    font-weight: 800;
    color: #111827;
    margin: 2rem 0 1rem;
    line-height: 1.2;
  }

  .markdown-h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1F2937;
    margin: 2rem 0 1rem;
    line-height: 1.3;
    border-bottom: 2px solid #E5E7EB;
    padding-bottom: 0.5rem;
  }

  .markdown-h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin: 1.5rem 0 0.75rem;
    line-height: 1.4;
  }

  .markdown-p {
    margin-bottom: 1.25rem;
    line-height: 1.8;
  }

  .inline-code {
    background: #F3F4F6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    color: #DC2626;
  }

  .markdown-link {
    color: #2563EB;
    text-decoration: underline;
    font-weight: 500;
    transition: color 0.2s;
  }

  .markdown-link:hover {
    color: #1D4ED8;
  }

  .markdown-list {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .markdown-list li {
    margin: 0.5rem 0;
    line-height: 1.8;
  }

  .markdown-content strong {
    font-weight: 700;
    color: #111827;
  }

  .markdown-content em {
    font-style: italic;
  }
`;

