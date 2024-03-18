import {defineStore} from 'pinia'
import {api} from "boot/axios";
import {computed, reactive, ref} from "vue";
import {buildFormData} from "src/composables/buildFormData";

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
    rowsPerPage: 15
  });
  const query = ref(null);
  const filters = ref({});
  const formData = ref({});

  const fetchData = () => {
    loading.value = true;
    let filtersList = encodeURIComponent(JSON.stringify(filters.value));
    var queryString = Object.keys(filters.value)
      .map(key => {
        let val = filters.value[key];
        if (val && val !== "null") return key + "=" + filters.value[key];
      })
      .join("&");

    return new Promise((resolve, reject) => {
      api.get(stateName.value, {
        params: {
          page: serverPagination.value.page,
          size: serverPagination.value.rowsPerPage,
          filters: filtersList,
          q: query.value
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
  const createData = () =>{
    return new Promise((resolve, reject) => {
      const url = stateName.value + '/create';

      let data = new FormData();
      Object.keys(formData.value).forEach(key => {
        console.log(key)
        if (typeof formData.value[key] !== 'object'){
          data.append(key, formData.value[key])
        } else {
          buildFormData(data, formData.value, key)
        }
      });

      api.post(url, data).then(res => {
        formData.value = {};

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
    setServerPagination,
    filters,
    query,
    formData,
    createData
  }
})

