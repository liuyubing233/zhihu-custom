import { myStorage } from '../commons/storage';
import { domA, domById } from '../commons/tools';

/** 接口拦截开启关闭 */
export const initFetchInterceptStatus = async () => {
  const { fetchInterceptStatus } = await myStorage.getConfig();
  domById('CTZ_FETCH_STATUS')!.innerHTML = fetchInterceptStatus
    ? '<b style="color: #00bfa5;">已开启接口拦截</b>，若页面无法显示数据请尝试关闭'
    : '<b style="color: #d50000;">已关闭接口拦截</b>，部分功能不可用';
  if (!fetchInterceptStatus) {
    domA('.ctz-fetch-intercept').forEach((item) => {
      item.classList.add('ctz-fetch-intercept-close');
      item.querySelectorAll('input').forEach((it) => {
        it.disabled = true;
      });
      item.querySelectorAll('button').forEach((it) => {
        it.disabled = true;
      });
    });
  }
};
