/** 加载预览图片方法，解决部分图片无法点击预览的问题 */
export const initImagePreview = () => {
  const images = [domA('.TitleImage'), domA('.ArticleItem-image'), domA('.ztext figure .content_image')];
  images.forEach((events) => {
    events.forEach((e) => {
      const src = e.src || (e.style.backgroundImage && e.style.backgroundImage.split('("')[1].split('")')[0]);
      e.onclick = () => myPreview.open(src);
    });
  });
  if (pfConfig.zoomImageType === '2') {
    domA('.origin_image').forEach((item) => {
      item.src = item.getAttribute('data-original') || item.src;
      item.style = 'max-width: 100%;';
    });
  }
};

/** 预览动图回调 */
export const callbackGIF = (mutationsList) => {
  const target = mutationsList[0].target;
  const targetClassList = target.classList;
  if (!(targetClassList.contains('isPlaying') && !targetClassList.contains('css-1isopsn') && pfConfig.showGIFinDialog)) return;
  target.querySelector('video') ? myPreview.open(target.querySelector('video').src, target, true) : myPreview.open(target.querySelector('img').src, target);
};
const observerGIF = new MutationObserver(callbackGIF);
/** 挂载预览 observe */
function previewGIF() {
  // 因为 GIF 图是点击后切换到真正 GIF, 所以在点击切换后再打开弹窗
  // 使用 MutationObserver 监听元素属性变化
  if (pfConfig.showGIFinDialog) {
    const config = { attributes: true, attributeFilter: ['class'] };
    domA('.GifPlayer').forEach((event) => observerGIF.observe(event, config));
  } else {
    observerGIF.disconnect();
  }
}
