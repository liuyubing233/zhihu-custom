import { myStorage } from '../../commons/storage';
import { fnAppendStyle } from '../../commons/tools';
import { HIDDEN_ARRAY, HIDDEN_ARRAY_MORE } from '../../configs';

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

  fnAppendStyle('CTZ_STYLE_HIDDEN', hiddenContent);
};
