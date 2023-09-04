import { domC, dom } from './tools';
import { myStorage } from './storage';

/** 编辑器按钮点击事件集合 */
export const myButtonOperation = {
  /** 导出配置 */
  configExport: async () => {
    const config = await myStorage.get('pfConfig');
    const link = domC('a', {
      href: 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(config),
      download: `知乎编辑器配置-${+new Date()}.txt`,
    });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  /** 导入配置 */
  configImport: async () => {
    const configImport = dom('[name=textConfigImport]').value;
    pfConfig = JSON.parse(configImport);
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    resetData();
  },
  configReset: async () => {
    const isUse = confirm('是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存');
    if (!isUse) return;
    const { filterKeywords = [], removeBlockUserContentList = [] } = pfConfig;
    pfConfig = {
      ...storageConfig.cachePfConfig,
      filterKeywords,
      removeBlockUserContentList,
    };
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    resetData();
  },
  /** 自定义样式 */
  styleCustom: async () => {
    const value = dom('[name="textStyleCustom"]').value || '';
    pfConfig.customizeCss = value;
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    myCustomStyle.change();
  },
  syncBlack: () => myBlack.sync(0),
  /** 确认更改网页标题 */
  buttonConfirmTitle: async () => {
    const value = dom('[name="globalTitle"]').value;
    pfConfig.globalTitle = value || '';
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    changeTitle();
  },
  /** 还原网页标题 */
  buttonResetTitle: async () => {
    pfConfig.globalTitle = '';
    dom('[name="globalTitle"]').value = storageConfig.cacheTitle;
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    changeTitle();
  },
  useSimple: () => useSimple(),
};

/** 在重置数据时调用 */
const resetData = () => {
  onInitStyleExtra();
  initData();
  onUseThemeDark();
};
