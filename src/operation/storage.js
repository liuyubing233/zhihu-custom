import { pfConfig } from '../variable/configs';

/** 使用 localStorage + GM 存储，解决跨域存储配置不同的问题 */
export const myStorage = {
  set: async function (name, value) {
    let v = value;
    if (this.namesNeedT.includes(name)) {
      const valueParse = JSON.parse(value);
      valueParse.t = +new Date();
      v = JSON.stringify(valueParse);
    }
    localStorage.setItem(name, v);
    await GM_setValue(name, v);
  },
  get: async function (name) {
    const config = await GM_getValue(name);
    const configLocal = localStorage.getItem(name);
    let c = config;
    if (this.namesNeedT.includes(name)) {
      const cParse = config ? JSON.parse(config) : null;
      const cLParse = configLocal ? JSON.parse(configLocal) : null;
      if (!cParse && !cLParse) return '';
      if (!cParse) return configLocal;
      if (!cLParse) return config;
      if (cParse.t < cLParse.t) return configLocal;
      return config;
    }
    return c;
  },
  initConfig: async function () {
    const nConfig = await this.get('pfConfig');
    const c = nConfig ? JSON.parse(nConfig) : {};
    if (nConfig === JSON.stringify(pfConfig)) {
      return Promise.resolve(false);
    }
    pfConfig = { ...pfConfig, ...c };
    return Promise.resolve(true);
  },
  initHistory: async function () {
    const nHistory = await myStorage.get('pfHistory');
    const h = nHistory ? JSON.parse(nHistory) : pfHistory;
    if (nHistory === JSON.stringify(pfHistory)) {
      return Promise.resolve(false);
    }
    pfHistory = h;
    return Promise.resolve(true);
  },
  namesNeedT: ['pfConfig', 'pfHistory'], // 需要时间戳的名称
};
