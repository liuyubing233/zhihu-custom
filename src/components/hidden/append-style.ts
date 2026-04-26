import { fnAppendStyle, myStorage } from '../../tools';
import { HIDDEN_ARRAY, HIDDEN_ARRAY_MORE } from './configs';

let hiddenSelectedTextPopupEnabled = false;
let hiddenSelectedTextPopupInited = false;
let hiddenSelectedTextPopupTimer = 0;

const hideSelectedTextPopup = () => {
  if (!hiddenSelectedTextPopupEnabled) return;

  document.querySelectorAll<HTMLElement>('[class^="css-"],[class*=" css-"],.Popover-content').forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.width <= 0 || rect.width > 500 || rect.height <= 0 || rect.height > 160) return;

    const text = `${item.innerText}${item.innerHTML}`;
    if (
      (/复制/.test(text) && /(搜索|划线|直答|分享|引用|想法|评论|AI\s*解释)/.test(text)) ||
      (/ZDI--Repeat24/.test(text) && /ZDI--Heart24/.test(text) && /ZDI--ChatBubble24/.test(text)) ||
      /Zi--Copy/.test(text)
    ) {
      item.style.setProperty('display', 'none', 'important');
    }
  });
};

const scheduleHideSelectedTextPopup = () => {
  window.clearTimeout(hiddenSelectedTextPopupTimer);
  hiddenSelectedTextPopupTimer = window.setTimeout(hideSelectedTextPopup, 0);
};

const initHiddenSelectedTextPopup = () => {
  if (hiddenSelectedTextPopupInited) return;
  if (!document.body) {
    window.setTimeout(initHiddenSelectedTextPopup, 100);
    return;
  }

  hiddenSelectedTextPopupInited = true;
  document.addEventListener('selectionchange', scheduleHideSelectedTextPopup);
  document.addEventListener('mouseup', scheduleHideSelectedTextPopup, true);
  new MutationObserver(scheduleHideSelectedTextPopup).observe(document.body, { childList: true, subtree: true });
};

/** 加载隐藏模块的样式 */
export const appendHiddenStyle = async () => {
  const config = await myStorage.getConfig();
  hiddenSelectedTextPopupEnabled = !!config.hiddenSelectedTextPopup;
  hiddenSelectedTextPopupEnabled && initHiddenSelectedTextPopup();

  let hiddenContent = '';

  HIDDEN_ARRAY.forEach((item) => {
    item.content.forEach((content) => {
      content.forEach((hiddenItem) => {
        config[hiddenItem.value] && (hiddenContent += hiddenItem.css);
      });
    });
  });

  HIDDEN_ARRAY_MORE.forEach(({ keys, value }) => {
    let trueNumber = 0;
    keys.forEach((key) => config[key] && trueNumber++);
    trueNumber === keys.length && (hiddenContent += value);
  });

  if (config.topVote) {
    hiddenContent += `.css-dvccr2{display: none!important;}`;
  }

  fnAppendStyle('CTZ_STYLE_HIDDEN', hiddenContent);
};
