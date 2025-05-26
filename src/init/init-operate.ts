import { onExportBlack, onImportBlack, onSyncBlackList, onSyncRemoveBlockedUsers } from '../components/black-list';
import { onChangeMenu, openChange } from '../components/ctz-dialog';
import { myCustomStyle } from '../components/custom-style';
import { fnChanger } from '../components/fn-changer';
import { echoHistory } from '../components/history';
import { buttonConfirmPageTitle, buttonResetPageTitle } from '../components/page-title';
import { myPreview } from '../components/preview';
import { moveAndOpen } from '../components/suspension/move';
import { CONFIG_DEFAULT, CONFIG_SIMPLE } from '../config';
import { IKeyofHistory } from '../config/types';
import { CLASS_INPUT_CHANGE, CLASS_INPUT_CLICK } from '../misc';
import { dom, domA, domById, domC, formatTime, inputImportFile, myStorage } from '../tools';
import { initRootEvent } from './init-top-event-listener';

/** 加载设置弹窗绑定方法 */
export const initOperate = () => {
  const nodeContent = domById('CTZ_DIALOG')!;
  nodeContent.onclick = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains(CLASS_INPUT_CLICK)) {
      fnChanger(target);
      return;
    }

    if (target.classList.contains('ctz-reset-font-size')) {
      // 字体大小重置
      const inputName = target.name.replace('reset-', '');
      const nodeInput = dom(`[name="${inputName}"]`) as HTMLInputElement;
      nodeInput.value = '';
      fnChanger(nodeInput);
      return;
    }

    if (target.classList.contains('ctz-button')) {
      myButtonOperation[target.name] && myButtonOperation[target.name]();
      return;
    }
  };

  nodeContent.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains(CLASS_INPUT_CHANGE)) {
      fnChanger(target);
      return;
    }
  };

  dom('#CTZ_DIALOG_MENU')!.onclick = onChangeMenu;
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

  moveAndOpen();
  initRootEvent();

  dom('input[name="searchInZhihu"]')!.onchange = function (e) {
    const domInput = e.target as HTMLInputElement;
    const value = domInput.value;
    if (value) {
      window.open(`https://www.zhihu.com/search?q=${value}`);
    }
  };

  // 配置导入
  inputImportFile(dom('.ctz-input-config-import') as HTMLInputElement, async (oFREvent) => {
    let config = oFREvent.target ? oFREvent.target.result : '';
    if (typeof config === 'string') {
      const nConfig = JSON.parse(config);
      await myStorage.updateConfig(nConfig);
      setTimeout(() => {
        location.reload();
      }, 300);
    }
  });
  // 黑名单配置导入
  inputImportFile(dom('.ctz-input-import-black') as HTMLInputElement, onImportBlack);
};

/** 编辑器弹窗按钮点击事件集合 */
const myButtonOperation: Record<string, Function> = {
  // 导出配置
  configExport: async () => {
    const config = (await myStorage.get('pfConfig')) || '{}';
    const dateNumber = +new Date();
    const link = domC('a', {
      href: 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(config),
      download: `知乎编辑器配置-${formatTime(dateNumber, 'YYYYMMDD-HHmmss')}-${dateNumber}.txt`,
    });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  // 清空配置
  configRemove: async () => {
    GM.deleteValue('pfConfig');
    localStorage.removeItem('pfConfig');
  },
  // 恢复默认配置
  configReset: async function () {
    const isUse = confirm('是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存');
    if (!isUse) return;
    await myStorage.updateConfig(CONFIG_DEFAULT);
    setTimeout(() => {
      location.reload();
    }, 300);
  },
  // 自定义样式
  styleCustom: async function () {
    const nodeText = dom('[name="textStyleCustom"]') as HTMLInputElement;
    const value = nodeText ? nodeText.value : '';
    await myStorage.updateConfigItem('customizeCss', value);
    myCustomStyle.change(value);
  },
  // 确认更改网页标题
  buttonConfirmTitle: buttonConfirmPageTitle,
  // 还原网页标题
  buttonResetTitle: buttonResetPageTitle,
  // 导入配置
  configImport: () => {
    dom('.ctz-input-config-import')!.click();
  },
  // 关闭修改器弹窗
  dialogClose: openChange,
  // 放大缩小修改器弹窗
  dialogBig: () => {
    const nodeDialog = domById('CTZ_DIALOG')!;
    const isHeight = nodeDialog.style.height === '100vh';
    nodeDialog.style.height = isHeight ? '' : '100vh';
    dom(`button[name="dialogBig"]`)!.innerText = isHeight ? '⇵' : '-';
  },
  // 启用极简模式
  useSimple: async () => {
    const isUse = confirm('是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存');
    if (!isUse) return;
    const prevConfig = await myStorage.getConfig();
    myStorage.updateConfig({
      ...prevConfig,
      ...CONFIG_SIMPLE,
    });
    setTimeout(() => {
      location.reload();
    }, 300);
  },
  // 同步黑名单
  syncBlack: () => onSyncBlackList(0),
  // 清空黑名单列表
  syncBlackRemove: onSyncRemoveBlockedUsers,
  // 黑名单部分配置导出
  exportBlackConfig: onExportBlack,
  // 黑名单部分配置导入
  importBlackConfig: () => {
    dom('.ctz-input-import-black')!.click();
  },
  buttonSearchInZhihu: () => {
    const domInput = dom('[name="searchInZhihu"]') as HTMLInputElement;
    const value = domInput.value;
    if (value) {
      window.open(`https://www.zhihu.com/search?q=${value}`);
    }
  },
};
