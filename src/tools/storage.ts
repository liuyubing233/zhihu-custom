import { SAVE_HISTORY_NUMBER } from '../configs';
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
  getConfig: async function (): Promise<IPfConfig> {
    const nConfig = await this.get('pfConfig');
    return Promise.resolve(nConfig ? JSON.parse(nConfig) : {});
  },
  getHistory: async function (): Promise<IPfHistory> {
    const nHistory = await myStorage.get('pfHistory');
    const h = nHistory ? JSON.parse(nHistory) : { list: [], view: [] };
    return Promise.resolve(h);
  },
  /** 修改配置中的值 */
  updateConfigItem: async function (key: string | Record<string, any>, value?: any) {
    const config = await this.getConfig();
    if (typeof key === 'string') {
      config[key] = value;
    } else {
      for (let itemKey in key) {
        config[itemKey] = key[itemKey];
      }
    }
    await this.updateConfig(config);
  },
  /** 更新配置 */
  updateConfig: async function (params: IPfConfig) {
    await this.set('pfConfig', params);
  },
  updateHistoryItem: async function (key: 'list' | 'view', params: string[]) {
    const pfHistory = await this.getHistory();
    pfHistory[key] = params.slice(0, SAVE_HISTORY_NUMBER);
    await this.set('pfHistory', pfHistory);
  },
  updateHistory: async function (value: IPfHistory) {
    await this.set('pfHistory', value);
  },
};
