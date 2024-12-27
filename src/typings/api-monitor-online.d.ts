/**
 * Namespace MonitorOnlineApi
 *
 * online user monitor backend api type
 */
declare namespace MonitorOnlineApi {
  import CommonSearchParams = Api.Common.CommonSearchParams;
  import CommonRecord = Api.Common.CommonRecord;

  type OnlineUser = CommonRecord<{
    tokenId: string;
    userName: string;
    clientKey: string;
    deviceType: string;
    ipaddr: string;
    loginLocation: string;
    browser: string;
    os: string;
    loginTime: number;
  }>;

  /** online user search params */
  type OnlineUserSearchParams = CommonType.RecordNullable<
    Pick<OnlineUser, 'userName' | 'loginLocation'> & CommonSearchParams
  >;
}
