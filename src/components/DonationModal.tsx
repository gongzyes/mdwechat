import React from 'react';
import { X, Heart, Coffee, ExternalLink } from 'lucide-react';
import { sponsorConfig } from '../config/sponsors';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-100 animate-scaleUp">
        {/* 顶部彩色装饰条 */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-pink-500 to-amber-400" />
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Heart size={20} className="fill-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{sponsorConfig.donation.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{sponsorConfig.donation.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 赞赏内容主体 */}
          <div className="my-6 p-5 bg-amber-50/60 rounded-xl border border-amber-100/80 text-center">
            {sponsorConfig.donation.qrImage ? (
              <div className="flex justify-center my-2">
                <img
                  src={sponsorConfig.donation.qrImage}
                  alt="赞赏二维码"
                  className="w-48 h-48 object-contain rounded-lg shadow-sm"
                />
              </div>
            ) : (
              <div className="py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-3">
                  <Coffee size={32} />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">☕ 请作者喝一杯清凉冰美式</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  支持本项目的独立维护与持续更新，更多高校专属排版主题与图表模板正在加速研发中！
                </p>
              </div>
            )}
            
            <p className="text-[11px] text-amber-800/80 mt-2">
              💡 {sponsorConfig.donation.note}
            </p>
          </div>

          {/* 底部按钮 */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              稍后再说
            </button>
            <a
              href="https://github.com/gongzyes/mdwechat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              <span>GitHub Star 支持</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
