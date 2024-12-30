<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue';
import { NButton, NForm, NFormItem, NInput } from 'naive-ui';
import { fetchUpdateUserPwd } from '@/service/api';
import ResetPwdForm = SystemUserApi.ResetPwdForm;


defineOptions({
  name: 'ResetPwd'
});

const { proxy } = getCurrentInstance() as any;
const pwdRef = ref<any>(null);
const user = ref<ResetPwdForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const equalToPassword = (rule: any, value: string, callback: any) => {
  if (user.value.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur'
    },
    { pattern: /^[^<>"'|\\]+$/, message: '不能包含非法字符：< > " \' \\ |', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      validator: equalToPassword,
      trigger: 'blur'
    }
  ]
});

/** 提交按钮 */
const submit = () => {
  pwdRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await fetchUpdateUserPwd(user.value.oldPassword, user.value.newPassword);
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
  <NForm ref="pwdRef" :model="user" :rules="rules" label-width="80px">
    <NFormItem label="旧密码" path="oldPassword">
      <NInput v-model:value="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
    </NFormItem>
    <NFormItem label="新密码" path="newPassword">
      <NInput v-model:value="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </NFormItem>
    <NFormItem label="确认密码" path="confirmPassword">
      <NInput v-model:value="user.confirmPassword" placeholder="请确认新密码" type="password" show-password />
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
