<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { $t } from '@/locales';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { fetchCaptcha } from '@/service/api';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

const codeUrl = ref('');
const captchaEnabled = ref(true);

interface FormModel {
  tenantId: string;
  userName: string;
  password: string;
  captcha: string;
  rememberMe: false;
  uuid: string;
}

const model: FormModel = reactive({
  tenantId: '000000',
  userName: 'admin',
  password: 'admin123',
  captcha: '',
  rememberMe: false,
  uuid: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd,
    captcha: formRules.captcha
  };
});



const getLoginFormData = () => {
  try {
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      model.tenantId = tenantId;
    }
    const username = localStorage.getItem('username');
    if (username) {
      model.userName = username;
    }
    const password = localStorage.getItem('password');
    if (password) {
      model.password = password;
    }
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === null) {
      model.rememberMe = false;
    } else {
      model.rememberMe = JSON.parse(rememberMe); // 更加严格的布尔值解析
    }
  } catch (error) {
    console.error('Error retrieving login data from localStorage:', error);
  }
};


/**
 * 获取验证码
 */
async function getCaptcha() {
  const response = await fetchCaptcha();
  if (response.data) {
    captchaEnabled.value = response.data.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = `data:image/gif;base64,${response.data.img}`;
      model.uuid = response.data.uuid;
    }
  }
}

async function handleSubmit() {
  await validate();
  // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
  if (model.rememberMe) {
    localStorage.setItem('tenantId', String(model.tenantId));
    localStorage.setItem('username', String(model.userName));
    localStorage.setItem('password', String(model.password));
    localStorage.setItem('rememberMe', String(model.rememberMe));
  } else {
    // 否则移除
    localStorage.removeItem('tenantId');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('rememberMe');
  }

  const loginParams :AuthApi.LoginParams =  {
    tenantId: model.tenantId,
    username: model.userName,
    password: model.password,
    code: model.captcha,
    uuid: model.uuid
  };
  const loginSuccess = await authStore.login(loginParams);
  // 没登录成功则继续获取验证码
  if (!loginSuccess){
    await getCaptcha();
  }
}


onMounted(() => {
  getCaptcha();
  getLoginFormData();
});
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NFormItem path="captcha">

      <div class="w-full flex-y-center gap-16px">
        <NInput
          v-model:value="model.captcha"
          :placeholder="$t('page.login.common.captchaPlaceholder')"
        />
        <NImage size="large"
                :src="codeUrl"
                @click="getCaptcha()"
                preview-disabled
        />
      </div>
    </NFormItem>

    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox  v-model:checked="model.rememberMe">{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <div class="flex-y-center justify-between gap-12px">
        <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleRecord['code-login']) }}
        </NButton>
        <NButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
        </NButton>
      </div>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
