import { domC } from '../commons/tools';
import { store } from '../store';

/** 加载视频下载方法 */
export const initVideoDownload = (nodeFound: HTMLElement) => {
  const dom1 = nodeFound.querySelectorAll('.ZVideo-player>div');
  const dom2 = nodeFound.querySelectorAll('.css-1h1xzpn');
  const domVideos = dom1.length ? dom1 : dom2;
  for (let i = 0, len = domVideos.length; i < len; i++) {
    const domVideoBox = domVideos[i] as HTMLElement;
    const nDomDownload = domC('i', { className: 'ctz-icon ctz-video-download', innerHTML: '&#xe608;' });
    const nDomLoading = domC('i', { className: 'ctz-icon ctz-loading', innerHTML: '&#xe605;' });
    nDomDownload.onclick = () => {
      const srcVideo = domVideoBox.querySelector('video')!.src;
      if (srcVideo) {
        nDomDownload.style.display = 'none';
        domVideoBox.appendChild(nDomLoading);
        // const name = srcVideo.match(/(?<=\/)[\d\w-\.]+(?=\?)/)![0];
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
export const itemVideoUseLink = (nodeFound: HTMLElement) => {
  const { videoUseLink } = store.getConfig();
  if (!videoUseLink) return;
  const classNameForVideoBox = '.css-1h1xzpn'; // 回答中视频盒子的类名（后续可能会更改）
  const classNameVideoLink = 'ctz-video-link';
  const classNameVideoCommit = 'ctz-video-commit';
  const domVideos = nodeFound.querySelectorAll(classNameForVideoBox);
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
