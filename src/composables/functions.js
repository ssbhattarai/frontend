import { computed } from 'vue';
import {useCommonStore} from "stores/commonStore";

export function useCommonFunctions() {
  const commonStore = useCommonStore();

  function fetchPaged() {
    commonStore.fetchData();
  }

  function onRequest({ pagination, filter }) {
    commonStore.setServerPagination(pagination);
    commonStore.fetchData();
  }

  const serverPagination = computed(() => commonStore.serverPagination);


  return {
    fetchPaged,
    onRequest,
    serverPagination
  }
}
