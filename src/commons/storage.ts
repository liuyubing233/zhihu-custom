import { store } from '../store';
import { IPfConfig } from '../types';

/** 使用 localStorage + GM 存储，解决跨域存储配置不同的问题 */
export const myStorage = {
  set: async function (name: string, value: string) {
    const valueParse = JSON.parse(value);
    valueParse.t = +new Date();
    const v = JSON.stringify(valueParse);
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
    return Promise.resolve({ ...prevConfig, ...c });
  },
  initHistory: async function () {
    const prevHistory = store.getHistory();
    const nHistory = await myStorage.get('pfHistory');
    const h = nHistory ? JSON.parse(nHistory) : prevHistory;
    return Promise.resolve(h);
  },
  configUpdateItem: /** 修改配置中的值 */ async function (key: string | Record<string, any>, value?: any) {
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
    await myStorage.set('pfConfig', JSON.stringify(prevConfig));
  },
  configUpdate: /** 更新配置 */ async function (params: IPfConfig) {
    store.setConfig(params);
    await myStorage.set('pfConfig', JSON.stringify(params));
  },
};
