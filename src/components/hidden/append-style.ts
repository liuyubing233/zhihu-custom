import { fnAppendStyle, myStorage } from '../../tools';
import { HIDDEN_ARRAY, HIDDEN_ARRAY_MORE } from './configs';

/** 加载隐藏模块的样式 */
export const appendHiddenStyle = async () => {
  const config = await myStorage.getConfig();

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
