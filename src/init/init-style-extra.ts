import { loadBackground, loadFindTheme } from "../methods/background";
import { myHidden } from "../methods/hidden";
import { myVersion } from "../methods/version";

/** 加载额外的样式文件 */
export const onInitStyleExtra = () => {
  myHidden.init();
  loadBackground();
  myVersion.init();
  loadFindTheme();
};
