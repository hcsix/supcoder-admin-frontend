import { listRequest, request } from '../../request';
import PaginatingResponse = App.Service.PaginatingResponse;

/**
 * 查询在线用户列表
 *
 * @param query
 */
export function fetchGetOnlineUserList(params?: MonitorOnlineApi.OnlineUserSearchParams) {
  return listRequest<PaginatingResponse<MonitorOnlineApi.OnlineUser>>({
    url: '/monitor/online/list',
    method: 'get',
    params
  }).then(response => {
    if (response && response.data?.rows) {
      response.data.rows = response.data?.rows.map(user => ({
        ...user,
        id: user.tokenId
      }));
    }
    return response;
  });
}

/**
 * 删除用户
 *
 * @param userId 用户ID
 */
export function fetchForceLogoutUser(tokenId: string | number) {
  return request({
    url: `/monitor/online/${tokenId}`,
    method: 'delete'
  });
}
