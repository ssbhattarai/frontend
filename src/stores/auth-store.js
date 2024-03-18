import { defineStore } from 'pinia';
import {api} from "boot/axios";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: [],
  }),
  getters: {

  },
  actions: {
    fetchLoggedInUser() {
      api.get('user').then(res => {
        this.user = res.data.data;
      }).catch(error => {
          this.router.push({name: "Login"})
      })
    },
  },
  persist: true,
});
