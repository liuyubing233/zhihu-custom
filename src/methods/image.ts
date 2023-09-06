import { domA } from '../commons/tools';
import { store } from '../store';
import { myPreview } from './preview';

/** 预览动图回调 */
const callbackGIF: MutationCallback = (mutationsList) => {
  const target = mutationsList[0].target as HTMLElement;
  const targetClassList = target.classList;
  const { showGIFinDialog } = store.getConfig();
  if (!(targetClassList.contains('isPlaying') && !targetClassList.contains('css-1isopsn') && showGIFinDialog)) return;
  const nodeVideo = target.querySelector('video');
  const nodeImg = target.querySelector('img');
  const srcImg = nodeImg ? nodeImg.src : '';
  nodeVideo ? myPreview.open(nodeVideo.src, target, true) : myPreview.open(srcImg, target);
};
const observerGIF = new MutationObserver(callbackGIF);
/** 挂载预览 observe */
export function previewGIF() {
  // 因为 GIF 图是点击后切换到真正 GIF, 所以在点击切换后再打开弹窗
  // 使用 MutationObserver 监听元素属性变化
  const { showGIFinDialog } = store.getConfig();
  if (showGIFinDialog) {
    const config = { attributes: true, attributeFilter: ['class'] };
    domA('.GifPlayer').forEach((event) => observerGIF.observe(event, config));
  } else {
    observerGIF.disconnect();
  }
}
