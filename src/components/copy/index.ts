import { domA, domC, message } from '../../tools';

const CLASS_CAN_COPY = 'ctz-can-copy';

/** 解除禁止转载的限制 */
export const canCopy = () => {
  domA(`.RichContent-inner:not(.${CLASS_CAN_COPY})`).forEach((item) => {
    item.classList.add(CLASS_CAN_COPY);
    item.oncopy = (event) => {
      eventCopy(event);
      message('已复制内容，若有禁止转载提示可无视');
      return true;
    };
  });
};

export const eventCopy = (event: ClipboardEvent) => {
  let clipboardData = event.clipboardData;
  if (!clipboardData) return;
  const selection = window.getSelection();
  if (!selection) return;
  const range = selection.getRangeAt(0);
  const container = document.createElement('div');
  container.appendChild(range.cloneContents());
  const html = container.innerHTML;
  let text = selection ? selection.toString() : '';
  if (text) {
    event.preventDefault();
    clipboardData.setData('text/html', html);
    clipboardData.setData('text/plain', text);
  }
};

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
