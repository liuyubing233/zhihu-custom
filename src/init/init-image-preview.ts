import { domA } from '../commons/tools';
import { myPreview } from '../methods/preview';
import { store } from '../store';

/** 加载预览图片方法，解决部分图片无法点击预览的问题 */
export const initImagePreview = () => {
  const { zoomImageType } = store.getConfig();
  const images = [domA('.TitleImage'), domA('.ArticleItem-image'), domA('.ztext figure .content_image')];
  for (let i = 0, imageLen = images.length; i < imageLen; i++) {
    const ev = images[i];
    for (let index = 0, len = ev.length; index < len; index++) {
      const nodeItem = ev[index];
      const src = nodeItem.src || (nodeItem.style.backgroundImage && nodeItem.style.backgroundImage.split('("')[1].split('")')[0]);
      nodeItem.onclick = () => myPreview.open(src);
    }
  }

  if (zoomImageType === '2') {
    const originImages = domA('.origin_image');
    for (let i = 0, len = originImages.length; i < len; i++) {
      const nodeItem = originImages[i];
      nodeItem.src = nodeItem.getAttribute('data-original') || nodeItem.src;
      nodeItem.style.cssText = 'max-width: 100%;';
    }
  }
};
