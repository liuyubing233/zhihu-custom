import { myStorage } from '../commons/storage';
import { dom } from '../commons/tools';
import { store } from '../store';

/** 绑定页面元素的点击拖动方法 */
export const myMove: IMyMove = {
  init: function (eventName, configName, name) {
    const e = dom(eventName);
    // 保存当前元素点击事件
    if (e) {
      const {getConfig, setConfig} = store;
      this.clicks[configName] = e.click;
      e.onmousedown = (ev) => {
        const pfConfig = getConfig();
        // 固定则跳出
        if (pfConfig[`${name}Fixed`]) return;
        const event: any = window.event || ev;

        const bodyW = document.body.offsetWidth;
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        const eW = e.offsetWidth;
        const eH = e.offsetHeight;
        const eL = e.offsetLeft;
        const eT = e.offsetTop;
        const evX = event.clientX;
        const evY = event.clientY;

        const dx = evX - eL;
        const dy = evY - eT;
        const rx = eW + eL - evX;
        // 按下拖动
        document.onmousemove = (ev) => {
          const eventN: any = window.event || ev;
          const evNX = eventN.clientX;
          let evenLeft = 0;
          let evenRight = 0;
          const isR = this.useR.find((i) => i === name);
          if (isR) {
            // 用 body 替代 window 获取宽度来解决右侧滚动条宽度不一致问题
            const right = bodyW - evNX - rx;
            evenRight = right <= 0 ? 0 : right >= bodyW - eW ? bodyW - eW : right;
            e.style.right = evenRight + 'px';
          } else {
            const left = evNX - dx;
            evenLeft = left <= 0 ? 0 : left >= windowW - eW ? windowW - eW : left;
            e.style.left = evenLeft + 'px';
          }
          const top = eventN.clientY - dy;
          const evenTop = top <= 0 ? 0 : top >= windowH - eH ? windowH - eH : top;
          // 元素不能超过页面宽高
          e.style.top = evenTop + 'px';
          this.isMove = true;
          this.timer[configName] && clearTimeout(this.timer[configName]);
          this.timer[configName] = setTimeout(async () => {
            clearTimeout(this.timer[configName]);
            await myStorage.configUpdateItem(configName, `${isR ? `right: ${evenRight}px;` : `left: ${evenLeft}px;`}top: ${evenTop}px;`)
          }, 500);
        };

        // 抬起停止拖动
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
          e.onclick = (e) => {
            // 如果模块被移动则移除默认点击事件
            // 否则返回原有点击事件
            if (this.isMove) {
              this.isMove = false;
              return e.preventDefault && e.preventDefault();
            } else {
              return this.clicks[configName];
            }
          };
        };
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          return false;
        }
      };
    }
  },
  destroy: function (eventName: string) {
    const e = dom(eventName);
    e && (e.onmousedown = null);
  },
  isMove: false,
  clicks: {},
  timer: {},
  useL: ['suspensionHomeTab', 'suspensionFind', 'suspensionSearch'], // 使用left定位的name
  useR: ['suspensionUser'], // 使用right定位的name
};

interface IMyMove {
  init: (eventName: string, configName: string, name: string) => void;
  destroy: (eventName: string) => void;
  isMove: boolean;
  clicks: Record<string, any>; // string: Event Function
  timer: Record<string, NodeJS.Timeout>;
  useL: string[];
  useR: string[];
}
