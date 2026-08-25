export interface MermaidThemeOption {
  id: string;
  name: string;
  theme: 'default' | 'neutral' | 'forest' | 'base' | 'dark';
}

export const mermaidThemeOptions: MermaidThemeOption[] = [
  { id: 'default', name: '经典浅蓝 (Default)', theme: 'default' },
  { id: 'neutral', name: '严谨素雅 (Neutral)', theme: 'neutral' },
  { id: 'forest', name: '清新森林 (Forest)', theme: 'forest' },
  { id: 'base', name: '紫韵优雅 (Base)', theme: 'base' },
  { id: 'dark', name: '极客暗黑 (Dark)', theme: 'dark' },
];

export const getMermaidTheme = (id: string): MermaidThemeOption => {
  return mermaidThemeOptions.find(t => t.id === id) || mermaidThemeOptions[0];
};
