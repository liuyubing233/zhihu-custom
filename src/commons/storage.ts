import { SAVE_HISTORY_NUMBER } from '../configs';
import { store } from '../store';
import { IPfConfig, IPfHistory } from '../types';

/** 使用 localStorage + GM 存储，解决跨域存储配置不同的问题 */
export const myStorage = {
  set: async function (name: string, value: Record<string, any>) {
    value.t = +new Date();
    const v = JSON.stringify(value);
    localStorage.setItem(name, v);
    await GM.setValue(name, v);
  },
  get: async function (name: string) {
    const config = await GM.getValue(name);
    const configLocal = localStorage.getItem(name);
    const cParse = config ? JSON.parse(config) : null;
    const cLParse = configLocal ? JSON.parse(configLocal) : null;
    if (!cParse && !cLParse) return '';
    if (!cParse) return configLocal;
    if (!cLParse) return config;
    if (cParse.t < cLParse.t) return configLocal;
    return config;
  },
  initConfig: async function () {
    const prevConfig = store.getConfig();
    const nConfig = await this.get('pfConfig');
    const c = nConfig ? JSON.parse(nConfig) : {};
    const configSave = { ...prevConfig, ...c };
    store.setConfig(configSave);
    return Promise.resolve(configSave);
  },
  initHistory: async function () {
    const prevHistory = store.getHistory();
    const nHistory = await myStorage.get('pfHistory');
    const h = nHistory ? JSON.parse(nHistory) : prevHistory;
    store.setHistory(h);
    return Promise.resolve(h);
  },
  /** 修改配置中的值 */
  setConfigItem: async function (key: string | Record<string, any>, value?: any) {
    const { getConfig, setConfig } = store;
    const prevConfig = getConfig();
    if (typeof key === 'string') {
      prevConfig[key] = value;
    } else {
      for (let itemKey in key) {
        prevConfig[itemKey] = key[itemKey];
      }
    }
    setConfig(prevConfig);
    await this.set('pfConfig',prevConfig);
  },
  /** 更新配置 */
  setConfig: async function (params: IPfConfig) {
    store.setConfig(params);
    await this.set('pfConfig', params);
  },
  setHistoryItem: async function (key: 'list' | 'view', params: string[]) {
    const { getHistory, setHistory } = store;
    const pfHistory = getHistory();
    pfHistory[key] = params.slice(0, SAVE_HISTORY_NUMBER);
    setHistory(pfHistory);
    await this.set('pfHistory', pfHistory);
  },
  setHistory: async function (value: IPfHistory) {
    store.setHistory(value);
    this.set('pfHistory', value);
  }
};
