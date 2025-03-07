import { EVideoInAnswerArticle } from '../../init/init-html/configs';
import { fnAppendStyle, myStorage } from '../../tools';
import { CLASS_VIDEO_ONE, CLASS_VIDEO_TWO } from './download';

/** 修改回答和列表中的视频样式 */
export const changeVideoStyle = async () => {
  const { videoInAnswerArticle } = await myStorage.getConfig();
  fnAppendStyle('CTZ_STYLE_VIDEO', STYLE_VIDEO[videoInAnswerArticle || EVideoInAnswerArticle.默认]);
};

const STYLE_VIDEO = {
  [EVideoInAnswerArticle.默认]: '',
  [EVideoInAnswerArticle.修改为链接]:
    `${CLASS_VIDEO_ONE}>div,${CLASS_VIDEO_ONE}>i{display: none;}` +
    `${CLASS_VIDEO_ONE}{padding: 0!important;height:24px!important;width: fit-content!important;}` +
    `${CLASS_VIDEO_ONE}::before{content: '视频链接，点击跳转';cursor:pointer;color: #1677ff;font-size:12px;font-weight:600;}` +
    `${CLASS_VIDEO_ONE}:hover::before{color: rgb(0, 64, 221)}` +
    `${CLASS_VIDEO_TWO}::before,${CLASS_VIDEO_TWO}>i{display: none;}` +
    `.VideoAnswerPlayer + div{display:none;}.VideoAnswerPlayer::before{content: '视频链接，点击跳转';cursor:pointer;color: #1677ff;font-size:12px;font-weight:600;}` +
    `.VideoAnswerPlayer:hover::before{color: rgb(0, 64, 221)}`,
  [EVideoInAnswerArticle.隐藏视频]:
    `${CLASS_VIDEO_ONE}>div,${CLASS_VIDEO_ONE}>i{display: none;}` +
    `${CLASS_VIDEO_ONE}{padding: 0!important;height:24px!important;width: fit-content!important;}` +
    `${CLASS_VIDEO_ONE}::before{content: '隐藏一条视频内容';cursor:pointer;color: rgb(142, 142, 147);font-size: 12px;}`,
};
