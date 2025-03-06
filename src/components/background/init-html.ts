import { dom } from '../../commons/tools';
import { CLASS_INPUT_CLICK } from '../../configs';
import { INPUT_NAME_THEME, INPUT_NAME_THEME_DARK, INPUT_NAME_ThEME_LIGHT, THEME_CONFIG_DARK, THEME_CONFIG_LIGHT, THEMES } from './types';

/** 添加背景色选择元素 */
export const createHTMLBackgroundSetting = (domMain: HTMLElement) => {
  const radioBackground = (name: string, value: string | number, background: string, color: string, label: string, primary: string) =>
    `<label class="ctz-background-item">${
      `<input class="${CLASS_INPUT_CLICK}" name="${name}" type="radio" value="${value}"/>` +
      `<div class="ctz-background-item-div" style="background: ${primary || background};color: ${color}"></div>` +
      `<div class="ctz-background-item-border"></div>` +
      `<div class="ctz-background-item-name">${label}</div>`
    }</label>`;

  const themeToRadio = (o: Record<string, any>, className: string, color: string) =>
    Object.keys(o)
      .map((key) => radioBackground(className, key, o[key].background, color, o[key].name, o[key].primary))
      .join('');

  dom('.ctz-set-background', domMain)!.innerHTML =
    `<div class="ctz-form-box-item">${
      `<div>主题</div>` + `<div id="CTZ_BACKGROUND">${THEMES.map((i) => radioBackground(INPUT_NAME_THEME, i.value, i.background, i.color, i.label, i.background)).join('')}</div>`
    }</div>` +
    `<div class="ctz-form-box-item">${`<div>浅色主题</div>` + `<div id="CTZ_BACKGROUND_LIGHT">${themeToRadio(THEME_CONFIG_LIGHT, INPUT_NAME_ThEME_LIGHT, '#000')}</div>`}</div>` +
    `<div class="ctz-form-box-item">${`<div>深色主题</div>` + `<div id="CTZ_BACKGROUND_DARK">${themeToRadio(THEME_CONFIG_DARK, INPUT_NAME_THEME_DARK, '#f7f9f9')}</div>`}</div>`;
};
