import { myStorage } from '../commons/storage';
import { domA } from '../commons/tools';
import { myPreview } from '../methods/preview';
import { EZoomImageType } from '../types';

/** 加载预览图片方法，解决部分图片无法点击预览的问题 */
export const initImagePreview = async () => {
  const { zoomImageType } = await myStorage.getConfig();
  const images = [domA('.TitleImage:not(.ctz-processed)'), domA('.ArticleItem-image:not(.ctz-processed)'), domA('.ztext figure .content_image:not(.ctz-processed)')];
  for (let i = 0, imageLen = images.length; i < imageLen; i++) {
    const ev = images[i];
    for (let index = 0, len = ev.length; index < len; index++) {
      const nodeItem = ev[index] as HTMLImageElement;
      nodeItem.classList.add('ctz-processed');
      const src = nodeItem.src || (nodeItem.style.backgroundImage && nodeItem.style.backgroundImage.split('("')[1].split('")')[0]);
      nodeItem.onclick = () => myPreview.open(src);
    }
  }

  if (zoomImageType === EZoomImageType.自定义尺寸) {
    const originImages = domA('.origin_image:not(.ctz-processed)');
    for (let i = 0, len = originImages.length; i < len; i++) {
      const nodeItem = originImages[i] as HTMLImageElement;
      nodeItem.src = nodeItem.getAttribute('data-original') || nodeItem.src;
      nodeItem.classList.add('ctz-processed');
      nodeItem.style.cssText = 'max-width: 100%;';
    }
  }
};
