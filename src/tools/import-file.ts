/**
 * Input type="file" 类型的导入文件方法
 * @param domInput 元素
 * @param callBack 导入完成的回调函数
 */
export const inputImportFile = (domInput: HTMLInputElement, callBack: (ev: ProgressEvent<FileReader>) => void) => {
  domInput.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const configFile = (target.files || [])[0];
    if (!configFile) return;
    const reader = new FileReader();
    reader.readAsText(configFile);
    reader.onload = callBack;
    target.value = '';
  };
};
