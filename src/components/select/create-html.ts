import { createHTMLFormItem } from '../../init/init-html/common-html';
import { initImagePreview } from '../../init/init-image-preview';
import { dom, domA, myStorage } from '../../tools';
import { myListenAnswer } from '../listen-answer';
import { myListenList } from '../listen-list';
import { mySize } from '../size';
import { myListenUserHomeList } from '../user-home';
import { changeVideoStyle } from '../video';
import { OPTIONS_MAP, SELECT_BASIS_SHOW } from './config';

/** 创建自定义选择框和添加监听方法 */
export const createHTMLMySelect = (domMain: HTMLElement) => {
  // 添加下拉选择
  dom('#CTZ_BASIC_SHOW_SELECT', domMain)!.innerHTML = SELECT_BASIS_SHOW.map(({ label, value }) =>
    createHTMLFormItem({ label, value: `<div class="ctz-select" name="${value}"></div>` })
  ).join('');

  // 添加下拉选择内容
  domA('.ctz-select', domMain).forEach((item) => {
    const name = item.getAttribute('name') || '';
    if (OPTIONS_MAP[name]) {
      item.innerHTML =
        `<div class="ctz-select-input">${`<span class="ctz-select-value"></span>` + `<span class="ctz-select-icon">▾</span>`}</div>` +
        `<div class="ctz-option-box" data-name="mySelect" style="display: none">` +
        OPTIONS_MAP[name].map(({ value, label }) => `<div data-value="${value}" class="ctz-option-item">${label}</div>`).join('') +
        `</div>`;

      const itemInput = item.querySelector('.ctz-select-input') as HTMLElement;
      const itemValue = item.querySelector('.ctz-select-value') as HTMLElement;
      const itemOptionBox = item.querySelector('.ctz-option-box') as HTMLElement;

      const open = () => {
        if (item.dataset.open === 'true') {
          itemOptionBox.style.display = 'none';
          item.dataset.open = 'false';
        } else {
          itemOptionBox.style.display = 'block';
          item.dataset.open = 'true';
        }
      };

      itemInput.onclick = () => {
        closeAllSelect();
        open();
      };
      itemOptionBox.onclick = async function (ev) {
        const target = ev.target as HTMLElement;
        if (!target.classList.contains('ctz-option-item')) return;
        const value = target.dataset.value;
        const label = target.textContent;
        itemValue.textContent = label;
        itemValue.dataset.value = value;
        optionChoose(itemOptionBox, target);
        open();
        await myStorage.updateConfigItem(name, value);
        switch (name) {
          case 'zoomImageType':
            mySize.change();
            initImagePreview();
            break;
          case 'videoInAnswerArticle':
            changeVideoStyle();
            myListenList.restart();
            myListenAnswer.restart();
            break;
          case 'linkShopping':
          case 'zoomListVideoType':
          case 'zoomImageHeight':
            mySize.change();
            break;
          case 'homeContentOpen':
            myListenUserHomeList.restart();
            break;
          default:
            // mySize.change();
            break;
        }

        // console.log('name,', name, value);
      };
    }
  });
};

/** 关闭所有select */
export const closeAllSelect = () => {
  domA('.ctz-select').forEach((item) => {
    item.dataset.open = 'false';
    (item.querySelector('.ctz-option-box') as HTMLElement).style.display = 'none';
  });
};

/** option 选择 */
export const optionChoose = (itemOptionBox: HTMLElement, chooseOne?: HTMLElement) => {
  itemOptionBox.querySelectorAll('.ctz-option-item').forEach((item) => {
    (item as HTMLElement).dataset.choose = 'false';
  });
  chooseOne && (chooseOne.dataset.choose = 'true');
};
