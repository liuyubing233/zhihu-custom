import { myStorage } from '../commons/storage';
import { domById } from '../commons/tools';
import { myHidden } from './hidden';
import { previewGIF } from './image';
import { myListenListItem } from './listen-list-item';
import { changeICO } from './page-title';
import { myBackground, onUseThemeDark } from './styles';
import { cacheHeader, changeSuspensionTab } from './suspension';
import { addArticleCreateTimeToTop, addQuestionCreatedAndModifiedTime } from './time';
import { myVersion } from './version';
import { zoomVideos } from './video';

/** 更改编辑器方法 */
export const fnChanger = async (ev: HTMLInputElement) => {
  // onchange 时只调用 myVersion 的 name
  const doCssVersion = [
    'questionTitleTag',
    'fixedListItemMore',
    'linkShopping',
    'highlightListItem',
    'zoomImageType',
    'zoomImageSize',
    'versionHome',
    'versionAnswer',
    'versionArticle',
    'fontSizeForList',
    'fontSizeForAnswer',
    'fontSizeForArticle',
    'zoomListVideoType',
    'zoomListVideoSize',
  ];
  const { name, value, checked, type } = ev;
  const ob: Record<string, Function> = {
    colorBackground: () => {
      myVersion.change();
      myBackground.init();
      myListenListItem.restart();
      onUseThemeDark();
    },
    suspensionHomeTab: () => {
      myVersion.change();
      changeSuspensionTab();
    },
    suspensionFind: cacheHeader,
    suspensionSearch: cacheHeader,
    suspensionUser: cacheHeader,
    titleIco: changeICO,
    showGIFinDialog: previewGIF,
    questionCreatedAndModifiedTime: addQuestionCreatedAndModifiedTime,
    highlightOriginal: () => {
      myListenListItem.restart();
    },
    listOutPutNotInterested: () => {
      myListenListItem.restart();
    },
    articleCreateTimeToTop: addArticleCreateTimeToTop,
    linkAnswerVideo: () => {
      myVersion.change();
      zoomVideos();
    },
  };

  await myStorage.configUpdateItem(name, type === 'checkbox' ? checked : value);
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
