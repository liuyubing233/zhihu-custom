import { domById, myStorage } from '../../tools';
import { openChange } from '../ctz-dialog';
import { ESuspensionOpen } from '../select';

/** 绑定页面元素的点击拖动方法 */
// export const myMove: IMyMove = {
//   init: function (element, configName, name) {
//     // 保存当前元素点击事件
//     this.clicks[configName] = element.click;
//     element.onmousedown = async (ev) => {
//       const pfConfig = await myStorage.getConfig();
//       // 固定则跳出
//       if (pfConfig[`${name}Fixed`]) return;
//       const event: any = window.event || ev;

//       const bodyW = document.body.offsetWidth;
//       const windowW = window.innerWidth;
//       const windowH = window.innerHeight;
//       const eW = element.offsetWidth;
//       const eH = element.offsetHeight;
//       const eL = element.offsetLeft;
//       const eT = element.offsetTop;
//       const evX = event.clientX;
//       const evY = event.clientY;

//       const dx = evX - eL;
//       const dy = evY - eT;
//       const rx = eW + eL - evX;
//       // 按下拖动
//       document.onmousemove = (ev) => {
//         const eventN: any = window.event || ev;
//         const evNX = eventN.clientX;
//         let evenLeft = 0;
//         let evenRight = 0;
//         const isR = this.useR.some((i: string) => i === name);
//         if (isR) {
//           // 用 body 替代 window 获取宽度来解决右侧滚动条宽度不一致问题
//           const right = bodyW - evNX - rx;
//           evenRight = right <= 0 ? 0 : right >= bodyW - eW ? bodyW - eW : right;
//           element.style.right = evenRight + 'px';
//         } else {
//           const left = evNX - dx;
//           evenLeft = left <= 0 ? 0 : left >= windowW - eW ? windowW - eW : left;
//           element.style.left = evenLeft + 'px';
//         }
//         const top = eventN.clientY - dy;
//         const evenTop = top <= 0 ? 0 : top >= windowH - eH ? windowH - eH : top;
//         // 元素不能超过页面宽高
//         element.style.top = evenTop + 'px';
//         this.isMove = true;
//         this.timer[configName] && clearTimeout(this.timer[configName]);
//         this.timer[configName] = setTimeout(async () => {
//           clearTimeout(this.timer[configName]);
//           await myStorage.updateConfigItem(configName, `${isR ? `right: ${evenRight}px;` : `left: ${evenLeft}px;`}top: ${evenTop}px;`);
//         }, 500);
//       };

//       // 抬起停止拖动
//       document.onmouseup = () => {
//         document.onmousemove = null;
//         document.onmouseup = null;
//         element.onclick = (e) => {
//           // 如果模块被移动则移除默认点击事件
//           // 否则返回原有点击事件
//           if (this.isMove) {
//             this.isMove = false;
//             return e.preventDefault && e.preventDefault();
//           } else {
//             return this.clicks[configName];
//           }
//         };
//       };
//       // @ts-ignore
//       if (element.preventDefault) {
//         // @ts-ignore
//         element.preventDefault();
//       } else {
//         return false;
//       }
//     };
//   },
//   destroy: function (element) {
//     element.onmousedown = null;
//   },
//   isMove: false,
//   clicks: {},
//   timer: {},
//   useL: ['suspensionHomeTab', 'suspensionFind', 'suspensionSearch'], // 使用left定位的name
//   useR: ['suspensionUser'], // 使用right定位的name
// };

interface IMyMove {
  init: (element: HTMLElement, configName: string, name: string) => void;
  destroy: (element: HTMLElement) => void;
  isMove: boolean;
  clicks: Record<string, any>; // string: Event Function
  timer: Record<string, NodeJS.Timeout>;
  useL: string[];
  useR: string[];
}

export const moveAndOpen = async () => {
  const openButton = domById('CTZ_OPEN_CLOSE')!;
  // 初始化
  const prevConfig = await myStorage.getConfig();
  if (prevConfig.suspensionOpen === ESuspensionOpen.上下) {
    // 上下定位
    if (prevConfig.suspensionOpenUseTop) {
      openButton.style.top = '0';
    } else {
      openButton.style.bottom = '0';
    }
    if (prevConfig.suspensionOpenLeft) {
      openButton.style.top = prevConfig.suspensionOpenLeft;
    } else {
      openButton.style.bottom = prevConfig.suspensionOpenRight || '0';
    }
  } else {
    // 左右定位
    if (prevConfig.suspensionOpenUseLeft) {
      openButton.style.left = '0';
    } else {
      openButton.style.right = '0';
    }
    if (prevConfig.suspensionOpenTop) {
      openButton.style.top = prevConfig.suspensionOpenTop;
    } else {
      openButton.style.bottom = prevConfig.suspensionOpenBottom || '0';
    }
  }

  /** 确认定位 */
  const formatPosition = (me: HTMLElement, moveEvent: MouseEvent, prevX: number, prevY: number) => {
    const realInnerWidth = domById('CTZ_COVER')!.offsetWidth;
    const realInnerHeight = domById('CTZ_COVER')!.offsetHeight;
    const left = moveEvent.clientX - prevX;
    const eventLeft = left <= 0 ? 0 : left;
    const right = realInnerWidth - eventLeft - 48;
    const eventRight = right <= 0 ? 0 : right;
    const top = moveEvent.clientY - prevY;
    const eventTop = top <= 0 ? 0 : top;
    const bottom = realInnerHeight - eventTop - 48;
    const eventBottom = bottom <= 0 ? 0 : bottom;
    const useTop = eventTop < realInnerHeight / 2; // 是否更靠近上半部分
    const useLeft = eventLeft < realInnerWidth / 2; // 是否更靠近坐半部分

    return {
      useTop,
      useLeft,
      left: eventLeft,
      right: eventRight,
      top: eventTop,
      bottom: eventBottom,
    };
  };

  openButton.onmousedown = async function (ev) {
    let isMove = false;
    const me = this as HTMLElement;
    const config = await myStorage.getConfig();
    const eL = me.offsetLeft;
    const eT = me.offsetTop;
    const dx = ev.clientX - eL;
    const dy = ev.clientY - eT;
    me.style.transitionProperty = 'none';

    // 按下拖动
    document.onmousemove = (moveEvent) => {
      const { useTop, useLeft, top, left, bottom, right } = formatPosition(me, moveEvent, dx, dy);
      me.style.left = useLeft ? `${left}px` : '';
      me.style.right = !useLeft ? `${right}px` : '';
      me.style.top = useTop ? `${top}px` : '';
      me.style.bottom = !useTop ? `${bottom}px` : '';
      isMove = true;
    };

    // 抬起停止拖动
    document.onmouseup = (eventFinally) => {
      const { useTop, useLeft, top, left, bottom, right } = formatPosition(me, eventFinally, dx, dy);

      const isUpDown = config.suspensionOpen === ESuspensionOpen.上下;

      me.style.left = useLeft ? (isUpDown ? `${left}px` : '0') : '';
      me.style.right = !useLeft ? (isUpDown ? `${right}px` : '0') : '';
      me.style.top = useTop ? (!isUpDown ? `${top}px` : '0') : '';
      me.style.bottom = !useTop ? (!isUpDown ? `${bottom}px` : '0') : '';
      me.style.transitionProperty = 'all';

      const suspension = {
        suspensionOpen: config.suspensionOpen || ESuspensionOpen.左右,
        suspensionOpenUseTop: useTop,
        suspensionOpenUseLeft: useLeft,
        suspensionOpenLeft: useLeft ? (isUpDown ? `${left}px` : '0') : '',
        suspensionOpenRight: !useLeft ? (isUpDown ? `${right}px` : '0') : '',
        suspensionOpenTop: useTop ? (!isUpDown ? `${top}px` : '0') : '',
        suspensionOpenBottom: !useTop ? (!isUpDown ? `${bottom}px` : '0') : '',
      };

      myStorage.updateConfig({
        ...config,
        ...suspension,
      });

      document.onmousemove = null;
      document.onmouseup = null;
      me.onclick = (e) => {
        // 如果模块被移动则移除默认点击事件
        // 否则返回原有点击事件
        if (isMove) {
          e.preventDefault && e.preventDefault();
          return;
        } else {
          openChange();
          return;
        }
      };
    };
  };
};
