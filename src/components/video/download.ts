import { domC, myStorage } from '../../tools';
import { EVideoInAnswerArticle } from '../select';

/** 视频回答的包裹元素1 */
export const CLASS_VIDEO_ONE = '.css-1h1xzpn';
/** 视频回答的包裹元素2 */
export const CLASS_VIDEO_TWO = '.VideoAnswerPlayer-video';
export const CLASS_VIDEO_TWO_BOX = '.VideoAnswerPlayer';

/** 需要转链接的视频元素类名 */
const NEED_LINK_CLASS = [CLASS_VIDEO_ONE, CLASS_VIDEO_TWO];

/** 加载视频下载方法 */
export const initVideoDownload = async (nodeFound?: HTMLElement) => {
  if (!nodeFound) return;
  const { videoInAnswerArticle } = await myStorage.getConfig();
  const domVideos = findDoms(
    nodeFound,
    ['.ZVideo-player>div', CLASS_VIDEO_ONE, CLASS_VIDEO_TWO].filter((i) => {
      return videoInAnswerArticle === EVideoInAnswerArticle.修改为链接 ? !NEED_LINK_CLASS.includes(i) : true;
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

const findDoms = (nodeFound: HTMLElement, domNames: string[]): NodeListOf<Element> => {
  const doms = domNames.map((i) => nodeFound.querySelectorAll(i));
  for (let i = 0, len = doms.length; i < len; i++) {
    if (doms[i].length) {
      return doms[i];
    }
  }
  return doms[doms.length - 1];
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
