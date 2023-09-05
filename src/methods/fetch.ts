import { IUserinfo } from "../types/variable-cache";

/** 调用「不感兴趣」接口 */
export const doFetchNotInterested = ({ id, type }: { id: string; type: string }, headers: HeadersInit) => {
  const nHeader = headers as Record<string, string>;
  delete nHeader['vod-authorization'];
  delete nHeader['content-encoding'];
  delete nHeader['Content-Type'];
  delete nHeader['content-type'];
  fetch('/api/v3/feed/topstory/uninterestv2', {
    body: `item_brief=${encodeURIComponent(JSON.stringify({ source: 'TS', type: type, id: id }))}`,
    method: 'POST',
    headers: new Headers({
      ...nHeader,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }),
  }).then((res) => res.json());
};

/** 获取用户信息 */
export const fetchGetUserinfo = (headers: HeadersInit): Promise<IUserinfo> => {
  return new Promise((resolve) => {
    fetch(
      `https://www.zhihu.com/api/v4/me?include=is_realname%2Cad_type%2Cavailable_message_types%2Cdefault_notifications_count%2Cfollow_notifications_count%2Cvote_thank_notifications_count%2Cmessages_count%2Cemail%2Caccount_status%2Cis_bind_phone%2Cfollowing_question_count%2Cis_force_renamed%2Crenamed_fullname%2Cis_destroy_waiting`,
      {
        method: 'GET',
        headers: new Headers(headers),
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((res: IUserinfo) => {
        resolve(res);
      });
  });
};
