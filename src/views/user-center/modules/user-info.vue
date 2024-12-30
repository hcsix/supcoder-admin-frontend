<script setup lang="ts">
import { computed, ref } from 'vue';
import { NButton, NForm, NFormItem, NInput, NRadio, NRadioGroup } from 'naive-ui';
import { fetchUpdateUserProfile } from '@/service/api';

defineOptions({
  name: 'UserInfo'
});

export type UserForm = Pick<SystemUserApi.UserVO, 'userId' | 'userName' | 'nickName' | 'sex' | 'phonenumber' | 'email' | 'roleKeys' | 'status'>

const props = withDefaults(defineProps<{
  user: UserForm;
}>(), {
  user: () => ({
    userId: '',
    userName: '',
    nickName: '',
    sex: '',
    phonenumber: '',
    email: '',
    roleKeys: [],
    status: ''
  })
});
const userForm = computed(() => props.user);

const rule = {
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
};

const rules = ref(rule);

/** 提交按钮 */
const submit = () => {
  userRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await fetchUpdateUserProfile(props.user);
      proxy?.$modal.msgSuccess('修改成功');
    }
  });
};

/** 关闭按钮 */
const close = () => {
  proxy?.$tab.closePage();
};
</script>

<template>
  <NForm ref="userRef" :model="userForm" :rules="rules" label-width="80px">
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
    <NFormItem>
      <NButton type="primary" @click="submit">保存</NButton>
      <NButton type="error" @click="close">关闭</NButton>
    </NFormItem>
  </NForm>
</template>


<style scoped>
/* 添加一些样式以美化页面 */
.n-form-item {
  margin-bottom: 16px;
}
</style>
