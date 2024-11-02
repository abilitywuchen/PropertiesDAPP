import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    isLogin: false,
    account: '',
  }),
  actions: {
    Logout() {
      this.isLogin = false
      sessionStorage.clear()
    },
    Login(nowAccount:string) {
      this.account = nowAccount
      this.isLogin = true
    },
  }
})
