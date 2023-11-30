import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"
export const useUidManipulateStore = defineStore("uidManipulate", () => {
  const selectAccount_Index = ref("")
  const showUidInput = ref(false)
  const gameUid = ref("")
  const gameUsername = ref("")
  const isMain = ref("")
  const tempUid = ref("")
  const tempUsername = ref("")
  const tempIsMain = ref("")
  async function restoreUidValue() {
    try {
      tempUid.value ? (gameUid.value = tempUid.value) : (gameUid.value = null)
      tempUsername.value
        ? (gameUsername.value = tempUsername.value)
        : (gameUsername.value = null)
      tempIsMain.value ? (isMain.value = tempIsMain.value) : (isMain.value = null)
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
      isMain.value = null
      selectAccount_Index.value = null

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
      isMain.value == "" ? (isMain.value = null) : isMain.value
    } catch (error) {
      console.log(error)
    }
  }

  async function passAndSetUidInfo(user_GameInfo){
    console.log(user_GameInfo)
      if(user_GameInfo){
        tempUid.value = user_GameInfo["game_uid"]
        tempUsername.value = user_GameInfo["game_username"]
        gameUid.value = user_GameInfo["game_uid"]
        gameUsername.value = user_GameInfo["game_username"]
        isMain.value = user_GameInfo["isMain"]
      } else {
        gameUid.value = ""
        gameUsername.value = ""
        tempUid.value = ""
        tempUsername.value = ""
      }
  }

  return {
    selectAccount_Index,
    showUidInput,
    tempUid,
    tempUsername,
    tempIsMain,
    gameUid,
    gameUsername,
    isMain,
    restoreUidValue,
    resetUidValue,
    settleInputBug,
    passAndSetUidInfo
  }
})
