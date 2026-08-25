import { marked } from 'marked';
import hljs from 'highlight.js';
import mermaid from 'mermaid';
import type { Theme } from './themes';

// 初始化 mermaid，选择干净的主题
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
});

export const parseMarkdown = async (markdown: string, theme: Theme): Promise<string> => {
  // 预处理：自己解析引用链接图片，因为 marked 不支持过长的 base64 URL
  const imageRefs: Record<string, string> = {};
  
  // 提取所有的 [id]: data:... 
  let processedMarkdown = markdown.replace(/^\s*\[([^\]]+)\]:\s*(data:image\/[^;]+;base64,\S+)/gm, (_match, id, data) => {
    imageRefs[id] = data;
    return ''; // 从 markdown 中移除，避免 marked 解析失败暴露源码
  });

  // 替换所有的 ![alt][id] 语法为真实的 HTML 标签
  processedMarkdown = processedMarkdown.replace(/!\[([^\]]*)\]\[([^\]]+)\]/g, (match, alt, id) => {
    if (imageRefs[id]) {
      return `<img src="${imageRefs[id]}" alt="${alt}" />`;
    }
    return match; // 如果没找到引用，保留原样
  });

  // 设置 marked，使用 highlight.js
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // 使用 marked 解析出基础 HTML
  const rawHtml = marked.parse(processedMarkdown) as string;

  // 使用浏览器自带的 DOMParser 解析 HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // 1. 处理 Mermaid 图表（转换为 Base64 PNG 供微信识别）
  const mermaidBlocks = Array.from(doc.querySelectorAll('pre code.language-mermaid'));
  for (let i = 0; i < mermaidBlocks.length; i++) {
    const block = mermaidBlocks[i];
    const pre = block.parentElement;
    if (!pre) continue;

    const graphDefinition = block.textContent || '';
    const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

    try {
      const { svg } = await mermaid.render(id, graphDefinition);
      
      // 使用 Blob 和 Canvas 将 SVG 转换为 PNG
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      
      const canvas = document.createElement('canvas');
      const scale = 2; // 2倍图保证清晰度
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        // 填充白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0);
      }
      
      const pngDataUrl = canvas.toDataURL('image/png');
      URL.revokeObjectURL(url);
      
      // 用生成的图片替换原有的代码块
      const imgNode = document.createElement('img');
      imgNode.src = pngDataUrl;
      imgNode.style.maxWidth = '100%';
      imgNode.style.display = 'block';
      imgNode.style.margin = '20px auto';
      pre.replaceWith(imgNode);
    } catch (err) {
      console.error('Mermaid 渲染失败', err);
      // 如果渲染失败，保留源代码块并变红提示
      block.innerHTML = '【图表渲染失败，请检查 Mermaid 语法】\n' + block.innerHTML;
      (block as HTMLElement).style.color = 'red';
    }
  }

  // 2. 高亮剩余的普通代码块
  doc.querySelectorAll('pre code:not(.language-mermaid)').forEach((block) => {
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
