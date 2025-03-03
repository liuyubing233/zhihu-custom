import { checkThemeDarkOrLight, myBackground } from "../methods/background";
import { appendHiddenStyle } from "../methods/hidden";
import { myVersion } from "../methods/version";

/**
 * 加载默认样式文件
 * - 隐藏的项
 * - 背景色
 * - 版心宽度
 * - 判断使用的白天还是黑夜模式
 */
export const onInitStyleExtra = () => {
  appendHiddenStyle()
  myBackground.init();
  myVersion.init();
  checkThemeDarkOrLight();
};
