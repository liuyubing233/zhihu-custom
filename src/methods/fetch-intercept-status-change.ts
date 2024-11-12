import { myStorage } from '../commons/storage';
import { domA, domById } from '../commons/tools';

/** id: 当前接口拦截是否开启显示文案 */
const ID_FETCH_STATUS = 'CTZ_FETCH_STATUS';
/** id: 切换接口拦截按钮 */
const ID_FETCH_BUTTON = 'CTZ_CHANGE_FETCH';
const commitStatusTrue = '<b style="color: green;">已开启接口拦截</b>，如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截';
const commitStatusFalse = '<b style="color: red;">已关闭接口拦截</b>，部分功能不可用';
const buttonContentTrue = '关闭接口拦截';
const buttonContentFalse = '开启接口拦截';
const messageToTrue = '开启接口拦截，确认后将刷新页面。\n如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。';
const messageToFalse = '关闭接口拦截，确认后将刷新页面。\n「黑名单设置；外置不感兴趣；快速屏蔽用户；回答、文章和收藏夹导出」功能将不可用。';
/** 类名: 需要用到接口的设置 */
const CLASS_OPERATE_INTERCEPT = 'ctz-fetch-intercept';
/** 类名: 关闭接口拦截后的增添类名 */
const CLASS_CLOSE_INTERCEPT = 'ctz-fetch-intercept-close';

/** 接口拦截开启关闭 */
export const initFetchInterceptStatus = async () => {
  const { fetchInterceptStatus } = await myStorage.getConfig();
  changeHTML(!!fetchInterceptStatus);
  domById(ID_FETCH_BUTTON)!.onclick = function () {
    if (confirm(fetchInterceptStatus ? messageToFalse : messageToTrue)) {
      myStorage.setConfigItem('fetchInterceptStatus', !fetchInterceptStatus);
      window.location.reload();
    }
  };
};

const changeHTML = (status: boolean) => {
  domById(ID_FETCH_STATUS)!.innerHTML = status ? commitStatusTrue : commitStatusFalse;
  domById(ID_FETCH_BUTTON)!.innerHTML = status ? buttonContentTrue : buttonContentFalse;
  if (!status) {
    domA(`.${CLASS_OPERATE_INTERCEPT}`).forEach((item) => {
      item.classList.add(CLASS_CLOSE_INTERCEPT);
      item.querySelectorAll('input').forEach((it) => {
        it.disabled = true;
      });
      item.querySelectorAll('button').forEach((it) => {
        it.disabled = true;
      });
    });
  }
};
