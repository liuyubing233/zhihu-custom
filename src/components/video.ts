import { domC, myStorage } from '../tools';

/** 视频回答的包裹元素1 */
export const CLASS_VIDEO_ONE = '.css-1h1xzpn';
/** 视频回答的包裹元素2 */
export const CLASS_VIDEO_TWO = '.VideoAnswerPlayer-video';
/** 需要转链接的视频元素类名 */
const NEED_LINK_CLASS = [CLASS_VIDEO_ONE, CLASS_VIDEO_TWO];

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
export const initVideoDownload = async (nodeFound?: HTMLElement) => {
  if (!nodeFound) return;
  const { videoUseLink } = await myStorage.getConfig();
  const domVideos = findDoms(
    nodeFound,
    ['.ZVideo-player>div', CLASS_VIDEO_ONE, CLASS_VIDEO_TWO].filter((i) => {
      return videoUseLink ? !NEED_LINK_CLASS.includes(i) : true;
    })
  );
  for (let i = 0, len = domVideos.length; i < len; i++) {
    const domVideoBox = domVideos[i] as HTMLElement;
    const nDomDownload = domC('i', { className: 'ctz-video-download', innerHTML: '⤓' });
    const nDomLoading = domC('i', { className: 'ctz-loading', innerHTML: '↻', style: 'color: #fff;position: absolute;top: 20px;left: 20px;' });
    nDomDownload.onclick = function () {
      const me = this as HTMLElement;
      const srcVideo = domVideoBox.querySelector('video')!.src;
      if (srcVideo) {
        me.style.display = 'none';
        domVideoBox.appendChild(nDomLoading);
        videoDownload(srcVideo, `video${+new Date()}`).then(() => {
          me.style.display = 'block';
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
