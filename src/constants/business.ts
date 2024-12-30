import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  '0': 'page.manage.common.status.enable',
  '1': 'page.manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<SystemUserApi.UserGender, App.I18n.I18nKey> = {
  '0': 'page.manage.user.gender.unknown',
  '1': 'page.manage.user.gender.male',
  '2': 'page.manage.user.gender.female'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<SystemMenuApi.MenuTypeEnum, App.I18n.I18nKey> = {
  'C': 'page.manage.menu.type.directory',
  'M': 'page.manage.menu.type.menu',
  'F': 'page.manage.menu.type.button',
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<SystemMenuApi.IconType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.iconType.iconify',
  '2': 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);
