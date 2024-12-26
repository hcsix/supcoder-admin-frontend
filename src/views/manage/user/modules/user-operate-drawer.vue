<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchAddUser, fetchGetUserDetail, fetchUpdateUser } from '@/service/api';
import { $t } from '@/locales';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import RoleVO = SystemRoleApi.RoleVO;

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: SystemUserApi.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Pick<SystemUserApi.UserForm, 'userName' | 'sex' | 'nickName' | 'phonenumber' | 'email' | 'status'> & {
  userId: string;
  roleKeys: string[];
};

const model = ref(createDefaultModel());

const roleKeyMap: Map<number | string, RoleVO> = new Map();

function createDefaultModel(): Model {
  return {
    userId: '',
    userName: '',
    sex: '',
    nickName: '',
    phonenumber: '',
    email: '',
    roleKeys: [],
    status: '0'
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  status: defaultRequiredRule
};

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data } = await fetchGetUserDetail(model.value.userId);

  if (!error) {
    const options = data?.roles.map(item => ({
      label: item.roleName,
      value: item.roleKey
    }));
    data?.roles.forEach(item => {
      roleKeyMap.set(item.roleId, item);
    });
    model.value.roleKeys = (data?.roleIds || [])
      .map(item => roleKeyMap.get(item)?.roleKey)
      .filter(key => key !== undefined) as string[];
    roleOptions.value = [...options];
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  const commonParams = {
    userName: model.value.userName,
    sex: model.value.sex,
    nickName: model.value.nickName,
    phonenumber: model.value.phonenumber,
    email: model.value.email,
    roleIds: model.value.roleKeys
      .map(roleKey => {
        for (const [roleId, roleVO] of roleKeyMap.entries()) {
          if (roleVO.roleKey === roleKey) {
            return roleId;
          }
        }
        return undefined; // 或者你可以选择抛出一个错误，或者返回一个默认值
      })
      .filter(roleId => roleId !== undefined) as string[],
    status: model.value.status
  };
  // userId不为空说明是已经存在的用户
  if (model.value.userId) {
    updateUser({ commonParams });
  } else {
    addUser({ commonParams });
  }
  closeDrawer();
  emit('submitted');
}

async function addUser({ commonParams }: { commonParams: any }) {
  const userParams: SystemUserApi.UserForm = {
    ...commonParams,
    password: '123456'
  };
  const { error } = await fetchAddUser(userParams);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
}

async function updateUser({ commonParams }: { commonParams: any }) {
  const userParams: SystemUserApi.UserForm = {
    ...commonParams,
    userId: model.value.userId
  };
  const { error } = await fetchUpdateUser(userParams);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getRoleOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.user.userName')" path="userName">
          <NInput v-model:value="model.userName" :placeholder="$t('page.manage.user.form.userName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userGender')" path="userGender">
          <NRadioGroup v-model:value="model.sex">
            <NRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.nickName')" path="nickName">
          <NInput v-model:value="model.nickName" :placeholder="$t('page.manage.user.form.nickName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userPhone')" path="userPhone">
          <NInput v-model:value="model.phonenumber" :placeholder="$t('page.manage.user.form.userPhone')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userEmail')" path="email">
          <NInput v-model:value="model.email" :placeholder="$t('page.manage.user.form.userEmail')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userRole')" path="roles">
          <NSelect
            v-model:value="model.roleKeys"
            multiple
            :options="roleOptions"
            :placeholder="$t('page.manage.user.form.userRole')"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
