import { myScroll } from '../commons/scroll-stop-on';
import { dom, domA, domById } from '../commons/tools';
import { echoData } from './echo-data';
import { echoHistory } from './history';
import { CLASS_OPENED } from './menu';

export const openChange = () => {
  const nodeButton = domById('CTZ_OPEN_CLOSE')!;
  if (nodeButton.getAttribute('data-close') === '1') {
    // 开启
    echoData();
    echoHistory();
    domById('CTZ_DIALOG')!.style.display = 'flex';
    nodeButton.setAttribute('data-close', '0');
    myScroll.stop();
  } else {
    // 关闭
    domA('.ctz-dropdown-icon').forEach((item) => item.classList.remove(CLASS_OPENED));
    const nodeDialog = domById('CTZ_DIALOG')!;
    nodeDialog.style.display = 'none';
    nodeDialog.style.height = '';
    dom(`button[name="dialogBig"]`)!.innerText = '+';
    nodeButton.setAttribute('data-close', '1');
    myScroll.on();
  }
};
