import { myStorage } from "../commons/storage";
import { dom, fnAppendStyle } from "../commons/tools";

/** 自定义样式方法 */
export const myCustomStyle = {
  init: async function () {
    const { customizeCss = '' } = await myStorage.getConfig();
    (dom('[name="textStyleCustom"]') as HTMLTextAreaElement).value = customizeCss;
    this.change(customizeCss);
  },
  change: (innerCus: string) => fnAppendStyle('CTZ_STYLE_CUSTOM', innerCus),
};
