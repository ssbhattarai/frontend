<template>
  <q-page class="flex flex-center">
    <p>{{ $t('success')}}</p>
  </q-page>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { ref } from "vue";
import {useAuthStore} from "stores/auth-store";

const authUser = useAuthStore();

authUser.fetchLoggedInUser();

</script>
