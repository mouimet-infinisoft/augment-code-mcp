import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Sanitizes HTML content
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}

/**
 * Converts markdown to sanitized HTML
 * @param markdown Markdown content
 * @returns Sanitized HTML
 */
export function markdownToHtml(markdown: string): string {
  const html = marked(markdown);
  return sanitizeHtml(html);
}

/**
 * Strips markdown formatting for speech synthesis
 * @param markdown Markdown content
 * @returns Plain text without markdown formatting
 */
export function stripMarkdown(markdown: string): string {
  // Replace headers
  let text = markdown.replace(/#{1,6}\s+/g, '');
  
  // Replace bold/italic
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');    // Italic
  
  // Replace links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  
  // Replace lists
  text = text.replace(/^\s*[-*+]\s+/gm, '• ');
  text = text.replace(/^\s*\d+\.\s+/gm, '');
  
  // Replace code blocks
  text = text.replace(/```[\s\S]*?```/g, 'code block');
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Replace blockquotes
  text = text.replace(/^\s*>\s+/gm, '');
  
  // Replace horizontal rules
  text = text.replace(/^\s*[-*_]{3,}\s*$/gm, '');
  
  // Replace HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Replace multiple newlines with a single one
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
}
