import { IPfHistory } from "../types/variable-cache";
import { IPfConfig } from "../types/variable-configs";

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
  initConfig: async function (config: IPfConfig) {
    const nConfig = await this.get('pfConfig');
    const c = nConfig ? JSON.parse(nConfig) : {};
    return Promise.resolve({ ...config, ...c });
  },
  initHistory: async function (historyConfig: IPfHistory) {
    const nHistory = await myStorage.get('pfHistory');
    const h = nHistory ? JSON.parse(nHistory) : historyConfig;
    return Promise.resolve(h);
  },
};
