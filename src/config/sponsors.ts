export interface SponsorAd {
  id: string;
  title: string;
  badge: string;
  description: string;
  link: string;
  btnText: string;
}

export interface BottomStatusAd {
  badge: string;
  text: string;
  highlight: string;
  link: string;
}

export const sponsorConfig = {
  // 底部状态栏原生文字推广（腾讯云 WorkBuddy 推广链接）
  bottomStatusAd: {
    badge: '特惠',
    text: '腾讯云 WorkBuddy / 开发者上云专区：',
    highlight: '新老用户特惠限时直达 🚀',
    link: 'https://curl.qcloud.com/MrjROrJN',
  },

  // 复制成功弹窗中的推荐卡片（阿里云推广链接）
  copySuccessAd: {
    tag: '高校与开发者特惠',
    title: '阿里云跨端算力与云产品专属权益',
    description: '高校科研上云、部署专属 AI 服务与建站，领新人专享大额福利礼包',
    btnText: '一键直达领取',
    link: 'https://www.aliyun.com/benefit/client/cross?userCode=il5dziv2',
  },

  // 赞赏支持配置
  donation: {
    title: '支持作者持续维护',
    subtitle: '如果这款工具提升了您的排版效率，欢迎支持本项目 ☕',
    note: '所有赞助将用于服务器维持与新功能开发（如更多高校专属模板、AI 智能排版等）',
    qrImage: '', // 暂不放置个人收款二维码
  }
};
