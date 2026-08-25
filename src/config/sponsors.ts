export interface SponsorAd {
  id: string;
  title: string;
  badge: string;
  description: string;
  link: string;
  btnText: string;
}

export interface BottomStatusAd {
  text: string;
  highlight: string;
  link: string;
}

export const sponsorConfig = {
  // 底部状态栏原生文字推广（点击跳转）
  bottomStatusAd: {
    badge: '推广',
    text: '高校教师与创作者专属：',
    highlight: '免费领 AI 论文润色/降重与文献翻译体验包 🎁',
    link: 'https://github.com/gongzyes/mdwechat', // 用户后续可替换为自己的分销/推广链接
  },

  // 复制成功弹窗中的推荐卡片
  copySuccessAd: {
    tag: '创作者推荐',
    title: '微信公众号 2.35:1 封面图一键裁剪生成工具',
    description: '专为高校融媒体与公众号设计，海量学术/校园风高清免版权配图',
    btnText: '免费体验',
    link: 'https://github.com/gongzyes/mdwechat', // 用户后续可替换为自己的推广链接
  },

  // 赞赏支持配置
  donation: {
    title: '支持作者持续维护',
    subtitle: '如果这款工具提升了您的排版效率，欢迎请作者喝杯咖啡 ☕',
    note: '所有赞赏将用于服务器维持与新功能开发（如更多高校专属模板、AI 智能排版等）',
    // 默认赞赏二维码图片路径（可放置在 public/pay_qr.png）
    qrImage: '', // 如果为空则显示极简爱心赞助卡片
  }
};
