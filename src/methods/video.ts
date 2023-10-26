import { domC } from '../commons/tools';
import { store } from '../store';

const findDoms = (nodeFound: HTMLElement, domNames: string[]): NodeListOf<Element> => {
  const doms = domNames.map((i) => nodeFound.querySelectorAll(i));
  for (let i = 0, len = doms.length; i < len; i++) {
    if (doms[i].length) {
      return doms[i];
    }
  }
  return doms[doms.length - 1];
};

/** 加载视频下载方法 */
export const initVideoDownload = (nodeFound: HTMLElement) => {
  setTimeout(() => {
    const domVideos = findDoms(nodeFound, ['.ZVideo-player>div', '.css-1h1xzpn', '.VideoAnswerPlayer-video']);
    for (let i = 0, len = domVideos.length; i < len; i++) {
      const domVideoBox = domVideos[i] as HTMLElement;
      const nDomDownload = domC('i', { className: 'ctz-icon ctz-video-download', innerHTML: '&#xe608;' });
      const nDomLoading = domC('i', { className: 'ctz-icon ctz-loading', innerHTML: '&#xe605;' });
      nDomDownload.onclick = () => {
        const srcVideo = domVideoBox.querySelector('video')!.src;
        if (srcVideo) {
          nDomDownload.style.display = 'none';
          domVideoBox.appendChild(nDomLoading);
          videoDownload(srcVideo, `video${+new Date()}`).then(() => {
            nDomDownload.style.display = 'block';
            nDomLoading.remove();
          });
        }
      };
      const nodeDownload = domVideoBox.querySelector('.ctz-video-download');
      nodeDownload && nodeDownload.remove();
      domVideoBox.style.cssText += `position: relative;`;
      domVideoBox.appendChild(nDomDownload);
    }
  }, 100);
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
export const itemVideoUseLink = (nodeFound: HTMLElement, prevVideoSrc = '') => {
  setTimeout(() => {
    const { videoUseLink } = store.getConfig();
    if (!videoUseLink) return;
    const classNameVideoLink = 'ctz-video-link';
    const classNameVideoCommit = 'ctz-video-commit';
    const domVideos = findDoms(nodeFound, ['.css-1h1xzpn', '.VideoAnswerPlayer-video']);
    for (let i = 0, len = domVideos.length; i < len; i++) {
      const domVideoBox = domVideos[i] as HTMLElement;
      const domVideoBoxParent = domVideoBox.parentElement as HTMLElement;
      domVideoBox.style.display = 'none';
      domVideoBoxParent.style.textAlign = 'center';
      if (domVideoBoxParent.querySelector(`.${classNameVideoLink}`)) continue;
      const domVideo = domVideoBox.querySelector('video');
      const domImgCover = domVideoBox.querySelector('img');
      const domVideoCommit = domVideoBoxParent.querySelector(`.${classNameVideoCommit}`);
      domVideoCommit && domVideoCommit.remove();
      if (domVideo) {
        const srcVideo = domVideo.src;
        if (prevVideoSrc === srcVideo) continue;
        const srcCoverImg = domImgCover ? domImgCover.src : '';
        const nDomVideoLink = domC('a', {
          href: srcVideo,
          className: classNameVideoLink,
          target: '_blank',
          innerHTML: `${srcCoverImg ? `<img src="${srcCoverImg}" />` : ''}<span>视频链接，点击跳转查看</span>`,
        });
        domVideoBoxParent.appendChild(nDomVideoLink);
        setTimeout(() => {
          itemVideoUseLink(nodeFound, srcVideo);
        }, 2000);
      } else {
        const nDomVideoCommit = domC('span', {
          innerText: '视频资源加载中...',
          className: classNameVideoCommit,
        });
        domVideoBoxParent.appendChild(nDomVideoCommit);
      }
    }
  }, 100);
};
