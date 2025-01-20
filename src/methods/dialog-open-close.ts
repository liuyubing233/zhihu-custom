import { myScroll } from '../commons/scroll-stop-on';
import { domById } from '../commons/tools';
import { echoData } from './echo-data';
import { echoHistory } from './history';

/** 编辑器弹窗打开关闭方法 */
// export const myDialog = {
//   open: async () => {
//     const nodeDialog = domById(ID_DIALOG);
//     nodeDialog && (nodeDialog.style.display = 'flex');
//     myScroll.stop();
//     echoData();
//     echoHistory();
//   },
//   hide: () => {
//     const nodeDialog = domById(ID_DIALOG);
//     nodeDialog && (nodeDialog.style.display = 'none');
//     myScroll.on();
//   },
// };

export const changeDrawer = () => {
  const nodeButton = domById('CTZ_OPEN_CLOSE')!;
  if (nodeButton.getAttribute('data-close') === '1') {
    // 开启
    echoData();
    echoHistory();
    domById('CTZ_DRAWER')!.style.transform = 'translateX(0)';
    domById('CTZ_BLOCK')!.style.transform = 'translateX(0)';
    nodeButton.setAttribute('data-close', '0');
    nodeButton.innerHTML = '<div>×</div>';
    myScroll.stop();
  } else {
    // 关闭
    domById('CTZ_DRAWER')!.style.transform = '';
    domById('CTZ_BLOCK')!.style.transform = '';
    nodeButton.setAttribute('data-close', '1');
    nodeButton.innerHTML = '<div>⚙︎</div>';
    myScroll.on();
  }
};
