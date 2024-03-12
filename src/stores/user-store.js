import { defineStore } from 'pinia'
import {useCommonStore} from "stores/commonStore";
import {computed, reactive, ref} from "vue";

export const useUserStore = defineStore('user', () => {
  const commonStore = useCommonStore();
  commonStore.stateName = 'users';

  const all = computed(() => [...commonStore.all]);
  const serverPagination =  computed({
    get() {
      return commonStore.serverPagination
    },
    set(value) {
      console.log('server pagination value', value);
      // commonStore.setServerPagination(value);
    },
  });
  console.log(serverPagination)
  const loading = ref(commonStore.loading);

  return {
    fetchData: commonStore.fetchData,
    serverPagination,
    all,
    loading,
  }
})
