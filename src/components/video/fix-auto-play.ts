
/** 解决视频自动播放问题 */
export const fixVideoAutoPlay = () => {
  // 拦截 video.play() 指令
  var originalPlay = HTMLMediaElement.prototype.play;
  // @ts-ignore
  HTMLMediaElement.prototype.play = function () {
    // 如果视频隐藏则退出
    if (!this.offsetHeight) {
      return;
    }
    // @ts-ignore
    // 否则正常执行 video.play() 指令
    return originalPlay.apply(this, arguments);
  };
};
