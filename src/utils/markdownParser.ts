import { marked } from 'marked';
import hljs from 'highlight.js';
import mermaid from 'mermaid';
import type { Theme } from './themes';
import { getCodeTheme, type CodeTheme } from './codeThemes';
import { getMermaidTheme, type MermaidThemeOption } from './mermaidThemes';

// 初始化 mermaid
mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'default',
});

export const parseMarkdown = async (
  markdown: string,
  theme: Theme,
  codeTheme: CodeTheme = getCodeTheme('one-dark'),
  mermaidThemeOption: MermaidThemeOption = getMermaidTheme('default')
): Promise<string> => {
  // 预处理：自己解析引用链接图片，彻底避免任何 Base64 URL 泄露到正文中
  const imageRefs: Record<string, string> = {};
  
  // 1. 提取并清除所有的 [id]: data:image/... 引用定义
  let processedMarkdown = markdown.replace(/\[([^\]]+)\]:\s*(data:image\/[^\s"'<>]+)/gi, (_match, id, data) => {
    imageRefs[id.trim()] = data.trim();
    return ''; // 从 markdown 中彻底移除
  });

  // 2. 防御性清理任何可能残留的格式
  processedMarkdown = processedMarkdown.replace(/^\s*\[[^\]]+\]:\s*data:image\/[^\s]+/gim, '');

  // 3. 替换所有的 ![alt][id] 语法为真实的 HTML <img> 标签
  processedMarkdown = processedMarkdown.replace(/!\[([^\]]*)\]\[([^\]]+)\]/g, (match, alt, id) => {
    const trimmedId = id.trim();
    if (imageRefs[trimmedId]) {
      return `<img src="${imageRefs[trimmedId]}" alt="${alt}" />`;
    }
    return match; // 如果没找到引用，保留原样
  });

  // 4. 设置 marked
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // 5. 使用 marked 解析出基础 HTML
  const rawHtml = marked.parse(processedMarkdown) as string;

  // 6. 使用 DOMParser 解析 HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // 7. 处理 Mermaid 图表
  try {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: mermaidThemeOption.theme,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    });
  } catch (e) {
    console.warn('Mermaid re-init error:', e);
  }

  const mermaidBlocks = Array.from(doc.querySelectorAll('pre code.language-mermaid'));
  for (let i = 0; i < mermaidBlocks.length; i++) {
    const block = mermaidBlocks[i];
    const pre = block.parentElement;
    if (!pre) continue;

    const graphDefinition = block.textContent?.trim() || '';
    const id = `mermaid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    try {
      const { svg } = await mermaid.render(id, graphDefinition);
      
      // 解析 SVG 尺寸以确保 Canvas 缩放精准
      let width = 600;
      let height = 300;
      try {
        const svgDoc = new DOMParser().parseFromString(svg, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        if (svgElement) {
          const viewBox = svgElement.getAttribute('viewBox');
          if (viewBox) {
            const parts = viewBox.split(/\s+/).map(Number);
            if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
              width = parts[2];
              height = parts[3];
            }
          }
          svgElement.setAttribute('width', `${width}`);
          svgElement.setAttribute('height', `${height}`);
        }
      } catch {
        // 尺寸解析失败则使用默认值
      }

      // 尝试转为高清 2x PNG 供微信排版
      let renderedElement: HTMLElement | null = null;
      try {
        const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = mermaidThemeOption.theme === 'dark' ? '#1e1e1e' : '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, width, height);
          const pngDataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);

          const wrapper = document.createElement('section');
          wrapper.style.textAlign = 'center';
          wrapper.style.margin = '24px 0';
          wrapper.style.maxWidth = '100%';
          wrapper.style.overflowX = 'auto';

          const imgNode = document.createElement('img');
          imgNode.src = pngDataUrl;
          imgNode.style.maxWidth = '100%';
          imgNode.style.borderRadius = '8px';
          imgNode.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)';
          imgNode.style.display = 'inline-block';
          wrapper.appendChild(imgNode);
          renderedElement = wrapper;
        }
      } catch (canvasErr) {
        console.warn('Canvas PNG conversion failed, fallback to SVG:', canvasErr);
      }

      // Fallback: 如果 Canvas 转换遇到安全域或环境问题，直接安全内嵌 SVG 节点
      if (!renderedElement) {
        const wrapper = document.createElement('section');
        wrapper.style.textAlign = 'center';
        wrapper.style.margin = '24px 0';
        wrapper.style.maxWidth = '100%';
        wrapper.style.overflowX = 'auto';
        wrapper.innerHTML = svg;
        renderedElement = wrapper;
      }

      pre.replaceWith(renderedElement);
    } catch (err) {
      console.error('Mermaid 渲染失败', err);
      block.innerHTML = '【Mermaid 图表语法有误，请检查】\n' + block.innerHTML;
      (block as HTMLElement).style.color = '#e06c75';
    }
  }

  // 8. 处理普通代码块（语法高亮 + Mac 视窗设计 + 主题内联）
  const codeBlocks = Array.from(doc.querySelectorAll('pre code:not(.language-mermaid)'));
  for (const block of codeBlocks) {
    const pre = block.parentElement;
    if (!pre) continue;

    // 获取语言名称
    let lang = '';
    const classNames = block.className.split(/\s+/);
    for (const cls of classNames) {
      if (cls.startsWith('language-') || cls.startsWith('lang-')) {
        lang = cls.replace(/^(language-|lang-)/, '').toUpperCase();
        break;
      }
    }

    // 执行 highlight.js 语法解析
    hljs.highlightElement(block as HTMLElement);

    // 将高亮后的所有 span.hljs-* 转换为内联样式
    const tokenSpans = block.querySelectorAll('[class*="hljs-"]');
    tokenSpans.forEach((span) => {
      const spanEl = span as HTMLElement;
      spanEl.className.split(/\s+/).forEach((cls) => {
        if (cls.startsWith('hljs-')) {
          const tokenName = cls.replace('hljs-', '');
          const style = codeTheme.tokenStyles[tokenName];
          if (style) {
            spanEl.style.cssText += ';' + style;
          }
        }
      });
    });

    // 创建 Mac 风格代码视窗容器
    const containerSec = document.createElement('section');
    containerSec.style.margin = '1.8em 0';
    containerSec.style.borderRadius = '8px';
    containerSec.style.overflow = 'hidden';
    containerSec.style.border = `1px solid ${codeTheme.borderColor}`;
    containerSec.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.06)';
    containerSec.style.boxSizing = 'border-box';

    // Mac 顶栏（红黄绿三色圆点 + 语言标签）
    const headerDiv = document.createElement('div');
    headerDiv.style.backgroundColor = codeTheme.macHeaderBg;
    headerDiv.style.padding = '8px 14px';
    headerDiv.style.display = 'flex';
    headerDiv.style.alignItems = 'center';
    headerDiv.style.justifyContent = 'space-between';
    headerDiv.style.borderBottom = `1px solid ${codeTheme.borderColor}`;
    headerDiv.style.boxSizing = 'border-box';

    const dotsDiv = document.createElement('div');
    dotsDiv.style.display = 'flex';
    dotsDiv.style.alignItems = 'center';
    dotsDiv.style.gap = '6px';
    dotsDiv.innerHTML = `
      <span style="width: 10px; height: 10px; border-radius: 50%; background-color: #ff5f56; display: inline-block;"></span>
      <span style="width: 10px; height: 10px; border-radius: 50%; background-color: #ffbd2e; display: inline-block;"></span>
      <span style="width: 10px; height: 10px; border-radius: 50%; background-color: #27c93f; display: inline-block;"></span>
    `;

    const langSpan = document.createElement('span');
    langSpan.style.fontSize = '11px';
    langSpan.style.fontWeight = '600';
    langSpan.style.letterSpacing = '0.5px';
    langSpan.style.color = codeTheme.isDark ? '#858585' : '#999999';
    langSpan.style.fontFamily = 'Consolas, Monaco, monospace';
    langSpan.textContent = lang || 'CODE';

    headerDiv.appendChild(dotsDiv);
    headerDiv.appendChild(langSpan);

    // 代码内容区
    const codePre = document.createElement('pre');
    codePre.style.margin = '0';
    codePre.style.padding = '14px 16px';
    codePre.style.backgroundColor = codeTheme.background;
    codePre.style.color = codeTheme.color;
    codePre.style.fontFamily = "Consolas, Monaco, 'Courier New', monospace";
    codePre.style.fontSize = '13.5px';
    codePre.style.lineHeight = '1.65';
    codePre.style.overflowX = 'auto';
    codePre.style.boxSizing = 'border-box';

    const codeEl = document.createElement('code');
    codeEl.style.fontFamily = 'inherit';
    codeEl.style.fontSize = 'inherit';
    codeEl.style.color = 'inherit';
    codeEl.style.backgroundColor = 'transparent';
    codeEl.innerHTML = block.innerHTML;

    codePre.appendChild(codeEl);
    containerSec.appendChild(headerDiv);
    containerSec.appendChild(codePre);

    pre.replaceWith(containerSec);
  }

  // 9. 递归遍历 DOM 树，注入内联文章样式
  const applyStyles = (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    
    // 基础样式映射
    let styleObj = theme.styles[tagName as keyof typeof theme.styles];
    
    // 特定标签的特殊处理
    if (tagName === 'img') styleObj = theme.styles.image;

    if (styleObj) {
      Object.entries(styleObj).forEach(([key, value]) => {
        (element.style as any)[key] = value;
      });
    }

    // 处理子节点
    Array.from(element.children).forEach(child => {
      // 避免覆盖我们刚才已经格式化好的 Mac 代码块和 Mermaid
      if (!child.closest('section[style*="border-radius: 8px"]') && !child.closest('section[style*="text-align: center"]')) {
        applyStyles(child as HTMLElement);
      }
    });
  };

  // 给最外层包裹微信容器
  const container = document.createElement('div');
  container.className = 'markdown-body';
  if (theme.styles.container) {
    Object.entries(theme.styles.container).forEach(([key, value]) => {
      (container.style as any)[key] = value;
    });
  }

  // 将所有解析出的节点移入容器
  Array.from(doc.body.children).forEach(child => {
    let targetChild = child as HTMLElement;
    
    // 如果是 table，外层包裹一层 section 支持微信横向滚动
    if (targetChild.tagName.toLowerCase() === 'table') {
      const wrapper = document.createElement('section');
      wrapper.style.overflowX = 'auto';
      wrapper.style.width = '100%';
      wrapper.style.boxSizing = 'border-box';
      wrapper.style.margin = '1.5em 0';
      wrapper.appendChild(targetChild);
      targetChild = wrapper;
    }

    applyStyles(targetChild);
    container.appendChild(targetChild);
  });

  return container.outerHTML;
};
