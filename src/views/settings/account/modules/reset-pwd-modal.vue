<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput, NModal, NSpace } from 'naive-ui';
import { ref } from 'vue';
import { fetchUpdateUserPwd } from '@/service/api';
import ResetPwdForm = SystemUserApi.ResetPwdForm;

defineOptions({
  name: 'ResetPwdModal'
});

const pwdRef = ref<any>(null);
const user = ref<ResetPwdForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  // 重置表单数据
  user.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  visible.value = false;
}

const equalToPassword = (value: string, callback: any) => {
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
const handleSubmit = () => {
  pwdRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await fetchUpdateUserPwd(user.value.oldPassword, user.value.newPassword);
        window.$message?.success('密码重置成功');
        closeModal();
      } catch (error) {
        window.$message?.error(error.message || '密码重置失败');
      }
    }
  });
};
</script>

<template>
  <NModal v-model:show="visible" :title="$t('page.login.resetPwd.title')" preset="card" class="w-480px">
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
    </NForm>
    <template #footer>
      <NSpace justify="end">
        <NButton size="small" class="mt-16px" @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
/* 添加一些样式以美化页面 */
.n-form-item {
  margin-bottom: 16px;
}
</style>
