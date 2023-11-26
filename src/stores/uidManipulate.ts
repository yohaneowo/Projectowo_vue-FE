import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"
export const useUidManipulateStore = defineStore("uidManipulate", () => {
  const showUidInput = ref(false)
  const gameUid = ref("")
  const gameUsername = ref("")
  const tempUid = ref("")
  const tempUsername = ref("")
  async function restoreUidValue() {
    try {
      tempUid.value ? (gameUid.value = tempUid.value) : (gameUid.value = null)
      tempUsername.value
        ? (gameUsername.value = tempUsername.value)
        : (gameUsername.value = null)
    } catch (error) {
      console.log(error)
    }
  }
  async function resetUidValue() {
    try {
      gameUid.value = null
      gameUsername.value = null
      tempUid.value = null
      tempUsername.value = null
    } catch (error) {
      console.log(error)
    }

    console.log(`gameUsername.value: ${gameUsername.value}`)
    console.log(`gameUid.value: ${gameUid.value}`)
    console.log(`tempUid.value: ${tempUid.value}`)
    console.log(`tempUsername.value: ${tempUsername.value}`)
  }
  async function settleInputBug() {
    try {
      /* 
    當Input輸入值後然後刪除,原先綁定的v-model會變成空字串而不是null
    */

      gameUid.value == "" ? (gameUid.value = null) : gameUid.value
      gameUsername.value == ""
        ? (gameUsername.value = null)
        : gameUsername.value
    } catch (error) {
      console.log(error)
    }
  }
  return {
    showUidInput,
    tempUid,
    tempUsername,
    gameUid,
    gameUsername,
    restoreUidValue,
    resetUidValue,
    settleInputBug
  }
})
