import { ICommonContent } from "./types";

/** 提示HTML */
export const createHTMLTooltip = (value: string) => `<span class="ctz-tooltip"><span>?</span><span>${value}</span></span>`;

/** 范围选择器HTML */
export const createHTMLRange = (v: string, min: number, max: number, unit = '') =>
  `<div class="ctz-flex-wrap ctz-range-${v}">${
    `<span style="font-size: 12px;margin-right: 8px;">当前：<span id="${v}">0</span>${unit}</span>` +
    `<span style="margin-right: 2px;color: #757575;font-size: 12px;">${min}${unit}</span>` +
    `<input class="ctz-i" type="range" min="${min}" max="${max}" name="${v}" style="width: 200px" />` +
    `<span style="margin-left: 2px;color: #757575;font-size: 12px;">${max}${unit}</span>`
  }</div>`;

/**
 * form box switch 通用模块HTML
 * @param con ICommonContent[][]
 * @returns string
 */
export const createHTMLFormBoxSwitch = (con: ICommonContent[][]) =>
  con
    .map(
      (item) =>
        `<div class="ctz-form-box">${item
          .map(
            ({ label, value, needFetch, tooltip }) =>
              `<div class="ctz-form-box-item ${needFetch ? 'ctz-fetch-intercept' : ''}">${
                `<div>${label + (needFetch ? '<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span>' : '') + (tooltip ? createHTMLTooltip(tooltip) : '')}</div>` +
                `<div><input class="ctz-i ctz-switch" name="${value}" type="checkbox" value="on" /></div>`
              }</div>`
          )
          .join('')}</div>`
    )
    .join('');
