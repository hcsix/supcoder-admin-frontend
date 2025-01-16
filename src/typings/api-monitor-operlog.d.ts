/**
 * Namespace MonitorOperLogApi
 *
 * operate log user monitor backend api type
 */
declare namespace MonitorOperLogApi {
  import CommonSearchParams = Api.Common.CommonSearchParams;
  import CommonRecord = Api.Common.CommonRecord;

  type OperLog = CommonRecord<{
    operId: string;
    title: string;
    businessType: number;
    businessTypes?: null; // 可选字段，可能是 null
    method: string;
    requestMethod: string;
    operatorType: number;
    operName: string;
    operUrl: string;
    operIp: string;
    operLocation: string;
    operParam: string; // 如果参数是 JSON 字符串，可以考虑使用更复杂的类型
    jsonResult: string; // 如果返回值是 JSON 字符串，可以考虑使用更复杂的类型
    errorMsg: string;
    operTime: string; // ISO 8601 格式的日期时间字符串
    costTime: number;
  }>;

  /** online user search params */
  type OperLogSearchParams = CommonType.RecordNullable<
    Pick<OperLog, 'requestMethod' | 'operName'> & CommonSearchParams
  >;
}
