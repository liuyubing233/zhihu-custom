/** 节流, 使用时 fn 需要为 function () {} */
export function throttle(fn: Function, time = 300) {
  let tout: NodeJS.Timeout | undefined = undefined;
  return function () {
    clearTimeout(tout);
    tout = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, arguments);
    }, time);
  };
}
