import { dom, domA, myStorage } from '../tools';

/** 接口拦截开启关闭 */
export const initFetchInterceptStatus = async (domMain: HTMLElement) => {
  const { fetchInterceptStatus } = await myStorage.getConfig();
  dom('#CTZ_FETCH_STATUS', domMain)!.innerHTML = fetchInterceptStatus
    ? '<b style="color: #00bfa5;">已开启接口拦截</b>，若页面无法显示数据请尝试关闭'
    : '<b style="color: #d50000;">已关闭接口拦截</b>，部分功能不可用';
  if (!fetchInterceptStatus) {
    domA('.ctz-fetch-intercept', domMain).forEach((item) => {
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
