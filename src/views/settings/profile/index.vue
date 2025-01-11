<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton, NCard, NForm, NFormItem, NInput, NRadio, NRadioGroup } from 'naive-ui';
import { fetchGetUserProfile, fetchUpdateUserProfile } from '@/service/api';
import { useNaiveForm } from '@/hooks/common/form';

const { validate } = useNaiveForm();

export type UserForm = Pick<
  SystemUserApi.UserVO,
  'userId' | 'userName' | 'nickName' | 'sex' | 'phonenumber' | 'email' | 'status'
>;

const props = withDefaults(defineProps<{ user?: UserForm }>(), {
  user: () => ({
    userId: '',
    userName: '',
    nickName: '',
    sex: '',
    phonenumber: '',
    email: '',
    roleKeys: [],
    status: '',
    password: ''
  })
});
const userForm = ref<UserForm>(props.user);

const rules = ref({
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  phonenumber: [
    {
      required: true,
      message: '手机号码不能为空',
      trigger: 'blur'
    },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
});

const userRef = ref<InstanceType<typeof NForm> | null>(null);

async function getUserProfile() {
  const res = await fetchGetUserProfile();
  if (res.data?.user) {
    userForm.value = { ...res.data.user };
  }
}

async function handleSubmit() {
  await validate();
  const formData = { ...userForm.value, password: undefined };
  // 确保 userId 是字符串类型
  formData.userId = String(formData.userId || '');
  // 显式类型断言以确保类型兼容
  await fetchUpdateUserProfile(formData as SystemUserApi.UserForm);
  window.$message?.success('修改成功');
}

onMounted(() => {
  getUserProfile();
});
</script>

<template>
  <div>
    <NCard :title="$t('route.settings_profile')" :bordered="false" class="mt-2 card-wrapper">
      <NForm ref="userRef" :model="userForm" :rules="rules" label-width="80px" @keyup.enter="handleSubmit">
        <NFormItem label="用户昵称" path="nickName">
          <NInput v-model:value="userForm.nickName" maxlength="30" />
        </NFormItem>
        <NFormItem label="手机号码" path="phonenumber">
          <NInput v-model:value="userForm.phonenumber" maxlength="11" />
        </NFormItem>
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="userForm.email" maxlength="50" />
        </NFormItem>
        <NFormItem label="性别">
          <NRadioGroup v-model:value="userForm.sex">
            <NRadio value="0">男</NRadio>
            <NRadio value="1">女</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem class="form-actions">
          <NButton type="primary" @click="handleSubmit">修改</NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </div>
</template>

<style scoped>
.form-actions .n-button {
  margin-right: 10px;
}

.form-actions .n-button:last-child {
  margin-right: 0;
}
</style>
