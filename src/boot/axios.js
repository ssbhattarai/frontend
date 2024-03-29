import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {LocalStorage, Notify} from "quasar";
import { useRouter} from "vue-router";

const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'Authorization': 'Bearer ' + LocalStorage.getItem(process.env.ACCESS_KEY_NAME)
  },
})

const router =useRouter();

api.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  if (error.response && error.response.status === 404) {
    Notify.create({
      message: error.response.data.message ? error.response.data.message : 'Your request URL not found.',
      timeout: 3000,
      color: "negative"
    });
  } else if (error.response && error.response.status === 400){
    Notify.create({
      message: error.response.data.message ? error.response.data.message : 'Bad Request',
      timeout: 3000,
      color: "negative"
    });
  }else if (error.response && error.response.status === 403){
    Notify.create({
      message: error.response.data.message ? error.response.data.message : 'Unauthorized access',
      timeout: 3000,
      color: "negative"
    });
  }else if (error.response && error.response.status === 401){
    Notify.create({
      message: error.response.data.message ? error.response.data.message : 'Unauthorized access',
      timeout: 3000,
      color: "negative"
    });
    LocalStorage.remove('access_key');
    router.push({name: 'Login'});
  } else if (error.response && error.response.status === 422) {
    Notify.create({
      message: error.response.data.message ? error.response.data.message : "Invalid input",
      timeout: 3000,
      color: "negative"
    });
  }else if (error.response && error.response.status === 500){
    Notify.create({
      message: error.response.data.message ? error.response.data.message : 'Internal Server Error, Contact System Admin.',
      timeout: 3000,
      color: "negative"
    });
  }

  return Promise.reject(error);
});
const apiInstance = axios.create({baseURL: process.env.BASE_URL})

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  app.config.globalProperties.$apiInstance = apiInstance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export {api, apiInstance}
