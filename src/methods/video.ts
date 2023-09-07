import { domA, domC, domP } from '../commons/tools';
import { store } from '../store';
import { IMyElement } from '../types';

interface IMyVideo {
  index: number;
  timeout: NodeJS.Timeout | null;
  init: () => void;
}

/** 视频的操作方法|下载 */
export const myVideo: IMyVideo = {
  index: 0,
  timeout: null,
  init: function () {
    this.timeout && clearTimeout(this.timeout);
    if (this.index < 30) {
      this.timeout = setTimeout(() => {
        if (domA('#player video').length) {
          this.index = 0;
          domA('#player>div').forEach((even) => {
            const elementDownload = domC('i', { className: 'ctz-icon ctz-video-download', innerHTML: '&#xe608;' });
            const elementLoading = domC('i', { className: 'ctz-icon ctz-loading', innerHTML: '&#xe605;' });
            elementDownload.onclick = () => {
              const url = elementDownload.parentElement!.parentElement!.querySelector('video')!.src;
              if (url) {
                elementDownload.style.display = 'none';
                even.appendChild(elementLoading);
                const name = url.match(/(?<=\/)[\d\w-\.]+(?=\?)/)![0];
                videoDownload(url, name).then(() => {
                  elementDownload.style.display = 'block';
                  elementLoading.remove();
                });
              }
            };
            const nodeDownload = even.querySelector('.ctz-video-download');
            nodeDownload && nodeDownload.remove();
            even.appendChild(elementDownload);
          });
        } else {
          this.init();
          this.index++;
        }
      }, 500);
    }
  },
};

/** 视频下载 */
const videoDownload = async (url: string, name: string) => {
  return fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const objectUrl = window.URL.createObjectURL(blob);
      const elementA = domC('a', {
        download: name,
        href: objectUrl,
      });
      elementA.click();
      window.URL.revokeObjectURL(objectUrl);
      elementA.remove();
    });
};

/** 视频跳转链接 */
export const zoomVideos = () => {
  const { getConfig } = store;
  const { linkAnswerVideo } = getConfig();
  if (linkAnswerVideo !== '1') return;
  const itemClick = (item: IMyElement) => {
    item.onclick = () => {
      const itemParent = domP(item, 'class', 'VideoAnswerPlayer');
      if (itemParent) {
        // 可跳转视频链接
        const nodeVideo = itemParent.querySelector('.VideoAnswerPlayer-video video') as IMyElement;
        const videoLink = nodeVideo ? nodeVideo.src : '';
        videoLink && window.open(videoLink);
      } else {
        // 不可跳转视频链接
        const nodeVideoCard = item.querySelector('.VideoCard') as IMyElement;
        nodeVideoCard && (nodeVideoCard.style.cssText = `opacity: 1;height: auto;`);
      }
    };
  };
  domA('.VideoContributionAnswer-container').forEach(itemClick);
  domA('.RichText-video').forEach(itemClick);
  domA('.VideoAnswerPlayer-stateBar').forEach(itemClick);
};

/** 解决视频自动播放问题 */
export const fixVideoAutoPlay = () => {
  // 拦截 video.play() 指令
  var originalPlay = HTMLMediaElement.prototype.play;
  // @ts-ignore
  HTMLMediaElement.prototype.play = function () {
    // 如果视频隐藏则退出
    if (!this.offsetHeight) {
      return;
    }
    // @ts-ignore
    // 否则正常执行 video.play() 指令
    return originalPlay.apply(this, arguments);
  };
};
