import { myStorage } from '../commons/storage';
import { dom, domA, domById, domP } from '../commons/tools';
import { myPreview } from './preview';

/** 预览动图回调 */
const callbackGIF: MutationCallback = async (mutationsList) => {
  const target = mutationsList[0].target as HTMLElement;
  const targetClassList = target.classList;
  const { showGIFinDialog } = await myStorage.getConfig();
  if (!(targetClassList.contains('isPlaying') && !targetClassList.contains('css-1isopsn') && showGIFinDialog)) return;
  const nodeVideo = target.querySelector('video');
  const nodeImg = target.querySelector('img');
  const srcImg = nodeImg ? nodeImg.src : '';
  nodeVideo ? myPreview.open(nodeVideo.src, target, true) : myPreview.open(srcImg, target);
};
const observerGIF = new MutationObserver(callbackGIF);
/** 挂载预览 observe */
export async function previewGIF() {
  // 因为 GIF 图是点击后切换到真正 GIF, 所以在点击切换后再打开弹窗
  // 使用 MutationObserver 监听元素属性变化
  const { showGIFinDialog } = await myStorage.getConfig();
  if (showGIFinDialog) {
    const nodeGIFs = domA('.GifPlayer:not(.ctz-processed)');
    for (let i = 0, len = nodeGIFs.length; i < len; i++) {
      const item = nodeGIFs[i];
      item.classList.add('ctz-processed');
      observerGIF.observe(item, { attributes: true, attributeFilter: ['class'] });
    }
  } else {
    observerGIF.disconnect();
  }
}

/** 键盘点击下一张或上一张图片（仅静态图片） */
export const keydownNextImage = (event: KeyboardEvent) => {
  const { key } = event;
  const nodeImgDialog = dom('.css-ypb3io') as HTMLImageElement;
  if ((key === 'ArrowRight' || key === 'ArrowLeft') && nodeImgDialog) {
    const src = nodeImgDialog.src;
    const nodeImage = domById('root')!.querySelector(`img[src="${src}"]`) || domById('root')!.querySelector(`img[data-original="${src}"]`);
    const nodeContentInner = domP(nodeImage, 'class', 'RichContent-inner') || domP(nodeImage, 'class', 'Post-RichTextContainer') || domP(nodeImage, 'class', 'QuestionRichText');
    if (nodeContentInner) {
      const images = Array.from(nodeContentInner.querySelectorAll('img')) as HTMLImageElement[];
      const index = images.findIndex((i) => i.src === src || i.getAttribute('data-original') === src);
      const dialogChange = (nodeDialog: HTMLImageElement, nodeImage: HTMLImageElement) => {
        const { innerWidth, innerHeight } = window;
        /** 写死的內联样式宽度 */
        const DIALOG_INNER_WIDTH = 240;
        /** 原本真实的宽度 */
        const ralWidth = +`${nodeImage.getAttribute('data-rawwidth') || nodeImage.getAttribute('width')}`;
        /** 原本真实的高度 */
        const ralHeight = +`${nodeImage.getAttribute('data-rawheight') || nodeImage.getAttribute('height')}`;
        /** 原图 */
        const originSrc = nodeImage.getAttribute('data-original') || nodeImage.src;
        /** 网页宽高比 */
        const aspectRatioWindow = innerWidth / innerHeight;
        /** 图片宽高比 */
        const aspectRatioImage = ralWidth / ralHeight;

        let scaleY = 1;
        let finallyWidth = ralWidth;
        let finallyHeight = ralHeight;

        if (ralHeight >= innerHeight && ralWidth < innerWidth) {
          // 图片原始高度大于网页显示高度，图片原始宽度小于网页显示宽度
          // 高度优先
          finallyHeight = innerHeight;
          scaleY = ralHeight / innerHeight;
          // 最终显示宽度
          finallyWidth = innerHeight * aspectRatioImage;
        }

        if (ralHeight >= innerHeight && ralWidth >= innerWidth) {
          // 图片原始高度大于网页显示高度，图片原始宽度大于网页显示宽度
          // 按照比例缩小
          if (aspectRatioImage > aspectRatioWindow) {
            // 宽度优先
            finallyWidth = innerWidth;
            finallyHeight = finallyWidth / aspectRatioImage;
            scaleY = finallyHeight / ralHeight;
          } else {
            // 高度优先
            finallyHeight = innerHeight;
            scaleY = ralHeight / innerHeight;
            finallyWidth = innerHeight * aspectRatioImage;
          }
        }

        if (ralHeight < innerHeight && ralWidth >= innerWidth) {
          // 图片原始高度小于网页显示高度，图片原始宽度大于网页显示宽度
          // 宽度优先
          finallyWidth = innerWidth;
          finallyHeight = finallyWidth / aspectRatioImage;
          scaleY = finallyHeight / ralHeight;
        }

        if (ralHeight < innerHeight && ralWidth < innerWidth) {
          // 图片原始高度小于网页显示高度，图片原始宽度小于网页显示宽度
          // 根据比例
          finallyWidth = ralWidth;
          finallyHeight = ralHeight;
          scaleY = 1;
        }

        // 最终宽度缩放比例
        const scaleX = finallyWidth / DIALOG_INNER_WIDTH;
        const top = document.documentElement.scrollTop + (innerHeight / 2 - finallyHeight / 2);
        const left = innerWidth / 2 - finallyWidth / 2;
        nodeDialog.src = originSrc;
        nodeDialog.style.cssText =
          nodeDialog.style.cssText +
          `height: ${finallyHeight / scaleY}px;` +
          `top: ${top}px;left: ${left}px;` +
          `transform: translateX(0) translateY(0) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0px);will-change:unset;` +
          `transform-origin: 0 0;`;
      };

      if (key === 'ArrowRight' && index < images.length - 1) {
        dialogChange(nodeImgDialog, images[index + 1]);
        return;
      }

      if (key === 'ArrowLeft' && index > 0) {
        dialogChange(nodeImgDialog, images[index - 1]);
        return;
      }
    }
  }
};
