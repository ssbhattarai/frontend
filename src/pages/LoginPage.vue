<script setup>
import {ref} from "vue";
import {apiInstance} from "boot/axios";
import { useQuasar } from 'quasar'
import {useRouter} from "vue-router";

const $q = useQuasar();
const isPwd = ref(true);
const loginData = ref({})
const router = useRouter();

const onSubmit = () => {
  apiInstance.post('login', loginData.value).then(res => {
    $q.localStorage.set(process.env.ACCESS_KEY_NAME, res.data.access_token)
    router.push({ name: 'Home'});
  }).catch(error => {
    $q.notify({
      type: 'notify-error',
      message: error.response.data.message,
    });
  });
}

const onReset = () => {
  loginData.value = {}
}
</script>

<template>
  <div class="my-container q-pa-md row justify-center items-center q-gutter-md">
    <q-card class="my-card">
      <q-card-section>
        <span class="text-h4">Login</span>
      </q-card-section>
      <q-separator />
      <q-card-section class="login-form">
        <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset" class="q-gutter-md m-5">
          <q-input
            ref="nameRef"
            filled
            label="Email *"
            lazy-rules
            placeholder="example@example.com"
            type="email"
            autofocus
            aria-autocomplete
            v-model="loginData.email"
          />

          <q-input
            ref="ageRef"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Password *"
            lazy-rules
            placeholder="Password"
            place
            v-model="loginData.password"
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
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </form>
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
