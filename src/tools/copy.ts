import { domC } from './dom';

/** 复制文本 */
export const copy = async (value: string) => {
  if (navigator.clipboard && navigator.permissions) {
    await navigator.clipboard.writeText(value);
  } else {
    const domTextarea = domC('textArea', {
      value,
      style: 'width: 0px;position: fixed;left: -999px;top: 10px;',
    }) as HTMLInputElement;
    domTextarea.setAttribute('readonly', 'readonly');
    document.body.appendChild(domTextarea);
    domTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(domTextarea);
  }
};
