import { myStorage } from '../commons/storage';
import { domA, domById } from '../commons/tools';

/** 接口拦截开启关闭 */
export const initFetchInterceptStatus = async () => {
  const { fetchInterceptStatus } = await myStorage.getConfig();
  changeHTML(!!fetchInterceptStatus);
  domById('CTZ_CHANGE_FETCH')!.onclick = function () {
    if (
      confirm(
        fetchInterceptStatus
          ? '关闭接口拦截，确认后将刷新页面。\n「黑名单设置；外置不感兴趣；快速屏蔽用户；回答、文章和收藏夹导出」功能将不可用。'
          : '开启接口拦截，确认后将刷新页面。\n如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。'
      )
    ) {
      myStorage.updateConfigItem('fetchInterceptStatus', !fetchInterceptStatus);
      window.location.reload();
    }
  };
};

const changeHTML = (status: boolean) => {
  domById('CTZ_FETCH_STATUS')!.innerHTML = status
    ? '<b style="color: #00bfa5;">已开启接口拦截</b>，遇到页面无法显示数据的情况请尝试'
    : '<b style="color: #d50000;">已关闭接口拦截</b>，部分功能不可用';
  domById('CTZ_CHANGE_FETCH')!.innerHTML = status ? '关闭接口拦截' : '开启接口拦截';
  if (!status) {
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
