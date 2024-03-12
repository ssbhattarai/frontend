import {defineStore} from 'pinia'
import {api} from "boot/axios";
import {computed, reactive, ref} from "vue";

export const useCommonStore = defineStore('common', () => {
  const commonStore = useCommonStore();

  const stateName = ref(null);
  const all = ref([]);
  const loading = ref(false);
  let serverPagination = ref({
    page: 1,
    rowsNumber: 0,
    totalPage: 0,
    sortBy: null,
    descending: false,
    rowsPerPage: 25
  });

  const fetchData = () => {
    loading.value = true;
    return new Promise((resolve, reject) => {
      api.get(stateName.value, {
        params: {
          page: serverPagination.value.page,
          size: serverPagination.value.rowsPerPage
        }
      }).then(res => {
        all.value = res.data.data;

        const meta = res.data.meta;

        serverPagination.value.page = meta.current_page;
        serverPagination.value.rowsPerPage = meta.per_page;
        serverPagination.value.rowsNumber = meta.total;
        resolve(res);
      }).catch(error => {
        reject(error);
      }).finally(() => {
        loading.value = false;
      })
    });


  }

  const setServerPagination = (pagination) => {
    serverPagination.value = pagination;
  }


  return {
    stateName,
    serverPagination,
    fetchData,
    all,
    loading,
    setServerPagination
  }
})

