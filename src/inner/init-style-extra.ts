import { myHidden } from "../methods/hidden";
import { findTheme, myBackground } from "../methods/styles";
import { myVersion } from "../methods/version";

/** 加载额外的样式文件 */
export const onInitStyleExtra = () => {
  myHidden.init();
  myBackground.init();
  myVersion.init();
  findTheme();
};
