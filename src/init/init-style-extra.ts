import { loadFindTheme, myBackground } from "../methods/background";
import { appendHidden } from "../methods/hidden";
import { myVersion } from "../methods/version";

/** 加载额外的样式文件 */
export const onInitStyleExtra = () => {
  appendHidden()
  myBackground.init();
  myVersion.init();
  loadFindTheme();
};
