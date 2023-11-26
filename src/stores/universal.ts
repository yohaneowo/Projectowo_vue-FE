import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"

export const useUniversalStore = defineStore("universal", () => {
  const showLoginComponent = ref(false)
  async function loginComponentController() {
    showLoginComponent.value = !showLoginComponent.value
  }
  return {
    showLoginComponent,
    loginComponentController
  }
})
