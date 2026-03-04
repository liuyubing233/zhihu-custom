import { SAVE_HISTORY_NUMBER } from '../config';
import { IPfConfig, IPfHistory } from '../config/types';

const memoryRawCache: Record<string, string | undefined> = {};
let configCacheRaw = '';
let configCache: IPfConfig | undefined = undefined;
let historyCacheRaw = '';
let historyCache: IPfHistory | undefined = undefined;

const parseStorageData = (raw: string) => {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

/** 使用 localStorage + GM 存储，解决跨域存储配置不同的问题 */
export const myStorage = {
  set: async function (name: string, value: Record<string, any>) {
    value.t = +new Date();
    const v = JSON.stringify(value);
    memoryRawCache[name] = v;
    if (name === 'pfConfig') {
      configCacheRaw = v;
      configCache = parseStorageData(v) || {};
    }
    if (name === 'pfHistory') {
      historyCacheRaw = v;
      historyCache = parseStorageData(v) || { list: [], view: [] };
    }
    localStorage.setItem(name, v);
    await GM.setValue(name, v);
  },
  get: async function (name: string, force = false) {
    if (!force && memoryRawCache[name] !== undefined) return memoryRawCache[name] as string;

    const gmValue = await GM.getValue(name);
    const config = typeof gmValue === 'string' ? gmValue : gmValue ? JSON.stringify(gmValue) : '';
    const configLocal = localStorage.getItem(name) || '';
    const cParse = parseStorageData(config);
    const cLParse = parseStorageData(configLocal);
    if (!cParse && !cLParse) {
      memoryRawCache[name] = '';
      return '';
    }
    if (!cParse) {
      memoryRawCache[name] = configLocal;
      return configLocal;
    }
    if (!cLParse) {
      memoryRawCache[name] = config;
      return config;
    }
    const nextRaw = cParse.t < cLParse.t ? configLocal : config;
    memoryRawCache[name] = nextRaw;
    return nextRaw;
  },
  getConfig: async function (force = false): Promise<IPfConfig> {
    const nConfig = await this.get('pfConfig', force);
    if (!force && configCache && nConfig === configCacheRaw) return configCache;
    configCacheRaw = nConfig || '';
    configCache = (parseStorageData(configCacheRaw) as IPfConfig) || {};
    return configCache;
  },
  getHistory: async function (force = false): Promise<IPfHistory> {
    const nHistory = await myStorage.get('pfHistory', force);
    if (!force && historyCache && nHistory === historyCacheRaw) return historyCache;
    historyCacheRaw = nHistory || '';
    historyCache = (parseStorageData(historyCacheRaw) as IPfHistory) || { list: [], view: [] };
    return historyCache;
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
