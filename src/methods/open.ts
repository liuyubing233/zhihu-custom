import { myScroll } from '../commons/scroll-stop-on';
import { domA, domById } from '../commons/tools';
import { echoData } from './echo-data';
import { echoHistory } from './history';
import { CLASS_OPENED } from './menu';

export const openChange = () => {
  const nodeButton = domById('CTZ_OPEN_CLOSE')!;
  console.log(`nodeButton.getAttribute('data-close') === '1'`, nodeButton.getAttribute('data-close') === '1')
  if (nodeButton.getAttribute('data-close') === '1') {
    // 开启
    echoData();
    echoHistory();
    domById('CTZ_DIALOG')!.style.display = 'flex';
    // domById('CTZ_BLOCK')!.style.display = 'block';
    // domById('CTZ_DIALOG')!.style.transform = 'translateX(0)';
    // domById('CTZ_BLOCK')!.style.transform = 'translateX(0)';
    nodeButton.setAttribute('data-close', '0');
    // nodeButton.innerHTML = '<div>×</div>';
    myScroll.stop();
  } else {
    // 关闭
    domA('.ctz-dropdown-icon').forEach((item) => item.classList.remove(CLASS_OPENED));
    domById('CTZ_DIALOG')!.style.display = 'none';
    // domById('CTZ_BLOCK')!.style.display = 'none';
    // domById('CTZ_DIALOG')!.style.transform = '';
    // domById('CTZ_BLOCK')!.style.transform = '';
    nodeButton.setAttribute('data-close', '1');
    // nodeButton.innerHTML = '<div>⚙︎</div>';
    myScroll.on();
  }
};
