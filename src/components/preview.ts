import { myScroll } from '../commons/scroll-stop-on';
import { dom, domById } from '../commons/tools';

/** 自定义预览方法 */
export const myPreview = {
  // 开启预览弹窗
  open: function (src: string, even?: any, isVideo?: boolean) {
    const nameDom = isVideo ? this.evenPathVideo : this.evenPathImg;
    const idDom = isVideo ? this.idVideo : this.idImg;
    const nodeName = dom(nameDom) as HTMLImageElement;
    const nodeId = domById(idDom);
    nodeName && (nodeName.src = src);
    nodeId && (nodeId.style.display = 'block');
    // 存在 even 则保存，关闭时候清除
    // 解决浏览 GIF 时的弹窗问题
    even && (this.even = even);
    myScroll.stop();
  },
  // 关闭预览弹窗
  hide: function (pEvent: any) {
    if (this.even) {
      (this.even as HTMLButtonElement).click();
      this.even = null;
    }
    pEvent.style.display = 'none';
    const nodeImg = dom(this.evenPathImg) as HTMLImageElement;
    const nodeVideo = dom(this.evenPathVideo) as HTMLVideoElement;
    nodeImg && (nodeImg.src = '');
    nodeVideo && (nodeVideo.src = '');
    myScroll.on();
  },
  even: null,
  evenPathImg: '#CTZ_PREVIEW_IMAGE img',
  evenPathVideo: '#CTZ_PREVIEW_VIDEO video',
  idImg: 'CTZ_PREVIEW_IMAGE',
  idVideo: 'CTZ_PREVIEW_VIDEO',
};
