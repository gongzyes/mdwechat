import { describe, it, expect } from 'vitest';
import { parseMarkdown } from './markdownParser';
import { themes } from './themes';

describe('Markdown Parser', () => {
  const theme = themes[0]; // 使用学术经典作为测试基础

  it('should parse headings without undefined', () => {
    const md = '## 测试标题';
    const html = parseMarkdown(md, theme);
    expect(html).toContain('<h2');
    expect(html).toContain('测试标题');
    expect(html).not.toContain('undefined');
  });

  it('should parse lists without undefined', () => {
    const md = '- 列表项一\n- 列表项二';
    const html = parseMarkdown(md, theme);
    expect(html).toContain('<ul');
    expect(html).toContain('<li');
    expect(html).toContain('列表项一');
    expect(html).toContain('列表项二');
    expect(html).not.toContain('undefined');
  });

  it('should parse tables correctly and wrap them in a section', () => {
    const md = '| 头部1 | 头部2 |\n| --- | --- |\n| 单元1 | 单元2 |';
    const html = parseMarkdown(md, theme);
    // 检查表头和内容
    expect(html).toContain('<table');
    expect(html).toContain('<th');
    expect(html).toContain('<td');
    expect(html).toContain('头部1');
    expect(html).toContain('单元1');
    // 检查微信的横向滚动包装层
    expect(html).toContain('<section style="overflow-x: auto;');
    expect(html).not.toContain('[object Object]');
    expect(html).not.toContain('undefined');
  });

  it('should parse code blocks and apply highlight.js', () => {
    const md = '\`\`\`javascript\nconst a = 1;\n\`\`\`';
    const html = parseMarkdown(md, theme);
    expect(html).toContain('<pre');
    expect(html).toContain('<code');
    // highlight.js 会注入 hljs 类名以及特定语言的类名
    expect(html).toContain('hljs');
    expect(html).toContain('language-javascript');
    expect(html).not.toContain('undefined');
  });

  it('should parse images properly', () => {
    const md = '![Alt文本](https://example.com/image.png)';
    const html = parseMarkdown(md, theme);
    expect(html).toContain('<img');
    expect(html).toContain('src="https://example.com/image.png"');
    expect(html).toContain('alt="Alt文本"');
    // 检查图片是否有内置样式，比如 max-width 100%
    expect(html).toContain('max-width: 100%');
  });
});
