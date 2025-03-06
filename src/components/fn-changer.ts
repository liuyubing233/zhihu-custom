import { myStorage } from '../commons/storage';
import { dom, domById } from '../commons/tools';
import { initImagePreview } from '../init/init-image-preview';
import { INPUT_NAME_THEME, INPUT_NAME_THEME_DARK, INPUT_NAME_ThEME_LIGHT, myBackground, onUseThemeDark } from './background';
import { appendHiddenStyle } from './hidden';
import { previewGIF } from './image';
import { myListenListItem } from './listen-list-item';
import { changeICO, changeTitle } from './page-title';
import { changeSuspensionTab, suspensionHeader, suspensionPickupAttribute } from './suspension';
import { addArticleTime, addQuestionTime } from './time';
import { myVersion } from './version';

/** 更改编辑器方法 */
export const fnChanger = async (ev: HTMLInputElement) => {
  // onchange 时只调用 myVersion 的 name
  const doCssVersion = [
    'questionTitleTag',
    'fixedListItemMore',
    'linkShopping',
    'highlightListItem',
    'zoomImageSize',
    'zoomImageHeight',
    'zoomImageHeightSize',
    'versionHome',
    'versionAnswer',
    'versionArticle',
    'versionHomePercent',
    'versionAnswerPercent',
    'versionArticlePercent',
    'versionUserHome',
    'versionUserHomePercent',
    'versionCollection',
    'versionCollectionPercent',
    'fontSizeForListTitle',
    'fontSizeForAnswerTitle',
    'fontSizeForArticleTitle',
    'fontSizeForList',
    'fontSizeForAnswer',
    'fontSizeForArticle',
    'contentLineHeight',
    'zoomListVideoType',
    'zoomListVideoSize',
    'commitModalSizeSameVersion',
    'videoUseLink',
  ];
  const { name, value, checked, type } = ev;
  const changeBackground = () => {
    myVersion.change();
    myBackground.init();
    myListenListItem.restart();
    onUseThemeDark();
  };

  const rangeChoosePercent = () => {
    const rangeName = name.replace('IsPercent', '');
    const rangeNamePercent = `${rangeName}Percent`;
    const domRange = dom(`.ctz-range-${rangeName}`);
    const domRangePercent = dom(`.ctz-range-${rangeNamePercent}`);
    if (domRange && domRangePercent) {
      domRange.style.display = checked ? 'none' : 'flex';
      domRangePercent.style.display = !checked ? 'none' : 'flex';
    }
    myVersion.change();
  };

  const ob: Record<string, Function> = {
    [INPUT_NAME_THEME]: changeBackground,
    [INPUT_NAME_ThEME_LIGHT]: changeBackground,
    [INPUT_NAME_THEME_DARK]: changeBackground,
    colorText1: changeBackground,
    backgroundHighlightOriginal: changeBackground,
    suspensionHomeTab: () => {
      myVersion.change();
      changeSuspensionTab();
    },
    suspensionFind: () => suspensionHeader('suspensionFind'),
    suspensionSearch: () => suspensionHeader('suspensionSearch'),
    suspensionUser: () => suspensionHeader('suspensionUser'),
    titleIco: changeICO,
    showGIFinDialog: previewGIF,
    questionCreatedAndModifiedTime: addQuestionTime,
    highlightOriginal: () => myListenListItem.restart(),
    listOutPutNotInterested: () => myListenListItem.restart(),
    articleCreateTimeToTop: addArticleTime,
    versionHomeIsPercent: rangeChoosePercent,
    versionAnswerIsPercent: rangeChoosePercent,
    versionArticleIsPercent: rangeChoosePercent,
    versionUserHomeIsPercent: rangeChoosePercent,
    versionCollectionIsPercent: rangeChoosePercent,
    zoomImageType: () => {
      myVersion.change();
      initImagePreview();
    },
    globalTitleRemoveMessage: changeTitle,
    suspensionPickUp: suspensionPickupAttribute,
    suspensionPickupRight: suspensionPickupAttribute,
  };

  if (name === 'fetchInterceptStatus') {
    if (
      confirm(
        !checked
          ? '关闭接口拦截，确认后将刷新页面。\n「黑名单设置；外置不感兴趣；快速屏蔽用户；回答、文章和收藏夹导出」功能将不可用。'
          : '开启接口拦截，确认后将刷新页面。\n如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。'
      )
    ) {
      myStorage.updateConfigItem('fetchInterceptStatus', checked);
      window.location.reload();
    } else {
      ev.checked = !checked;
    }
    return;
  }

  await myStorage.updateConfigItem(name, type === 'checkbox' ? checked : value);

  if (type === 'range') {
    const nodeName = domById(name);
    nodeName && (nodeName.innerText = value);
  }

  if (/^hidden/.test(name)) {
    appendHiddenStyle();
    return;
  }
  if (doCssVersion.includes(name)) {
    myVersion.change();
    return;
  }
  ob[name] && ob[name]();
};
