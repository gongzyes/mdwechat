export type ThemeStyles = {
  container: React.CSSProperties;
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  p: React.CSSProperties;
  blockquote: React.CSSProperties;
  ul: React.CSSProperties;
  ol: React.CSSProperties;
  li: React.CSSProperties;
  strong: React.CSSProperties;
  code: React.CSSProperties;
  pre: React.CSSProperties;
  a: React.CSSProperties;
  image: React.CSSProperties;
  table: React.CSSProperties;
  th: React.CSSProperties;
  td: React.CSSProperties;
};

export type Theme = {
  id: string;
  name: string;
  styles: ThemeStyles;
};

// 基础排版参数（针对微信公众号优化）
const baseStyles: Partial<ThemeStyles> = {
  container: {
    fontSize: '15px',
    color: '#3f3f3f',
    lineHeight: '1.75',
    letterSpacing: '0.05em',
    wordWrap: 'break-word',
    textAlign: 'justify',
    boxSizing: 'border-box',
  },
  p: {
    margin: '1.2em 0',
    lineHeight: '1.75',
    boxSizing: 'border-box',
  },
  image: {
    display: 'block',
    margin: '20px auto',
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '1.2em 0',
    wordBreak: 'break-word',
  },
  th: {
    padding: '8px',
    border: '1px solid #dfdfdf',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    boxSizing: 'border-box',
  },
  td: {
    padding: '8px',
    border: '1px solid #dfdfdf',
    boxSizing: 'border-box',
  }
};

export const themes: Theme[] = [
  {
    id: 'academic',
    name: '学术经典',
    styles: {
      ...(baseStyles as ThemeStyles),
      container: {
        ...baseStyles.container,
        color: '#222',
      },
      h1: {
        textAlign: 'center',
        color: '#175199',
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '1.5em 0',
        padding: '0.5em 0',
        borderTop: '2px solid #175199',
        borderBottom: '2px solid #175199',
      },
      h2: {
        color: '#175199',
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '1.5em 0 1em',
        paddingLeft: '10px',
        borderLeft: '4px solid #175199',
      },
      h3: {
        color: '#175199',
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '1.2em 0 0.8em',
      },
      p: { ...baseStyles.p! },
      blockquote: {
        margin: '1.2em 0',
        padding: '1em',
        backgroundColor: '#F0F8FF',
        borderLeft: '4px solid #175199',
        color: '#444',
        fontSize: '14px',
      },
      ul: {
        paddingLeft: '1.5em',
        margin: '1em 0',
        listStyleType: 'disc',
        color: '#175199',
      },
      ol: {
        paddingLeft: '1.5em',
        margin: '1em 0',
        listStyleType: 'decimal',
        color: '#175199',
      },
      li: {
        margin: '0.5em 0',
        color: '#333',
      },
      strong: {
        color: '#175199',
        fontWeight: 'bold',
      },
      code: {
        backgroundColor: '#f6f8fa',
        color: '#175199',
        padding: '2px 4px',
        borderRadius: '3px',
        fontSize: '14px',
        fontFamily: 'monospace',
      },
      pre: {
        backgroundColor: '#282c34',
        color: '#abb2bf',
        padding: '1em',
        borderRadius: '6px',
        overflowX: 'auto',
        margin: '1.2em 0',
        fontSize: '14px',
      },
      a: {
        color: '#175199',
        textDecoration: 'none',
        borderBottom: '1px solid #175199',
      },
      image: { ...baseStyles.image! },
      table: { ...baseStyles.table! },
      th: { ...baseStyles.th! },
      td: { ...baseStyles.td! }
    },
  },
  {
    id: 'campus',
    name: '校园活力',
    styles: {
      ...(baseStyles as ThemeStyles),
      h1: {
        textAlign: 'center',
        backgroundColor: '#2BAE66',
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '1.5em auto',
        padding: '8px 20px',
        borderRadius: '20px',
        display: 'inline-block',
      },
      h2: {
        color: '#2BAE66',
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '1.5em 0 1em',
        padding: '6px 16px',
        backgroundColor: '#E9F6F0',
        borderRadius: '16px',
        display: 'inline-block',
      },
      h3: {
        color: '#2BAE66',
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '1.2em 0 0.8em',
      },
      p: { ...baseStyles.p! },
      blockquote: {
        margin: '1.2em 0',
        padding: '1em',
        backgroundColor: '#FAFAFA',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(43, 174, 102, 0.1)',
        color: '#555',
        fontSize: '14px',
        border: '1px solid #E9F6F0',
      },
      ul: {
        paddingLeft: '1.5em',
        margin: '1em 0',
        listStyleType: 'circle',
        color: '#2BAE66',
      },
      ol: {
        paddingLeft: '1.5em',
        margin: '1em 0',
        listStyleType: 'decimal',
        color: '#2BAE66',
      },
      li: {
        margin: '0.5em 0',
        color: '#444',
      },
      strong: {
        color: '#2BAE66',
        fontWeight: 'bold',
        borderBottom: '2px solid rgba(43, 174, 102, 0.3)',
      },
      code: {
        backgroundColor: '#E9F6F0',
        color: '#2BAE66',
        padding: '2px 4px',
        borderRadius: '4px',
        fontSize: '14px',
      },
      pre: {
        backgroundColor: '#fafafa',
        border: '1px solid #e0e0e0',
        padding: '1em',
        borderRadius: '8px',
        overflowX: 'auto',
        margin: '1.2em 0',
      },
      a: {
        color: '#2BAE66',
        textDecoration: 'none',
      },
      image: { ...baseStyles.image!, borderRadius: '8px' },
      table: { ...baseStyles.table! },
      th: { ...baseStyles.th!, backgroundColor: '#E9F6F0', color: '#2BAE66', border: '1px solid #cce8da' },
      td: { ...baseStyles.td!, border: '1px solid #cce8da' }
    }
  },
  {
    id: 'formal',
    name: '行政严谨',
    styles: {
      ...(baseStyles as ThemeStyles),
      container: {
        ...baseStyles.container,
        lineHeight: '2.0',
        color: '#000',
      },
      h1: {
        textAlign: 'center',
        color: '#C00000',
        fontSize: '22px',
        fontWeight: 'bold',
        fontFamily: 'SimSun, "Songti SC", serif',
        margin: '2em 0',
        paddingBottom: '10px',
        borderBottom: '2px solid #C00000',
        borderTop: '2px solid #C00000',
        paddingTop: '10px',
      },
      h2: {
        textAlign: 'center',
        color: '#C00000',
        fontSize: '18px',
        fontWeight: 'bold',
        fontFamily: 'SimSun, "Songti SC", serif',
        margin: '1.5em 0 1em',
      },
      h3: {
        color: '#000',
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '1.2em 0 0.8em',
        fontFamily: 'SimSun, "Songti SC", serif',
      },
      p: { ...baseStyles.p!, textIndent: '2em', textAlign: 'justify' }, // 红头文件一般首行缩进
      blockquote: {
        margin: '1.5em 0',
        padding: '1em 2em',
        border: '1px solid #C00000',
        color: '#000',
        fontFamily: 'KaiTi, "Kaiti SC", serif',
        fontSize: '15px',
        textIndent: '2em',
      },
      ul: {
        paddingLeft: '2em',
        margin: '1em 0',
        listStyleType: 'none',
      },
      ol: {
        paddingLeft: '2.5em',
        margin: '1em 0',
      },
      li: {
        margin: '0.5em 0',
        position: 'relative',
      },
      strong: {
        color: '#C00000',
        fontWeight: 'bold',
      },
      code: {
        backgroundColor: '#f1f1f1',
        padding: '2px 4px',
        fontSize: '14px',
      },
      pre: {
        backgroundColor: '#f9f9f9',
        border: '1px solid #ccc',
        padding: '1em',
        margin: '1.2em 0',
        overflowX: 'auto',
      },
      a: {
        color: '#C00000',
        textDecoration: 'underline',
      },
      image: { ...baseStyles.image! },
      table: { ...baseStyles.table!, border: '2px solid #000' },
      th: { ...baseStyles.th!, border: '1px solid #000', backgroundColor: '#fff', color: '#000' },
      td: { ...baseStyles.td!, border: '1px solid #000' }
    }
  },
  {
    id: 'minimalist',
    name: '极简科研',
    styles: {
      ...(baseStyles as ThemeStyles),
      container: {
        ...baseStyles.container,
        color: '#333',
        lineHeight: '1.6',
      },
      h1: {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '1.5em 0 1em',
        color: '#111',
      },
      h2: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '1.2em 0 0.8em',
        color: '#222',
        borderBottom: '1px solid #eee',
        paddingBottom: '0.3em',
      },
      h3: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '1em 0 0.5em',
        color: '#333',
      },
      p: { ...baseStyles.p! },
      blockquote: {
        margin: '1.2em 0',
        paddingLeft: '1em',
        borderLeft: '4px solid #ddd',
        color: '#666',
      },
      ul: {
        paddingLeft: '1.5em',
        margin: '1em 0',
        listStyleType: 'square',
      },
      ol: {
        paddingLeft: '1.5em',
        margin: '1em 0',
      },
      li: {
        margin: '0.3em 0',
      },
      strong: {
        fontWeight: '600',
        color: '#000',
      },
      code: {
        backgroundColor: '#f3f4f6',
        padding: '0.2em 0.4em',
        borderRadius: '3px',
        fontSize: '85%',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      },
      pre: {
        backgroundColor: '#1f2937',
        color: '#e5e7eb',
        padding: '1em',
        borderRadius: '6px',
        overflowX: 'auto',
        margin: '1.2em 0',
        fontSize: '14px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      },
      a: {
        color: '#000',
        textDecoration: 'underline',
      },
      image: { ...baseStyles.image! },
      table: { ...baseStyles.table! },
      th: { ...baseStyles.th!, backgroundColor: '#f9fafb', borderColor: '#e5e7eb' },
      td: { ...baseStyles.td!, borderColor: '#e5e7eb' }
    }
  }
];

export const getTheme = (id: string): Theme => {
  return themes.find(t => t.id === id) || themes[0];
};

export const styleObjectToString = (style: React.CSSProperties): string => {
  return Object.entries(style)
    .map(([key, value]) => {
      // camelCase to kebab-case
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}:${value}`;
    })
    .join(';');
};
