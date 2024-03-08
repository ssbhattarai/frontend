<script setup>
import {ref} from "vue";
import {apiInstance} from "boot/axios";
import { useQuasar } from 'quasar'
import {useRouter} from "vue-router";
import { useCustomValidations } from "src/composables/validations";


const $q = useQuasar();
const isPwd = ref(true);
const loginData = ref({})
const router = useRouter();
const { rules } = useCustomValidations();
const loginForm  = ref(null);
const loading = ref(false);

if (process.env.APP_ENV === 'dev'){
  loginData.value.email = 'ssbhattarai.er@gmail.com'
  loginData.value.password = 'ssbhattarai'
}


const onSubmit = () => {
  loading.value = true;
  loginForm.value.validate().then(success => {
    if (success) {
      apiInstance.post('login', loginData.value).then(res => {
        loading.value = false;
        $q.localStorage.set(process.env.ACCESS_KEY_NAME, res.data.access_token)
        window.location.href = '/';
        // router.push({ name: 'Home', replace: true});
      }).catch(error => {
        loading.value = false;
        $q.notify({
          type: 'notify-error',
          message: error.response.data.message,
        });
      });
    } else {
      loading.value = false;
    }
  })

}

const onReset = () => {
  loginData.value = {}
}
</script>

<template>
  <div class="my-container q-pa-md row justify-center items-center q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        <span class="text-h4">{{ $t('login')}}</span>
      </q-card-section>
      <q-separator />
      <q-card-section class="login-form">
        <q-form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset" ref="loginForm" class="q-gutter-md m-5">
          <q-input
            ref="nameRef"
            outlined
            label="Email *"
            lazy-rules
            placeholder="example@example.com"
            type="email"
            autofocus
            autocomplete
            v-model="loginData.email"
            :rules="[rules.required, rules.email]"
          />

          <q-input
            ref="ageRef"
            outlined
            :type="isPwd ? 'password' : 'text'"
            label="Password *"
            lazy-rules
            placeholder="Password"
            place
            autocomplete
            v-model="loginData.password"
            :rules="[rules.required]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

<!--          <q-toggle label="I accept the license and terms" />-->

          <div class="q-mt-md">
            <q-btn label="Submit" :loading="loading" :disable="loading" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" :disable="loading" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
      <q-card-section>
        Forgot password? Reset now.
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.my-container {
  height: 100vh; /* Set the container height to 100% of the viewport */
  background-color: darkcyan;
}

.my-card {
  width: 30%;
  height: 25rem;
}

.login-form {
  margin-top: 30px;
}
@media (max-width: 767px){
  .my-container {
    padding: 0!important;
  }
  .my-card {
    width: 100%;
    box-shadow: none;
  }
}
</style>
