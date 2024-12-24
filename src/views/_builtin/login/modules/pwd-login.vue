<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { $t } from '@/locales';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

const codeUrl = ref('');

interface FormModel {
  tenantId: '0000';
  userName: string;
  password: string;
  validCode: '';
  rememberMe: false;
  uuid: '';
}

const model: FormModel = reactive({
  tenantId: '0000',
  userName: 'Soybean',
  password: '123456',
  validCode: '',
  rememberMe: false,
  uuid: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd,
    validCode: formRules.validCode
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.userName, model.password);
}

type AccountKey = 'super' | 'admin' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  userName: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: $t('page.login.pwdLogin.superAdmin'),
    userName: 'Super',
    password: '123456'
  },
  {
    key: 'admin',
    label: $t('page.login.pwdLogin.admin'),
    userName: 'Admin',
    password: '123456'
  },
  {
    key: 'user',
    label: $t('page.login.pwdLogin.user'),
    userName: 'User',
    password: '123456'
  }
]);


/**
 * 获取验证码
 */
// const getCode = async () => {
//   const res = await getCodeImg();
//   const { data } = res;
//   captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
//   if (captchaEnabled.value) {
//     codeUrl.value = 'data:image/gif;base64,' + data.img;
//     loginForm.value.uuid = data.uuid;
//   }
// };


async function handleAccountLogin(account: Account) {
  await authStore.login(account.userName, account.password);
}
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
    <NFormItem path="validCode">

      <div class="w-full flex-y-center gap-16px">
        <NInput
          v-model:value="model.validCode"
          :placeholder="$t('page.login.common.validCodePlaceholder')"
        />
        <NImage size="large"
                width="200"
                src="codeUrl"
        />
      </div>
      <!--                @click="getCaptcha(model.phone)"-->

<!--        <img :src="codeUrl" class="login-code-img" @click="getCode" />-->

    </NFormItem>

    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
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
<!--      <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>-->
<!--      <div class="flex-center gap-12px">-->
<!--        <NButton v-for="item in accounts" :key="item.key" type="primary" @click="handleAccountLogin(item)">-->
<!--          {{ item.label }}-->
<!--        </NButton>-->
<!--      </div>-->
    </NSpace>
  </NForm>
</template>

<style scoped></style>
