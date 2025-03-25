import { CLASS_INPUT_CHANGE, CLASS_INPUT_CLICK } from '../misc';
import { dom, domA, domById, myStorage } from '../tools';
import { echoBlockedContent } from './black-list';
import { echoMySelect } from './select';
import { VERSION_RANGE_HAVE_PERCENT } from './size';

/** 回填数据，供每次打开使用 */
export const echoData = async () => {
  const config = await myStorage.getConfig();
  const textSameName: Record<string, Function> = {
    globalTitle: (e: HTMLInputElement) => (e.value = config.globalTitle || document.title),
    customizeCss: (e: HTMLInputElement) => (e.value = config.customizeCss || ''),
  };
  const echoText = (even: HTMLInputElement) => (textSameName[even.name] ? textSameName[even.name](even) : (even.value = config[even.name] || ''));
  const echo: Record<string, Function> = {
    radio: (even: HTMLInputElement) => config.hasOwnProperty(even.name) && String(even.value) === String(config[even.name]) && (even.checked = true),
    checkbox: (even: HTMLInputElement) => (even.checked = config[even.name] || false),
    text: echoText,
    number: echoText,
    range: (even: HTMLInputElement) => {
      const nValue = config[even.name];
      const nodeRange = dom(`[name="${even.name}"]`) as HTMLInputElement;
      const min = nodeRange && nodeRange.min;
      const rangeNum = isNaN(+nValue) || !(+nValue > 0) ? min : nValue;
      even.value = rangeNum;
      const nodeNewOne = domById(even.name);
      nodeNewOne && (nodeNewOne.innerText = rangeNum);
    },
  };
  const doEcho = (item: HTMLInputElement) => {
    echo[item.type] && echo[item.type](item);
  };
  const nodeArrInputClick = domA(`.${CLASS_INPUT_CLICK}`);
  for (let i = 0, len = nodeArrInputClick.length; i < len; i++) {
    doEcho(nodeArrInputClick[i] as HTMLInputElement);
  }
  const nodeArrInputChange = domA(`.${CLASS_INPUT_CHANGE}`);
  for (let i = 0, len = nodeArrInputChange.length; i < len; i++) {
    doEcho(nodeArrInputChange[i] as HTMLInputElement);
  }

  echo.text(dom('[name="globalTitle"]'));

  VERSION_RANGE_HAVE_PERCENT.forEach((item) => {
    const isPercent = config[`${item.value}IsPercent`];
    const domRange = dom(`.ctz-range-${item.value}`);
    const domRangePercent = dom(`.ctz-range-${item.value}Percent`);
    if (domRange && domRangePercent) {
      domRange.style.display = isPercent ? 'none' : 'flex';
      domRangePercent.style.display = !isPercent ? 'none' : 'flex';
    }
  });

  echoMySelect();
  // 回填（渲染）黑名单内容应在 echoData 中设置，保证每次打开弹窗都是最新内容
  echoBlockedContent(document.body);
};
