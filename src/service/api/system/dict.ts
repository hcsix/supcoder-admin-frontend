import { listRequest, request } from '../../request';
import PaginatingResponse = App.Service.PaginatingResponse;

/** Get Dictionary info */
/**
 * 查询字典类型列表
 *
 * @param query
 */
export function fetchGetDictTypeList(params?: SystemDictApi.DictTypeSearchParams) {
  return listRequest<PaginatingResponse<SystemDictApi.DictType>>({
    url: '/system/dict/type/list',
    method: 'get',
    params
  }).then(response => {
    if (response && response.data?.rows) {
      response.data.rows = response.data.rows.map(dictType => ({
        ...dictType,
        id: dictType.dictId
      }));
    }
    if (response?.data && params) {
      response.data.pageNum = params.pageNum ?? 1;
      response.data.pageSize = params.pageSize ?? 10;
    }
    return response;
  });
}

/** 新增字典类型 */
export function fetchAddDictType(data: Pick<SystemDictApi.DictTypeForm, 'dictName' | 'dictType' | 'remark'>) {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data
  });
}

/** 修改字典类型 */
export function fetchUpdateDictType(data: SystemDictApi.DictTypeForm) {
  return request({
    url: '/system/dict/type',
    method: 'put',
    data
  });
}

/**
 * 删除字典类型
 *
 * @param dictTypeId DictType ID
 */
export function fetchDelDictType(dictTypeId: Array<number | string> | string | number) {
  return request({
    url: `/system/dict/type/${dictTypeId}`,
    method: 'delete'
  });
}

/**
 * 查询字典类型详细
 *
 * @param dictTypeId
 * @returns
 */
export function fetchGetDictType(dictTypeId: string) {
  return request<SystemDictApi.DictType>({
    url: `/system/dict/data/type/${dictTypeId}`,
    method: 'get'
  });
}

/** 字典类型选项 */
export function fetchGetDictTypeOptionselect() {
  return request<SystemDictApi.DictType[]>({
    url: '/system/dict/type/optionselect',
    method: 'get'
  });
}

/**
 * 查询字典数据列表
 *
 * @param query
 */
export function fetchGetDictDataList(params?: SystemDictApi.DictDataSearchParams) {
  return listRequest<PaginatingResponse<SystemDictApi.DictData>>({
    url: 'system/dict/data/list',
    method: 'get',
    params
  }).then(response => {
    if (response && response.data?.rows) {
      response.data.rows = response.data.rows.map(dictType => ({
        ...dictType,
        id: dictType.dictCode
      }));
    }
    if (response?.data && params) {
      response.data.pageNum = params.pageNum ?? 1;
      response.data.pageSize = params.pageSize ?? 10;
    }
    return response;
  });
}
