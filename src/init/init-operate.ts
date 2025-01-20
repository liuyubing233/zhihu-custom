import { myStorage } from '../commons/storage';
import { dom, domA, domById, domC, message } from '../commons/tools';
import { CLASS_INPUT_CHANGE, CLASS_INPUT_CLICK, CONFIG_DEFAULT } from '../configs';
import { myCustomStyle, onUseThemeDark } from '../methods/background';
import { myBlack } from '../methods/black';
import { changeDrawer } from '../methods/dialog-open-close';
import { fnChanger } from '../methods/fn-changer';
import { echoHistory } from '../methods/history';
import { onChangeMenu } from '../methods/menu';
import { changeTitle } from '../methods/page-title';
import { myPreview } from '../methods/preview';
import { store } from '../store';
import { IKeyofHistory } from '../types';
import { initData } from './init-data';
import { onInitStyleExtra } from './init-style-extra';
import { initRootEvent, initTopStoryRecommendEvent } from './init-top-event-listener';

/** 加载设置弹窗绑定方法 */
export const initOperate = () => {
  const nodeContent = domById('CTZ_DRAWER_MAIN')!;
  nodeContent.onclick = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains(CLASS_INPUT_CLICK)) {
      fnChanger(target);
    }
    if (target.classList.contains('ctz-button')) {
      myButtonOperation[target.name] && myButtonOperation[target.name]();
    }
  };
  nodeContent.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains(CLASS_INPUT_CHANGE)) {
      fnChanger(target);
      return;
    }
    if (target.classList.contains('ctz-input-config-import')) {
      configImport(e);
      return;
    }
  };
  // dom('.ctz-menu-top')!.onclick = myMenu.click;
  dom('#CTZ_DRAWER_MENU')!.onclick = onChangeMenu;
  domA('.ctz-preview').forEach((item) => {
    item.onclick = function () {
      myPreview.hide(this);
    };
  });

  domA('[name="button_history_clear"]').forEach((item) => {
    item.onclick = async (event) => {
      const prevHistory = await myStorage.getHistory();
      const target = event.target as HTMLElement;
      const dataId = target.getAttribute('data-id') as IKeyofHistory;
      const isClear = confirm(`是否清空${target.innerText}`);
      if (!isClear) return;
      prevHistory[dataId] = [];
      await myStorage.updateHistory(prevHistory);
      echoHistory();
    };
  });

  // 绑定元素事件
  // const nodeOpenButton = domById('CTZ_OPEN_BUTTON');
  // const nodeCloseDialog = domById('CTZ_CLOSE_DIALOG');
  // nodeOpenButton && (nodeOpenButton.onclick = myDialog.open);
  // nodeCloseDialog && (nodeCloseDialog.onclick = myDialog.hide);

  domById('CTZ_OPEN_CLOSE')!.onclick = changeDrawer;
  domById('CTZ_BLOCK')!.onclick = changeDrawer;

  initTopStoryRecommendEvent();
  initRootEvent();
};

/** 编辑器按钮点击事件集合 */
const myButtonOperation: Record<string, Function> = {
  /** 导出配置 */
  configExport: async () => {
    const config = (await myStorage.get('pfConfig')) || '{}';
    const link = domC('a', {
      href: 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(config),
      download: `知乎编辑器配置-${+new Date()}.txt`,
    });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  configRemove: async () => {
    GM.deleteValue('pfConfig');
    localStorage.removeItem('pfConfig');
  },
  configReset: async function () {
    const isUse = confirm('是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存');
    if (!isUse) return;
    const { filterKeywords = [], removeBlockUserContentList = [] } = await myStorage.getConfig();
    await myStorage.updateConfig({
      ...CONFIG_DEFAULT,
      filterKeywords,
      removeBlockUserContentList,
    });
    resetData();
  },
  /** 自定义样式 */
  styleCustom: async function () {
    const nodeText = dom('[name="textStyleCustom"]') as HTMLInputElement;
    const value = nodeText ? nodeText.value : '';
    await myStorage.updateConfigItem('customizeCss', value);
    myCustomStyle.change(value);
  },
  syncBlack: () => myBlack.sync(0),
  /** 确认更改网页标题 */
  buttonConfirmTitle: async function () {
    const nodeTitle = dom('[name="globalTitle"]') as HTMLInputElement;
    await myStorage.updateConfigItem('globalTitle', nodeTitle ? nodeTitle.value : '');
    changeTitle();
    message('网页标题修改成功');
  },
  /** 还原网页标题 */
  buttonResetTitle: async function () {
    const { getStorageConfigItem } = store;
    const nodeTitle = dom('[name="globalTitle"]') as HTMLInputElement;
    nodeTitle && (nodeTitle.value = getStorageConfigItem('cacheTitle') as string);
    await myStorage.updateConfigItem('globalTitle', '');
    changeTitle();
    message('网页标题已还原');
  },
  configImport: () => {
    dom('#IMPORT_BY_FILE input')!.click();
  },
};

const configImport = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const configFile = (target.files || [])[0];
  if (!configFile) return;
  const reader = new FileReader();
  reader.readAsText(configFile);
  reader.onload = async (oFREvent) => {
    let config = oFREvent.target ? oFREvent.target.result : '';
    if (typeof config === 'string') {
      const nConfig = JSON.parse(config);
      await myStorage.updateConfig(nConfig);
      resetData();
    }
  };
  target.value = '';
};

/** 在重置数据时调用 */
const resetData = () => {
  onInitStyleExtra();
  initData();
  onUseThemeDark();
};
