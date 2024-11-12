import { myStorage } from '../commons/storage';
import { dom, domA, domById, domC, message } from '../commons/tools';
import { CLASS_INPUT_CHANGE, CLASS_INPUT_CLICK } from '../configs';
import { myCustomStyle, onUseThemeDark } from '../methods/background';
import { myBlack } from '../methods/black';
import { myDialog } from '../methods/dialog-open-close';
import { fnChanger } from '../methods/fn-changer';
import { echoHistory } from '../methods/history';
import { myMenu } from '../methods/menu';
import { changeTitle } from '../methods/page-title';
import { myPreview } from '../methods/preview';
import { store } from '../store';
import { IKeyofHistory, IPfConfig } from '../types';
import { initData } from './init-data';
import { onInitStyleExtra } from './init-style-extra';
import { initRootEvent, initTopStoryRecommendEvent } from './init-top-event-listener';

/** 加载设置弹窗绑定方法 */
export const initOperate = () => {
  const nodeContent = dom('.ctz-content')!;
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
    }
  };
  dom('.ctz-menu-top')!.onclick = myMenu.click;
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
      await myStorage.setHistory(prevHistory);
      echoHistory();
    };
  });

  // 绑定元素事件
  const nodeOpenButton = domById('CTZ_OPEN_BUTTON');
  const nodeCloseDialog = domById('CTZ_CLOSE_DIALOG');
  nodeOpenButton && (nodeOpenButton.onclick = myDialog.open);
  nodeCloseDialog && (nodeCloseDialog.onclick = myDialog.hide);
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
  /** 导入配置 */
  configImport: async function () {
    const nodeImport = dom('[name=textConfigImport]') as HTMLInputElement;
    const configImport = nodeImport ? nodeImport.value : '{}';
    const nConfig = JSON.parse(configImport);
    await myStorage.setConfig(nConfig);
    resetData();
  },
  configReset: async function () {
    const isUse = confirm('是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存');
    if (!isUse) return;
    const { getStorageConfigItem } = store;
    const { filterKeywords = [], removeBlockUserContentList = [] } = await myStorage.getConfig();
    const cacheConfig = getStorageConfigItem('cachePfConfig') as IPfConfig;
    await myStorage.setConfig({
      ...cacheConfig,
      filterKeywords,
      removeBlockUserContentList,
    });
    resetData();
  },
  /** 自定义样式 */
  styleCustom: async function () {
    const nodeText = dom('[name="textStyleCustom"]') as HTMLInputElement;
    const value = nodeText ? nodeText.value : '';
    await myStorage.setConfigItem('customizeCss', value);
    myCustomStyle.change(value);
  },
  syncBlack: () => myBlack.sync(0),
  /** 确认更改网页标题 */
  buttonConfirmTitle: async function () {
    const nodeTitle = dom('[name="globalTitle"]') as HTMLInputElement;
    await myStorage.setConfigItem('globalTitle', nodeTitle ? nodeTitle.value : '');
    changeTitle();
    message('网页标题修改成功');
  },
  /** 还原网页标题 */
  buttonResetTitle: async function () {
    const { getStorageConfigItem } = store;
    const nodeTitle = dom('[name="globalTitle"]') as HTMLInputElement;
    nodeTitle && (nodeTitle.value = getStorageConfigItem('cacheTitle') as string);
    await myStorage.setConfigItem('globalTitle', '');
    changeTitle();
    message('网页标题已还原');
  },
};

/** 在重置数据时调用 */
const resetData = () => {
  onInitStyleExtra();
  initData();
  onUseThemeDark();
};
