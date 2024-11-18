import { myStorage } from '../commons/storage';
import { dom, domById } from '../commons/tools';
import { INPUT_NAME_THEME, INPUT_NAME_THEME_DARK, INPUT_NAME_ThEME_LIGHT } from '../configs';
import { initImagePreview } from '../init/init-image-preview';
import { myBackground, onUseThemeDark } from './background';
import { myHidden } from './hidden';
import { previewGIF } from './image';
import { myListenListItem } from './listen-list-item';
import { changeICO, changeTitle } from './page-title';
import { cacheHeader, changeSuspensionTab } from './suspension';
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
    'fontSizeForListTitle',
    'fontSizeForAnswerTitle',
    'fontSizeForArticleTitle',
    'fontSizeForList',
    'fontSizeForAnswer',
    'fontSizeForArticle',
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
    suspensionHomeTab: () => {
      myVersion.change();
      changeSuspensionTab();
    },
    suspensionFind: cacheHeader,
    suspensionSearch: cacheHeader,
    suspensionUser: cacheHeader,
    titleIco: changeICO,
    showGIFinDialog: previewGIF,
    questionCreatedAndModifiedTime: addQuestionTime,
    highlightOriginal: myListenListItem.restart,
    listOutPutNotInterested: myListenListItem.restart,
    articleCreateTimeToTop: addArticleTime,
    versionHomeIsPercent: rangeChoosePercent,
    versionAnswerIsPercent: rangeChoosePercent,
    versionArticleIsPercent: rangeChoosePercent,
    zoomImageType: () => {
      myVersion.change();
      initImagePreview();
    },
    globalTitleRemoveMessage: changeTitle,
  };
  await myStorage.setConfigItem(name, type === 'checkbox' ? checked : value);
  const nodeName = domById(name);
  type === 'range' && nodeName && (nodeName.innerText = value);
  if (/^hidden/.test(name)) {
    myHidden.init();
    return;
  }
  if (doCssVersion.includes(name)) {
    myVersion.change();
    return;
  }
  ob[name] && ob[name]();
};
