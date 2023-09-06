import { domA } from '../commons/tools';
import { myPreview } from '../methods/preview';
import { store } from '../store';

/** 加载预览图片方法，解决部分图片无法点击预览的问题 */
export const initImagePreview = () => {
  const { zoomImageType } = store.getConfig();
  const images = [domA('.TitleImage'), domA('.ArticleItem-image'), domA('.ztext figure .content_image')];
  images.forEach((events) => {
    events.forEach((e) => {
      const src = e.src || (e.style.backgroundImage && e.style.backgroundImage.split('("')[1].split('")')[0]);
      e.onclick = () => myPreview.open(src);
    });
  });
  if (zoomImageType === '2') {
    domA('.origin_image').forEach((item) => {
      item.src = item.getAttribute('data-original') || item.src;
      item.style.cssText = 'max-width: 100%;';
    });
  }
};
