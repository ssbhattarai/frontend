import {defineStore} from 'pinia'
import {useCommonStore} from "stores/commonStore";
import {computed, reactive, ref} from "vue";

export const usePermissionStore = defineStore('permission', () => {
  const commonStore = useCommonStore();

  const all = computed(() => [...commonStore.all]);
  const stateName = ref(commonStore.stateName);
  const serverPagination = computed({
    get() {
      return commonStore.serverPagination
    }, set(value) {
      // console.log('server pagination value', value);
      // commonStore.setServerPagination(value);
    },
  });

  const query = computed({
    get() {
      return commonStore.query
    }, set(value) {
      commonStore.query = value;
    },
  });

  const formData = computed({
    get() {
      return commonStore.formData;
    }, set(value) {
      commonStore.formData = value;
    },
  });
  const updateStateValue = (val) => {
    commonStore.stateName = val;
    stateName.value = val;
  };
  const loading = computed(() => commonStore.loading);
  const title = 'permissions'

  return {
    fetchData: commonStore.fetchData,
    serverPagination, all, loading, stateName, query, title,
    updateStateValue,
    permission: formData,
    createData: commonStore.createData
  }
})
