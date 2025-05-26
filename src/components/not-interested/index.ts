import { domById, domC, myStorage } from '../../tools';

const ID_LIST = 'CTZ_NOT_INTERESTED_LIST';
const CLASS_REMOVE = 'ctz-remove-not-interested-item';

/** 加载不感兴趣列表 */
export const createHTMLNotInterestedList = async () => {
  let { notInterestedList = [] } = await myStorage.getConfig();
  const boxList = domById(ID_LIST)!;
  boxList.innerHTML = notInterestedList.map((i) => `<div class="ctz-form-box-item"><span>${i}</span><span class="${CLASS_REMOVE}">✕</span></div>`).join('');
  boxList.onclick = async (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains(CLASS_REMOVE)) {
      const content = target.previousElementSibling!.textContent;
      notInterestedList = notInterestedList.filter((i) => i !== content);
      await myStorage.updateConfigItem('notInterestedList', notInterestedList);
      target.parentElement!.remove();
    }
  };
};

/** 添加不感兴趣项 */
export const addNotInterestedItem = async (name: string) => {
  const item = domC('div', {
    innerHTML: `<span>${name}</span><span class="${CLASS_REMOVE}">✕</span>`,
    className: 'ctz-form-box-item',
  });
  let { notInterestedList = [] } = await myStorage.getConfig();
  const boxList = domById(ID_LIST)!;
  boxList.insertBefore(item, boxList.childNodes[0]);
  notInterestedList.unshift(name);
  await myStorage.updateConfigItem('notInterestedList', notInterestedList);
};
