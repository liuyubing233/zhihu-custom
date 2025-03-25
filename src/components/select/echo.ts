import { domA, myStorage } from '../../tools';
import { OPTIONS_MAP } from './config';
import { optionChoose } from './create-html';

/** 回填自定义 select */
export const echoMySelect = async () => {
  const config = await myStorage.getConfig();
  domA('.ctz-select').forEach((item) => {
    const name = item.getAttribute('name');
    if (!name) return;
    const domValue = item.querySelector('.ctz-select-value') as HTMLElement;
    const options = OPTIONS_MAP[name];
    if (!options) return;
    const currentOption = options.find((i) => i.value === config[name]);
    if (!currentOption) return;
    domValue.dataset.value = currentOption.value;
    domValue.textContent = currentOption.label;
    const itemOptionBox = item.querySelector('.ctz-option-box') as HTMLElement;
    const itemChoose = itemOptionBox.querySelector(`.ctz-option-item[data-value="${currentOption.value}"]`);
    optionChoose(itemOptionBox, itemChoose as HTMLElement | undefined);
  });
};
