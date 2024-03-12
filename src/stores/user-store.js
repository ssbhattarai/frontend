import { defineStore } from 'pinia'
import {useCommonStore} from "stores/commonStore";
import {computed, reactive, ref} from "vue";

export const useUserStore = defineStore('user', () => {
  const commonStore = useCommonStore();
  commonStore.stateName = 'users';

  const all = computed(() => [...commonStore.all]);
  const stateName = ref(commonStore.stateName);
  const serverPagination =  computed({
    get() {
      return commonStore.serverPagination
    },
    set(value) {
      console.log('server pagination value', value);
      // commonStore.setServerPagination(value);
    },
  });

  const query =  computed({
    get() {
      return commonStore.query
    },
    set(value) {
      commonStore.query = value;
    },
  });

  const loading = computed(() => commonStore.loading);

  return {
    fetchData: commonStore.fetchData,
    serverPagination,
    all,
    loading,
    stateName,
    query
  }
})
