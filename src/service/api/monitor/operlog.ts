import { listRequest, request } from '../../request';
import PaginatingResponse = App.Service.PaginatingResponse;

/**
 * 查询在线用户列表
 *
 * @param query
 */
export function fetchGetOperateLogList(params?: MonitorOperLogApi.OperLogSearchParams) {
  return listRequest<PaginatingResponse<MonitorOperLogApi.OperLog>>({
    url: '/monitor/operlog/list',
    method: 'get',
    params
  }).then(response => {
    if (response?.data?.rows) {
      response.data.rows = response.data.rows.map(log => ({
        ...log,
        id: log.operId
      }));
    }
    return response;
  });
}
