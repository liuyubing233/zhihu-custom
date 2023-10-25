import { domA, domC } from '../commons/tools';
import { store } from '../store';

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

// /** 视频跳转链接 */
// export const zoomVideos = () => {
//   const { getConfig } = store;
//   const { linkAnswerVideo } = getConfig();
//   if (linkAnswerVideo !== '1') return;
//   const itemClick = (item: IMyElement) => {
//     item.onclick = () => {
//       const itemParent = domP(item, 'class', 'VideoAnswerPlayer');
//       if (itemParent) {
//         // 可跳转视频链接
//         const nodeVideo = itemParent.querySelector('.VideoAnswerPlayer-video video') as IMyElement;
//         const videoLink = nodeVideo ? nodeVideo.src : '';
//         videoLink && window.open(videoLink);
//       } else {
//         // 不可跳转视频链接
//         const nodeVideoCard = item.querySelector('.VideoCard') as IMyElement;
//         nodeVideoCard && (nodeVideoCard.style.cssText = `opacity: 1;height: auto;`);
//       }
//     };
//   };
//   domA('.VideoContributionAnswer-container').forEach(itemClick);
//   domA('.RichText-video').forEach(itemClick);
//   domA('.VideoAnswerPlayer-stateBar').forEach(itemClick);
// };

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

/** 视频内容替换为视频链接 */
export const itemVideoUseLink = (nodeAnswerItem: HTMLElement) => {
  const { videoUseLink } = store.getConfig();
  if (!videoUseLink) return;
  const classNameForVideoBox = '.css-1h1xzpn'; // 回答中视频盒子的类名（后续可能会更改）
  const classNameVideoLink = 'ctz-video-link';
  const classNameVideoCommit = 'ctz-video-commit';
  const domVideos = nodeAnswerItem.querySelectorAll(classNameForVideoBox);
  for (let i = 0, len = domVideos.length; i < len; i++) {
    const domVideoBox = domVideos[i] as HTMLElement;
    const domVideoBoxParent = domVideoBox.parentElement;
    if (!domVideoBoxParent) continue;
    domVideoBox.style.display = 'none';
    domVideoBoxParent.style.textAlign = 'center';
    if (domVideoBoxParent.querySelector(`.${classNameVideoLink}`)) continue;
    const domVideo = domVideoBox.querySelector('video');
    const domImgCover = domVideoBox.querySelector('img');
    const domVideoCommit = domVideoBoxParent.querySelector(`.${classNameVideoCommit}`);
    domVideoCommit && domVideoCommit.remove();
    if (domVideo) {
      const srcVideo = domVideo.src;
      const srcCoverImg = domImgCover ? domImgCover.src : '';
      const nDomVideoLink = domC('a', {
        href: srcVideo,
        className: classNameVideoLink,
        target: '_blank',
        innerHTML: `${srcCoverImg ? `<img src="${srcCoverImg}" />` : ''}<span>视频链接，点击跳转查看</span>`,
      });
      domVideoBoxParent.appendChild(nDomVideoLink);
    } else {
      const nDomVideoCommit = domC('span', {
        innerText: '视频资源加载中...',
        className: classNameVideoCommit,
      });
      domVideoBoxParent.appendChild(nDomVideoCommit);
    }
  }
};
