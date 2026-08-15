import { marked } from 'marked';
import hljs from 'highlight.js';
import type { Theme } from './themes';

export const parseMarkdown = (markdown: string, theme: Theme): string => {
  // 设置 marked，使用 highlight.js
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // 使用 marked 解析出基础 HTML
  const rawHtml = marked.parse(markdown) as string;

  // 使用浏览器自带的 DOMParser 解析 HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // 高亮代码块（marked 默认不会给 code 加高亮，除非在 Renderer 里写，但我们可以直接查 DOM）
  // 对于 marked v18，最简单的方式是用 hljs 处理 DOM
  doc.querySelectorAll('pre code').forEach((block) => {
    // block 是 Element
    hljs.highlightElement(block as HTMLElement);
  });

  // 递归遍历 DOM 树，注入内联样式
  const applyStyles = (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    
    // 基础样式映射
    let styleObj = theme.styles[tagName as keyof typeof theme.styles];
    
    // 特定标签的特殊处理
    if (tagName === 'img') styleObj = theme.styles.image;

    if (styleObj) {
      Object.entries(styleObj).forEach(([key, value]) => {
        // TypeScript 的 HTMLElement.style 接受 camelCase 属性名
        (element.style as any)[key] = value;
      });
    }

    // 处理子节点
    Array.from(element.children).forEach(child => {
      applyStyles(child as HTMLElement);
    });
  };

  // 给最外层的 body 模拟容器包裹
  const container = document.createElement('div');
  container.className = 'markdown-body';
  // 注入容器样式
  if (theme.styles.container) {
    Object.entries(theme.styles.container).forEach(([key, value]) => {
      (container.style as any)[key] = value;
    });
  }

  // 将所有解析出的节点移入我们的容器中，并应用样式
  Array.from(doc.body.children).forEach(child => {
    let targetChild = child as HTMLElement;
    
    // 如果是 table，微信推荐外层包裹一层 section 支持横向滚动
    if (targetChild.tagName.toLowerCase() === 'table') {
      const wrapper = document.createElement('section');
      wrapper.style.overflowX = 'auto';
      wrapper.style.width = '100%';
      wrapper.style.boxSizing = 'border-box';
      wrapper.appendChild(targetChild);
      targetChild = wrapper;
    }

    applyStyles(targetChild);
    container.appendChild(targetChild);
  });

  return container.outerHTML;
};
