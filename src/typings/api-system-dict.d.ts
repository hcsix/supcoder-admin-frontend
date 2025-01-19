/**
 * Namespace AuthApi
 *
 * auth backend api type
 */
declare namespace SystemDictApi {
  import CommonSearchParams = Api.Common.CommonSearchParams;
  import CommonRecord = Api.Common.CommonRecord;

  /** DictType search params */
  type DictTypeSearchParams = CommonType.RecordNullable<Pick<DictType, 'dictName' | 'dictType'> & CommonSearchParams>;

  /** DictType */
  type DictType = CommonRecord<{
    dictId: number;
    dictName: string;
    dictType: string;
    remark: string;
  }>;

  /** 字典表单类型 */
  export interface DictTypeForm {
    dictId?: number;
    dictName: string;
    dictType: string;
    remark?: string;
    createTime: string;
  }

  /** DictData */
  type DictData = CommonRecord<{
    dictCode: number;
    dictSort: number;
    dictLabel: string;
    dictValue: string;
    dictType: string;
    cssClass: string;
    listClass: string;
    isDefault: string;
    remark: string;
    createTime: string;
  }>;

  /** DictData search params */
  type DictDataSearchParams = CommonType.RecordNullable<Pick<DictData, 'dictLabel' | 'dictType'> & CommonSearchParams>;
}
