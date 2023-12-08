import { defineStore } from "pinia"
import { ref ,reactive} from "vue"
import axios from "axios"
import type { FormInstance, FormRules } from 'element-plus'

interface UserGameInfo {
  user_id: string | null
  server_id: Number | null;
  game_id : Number | null;
  game_uid: String | null;
  game_username: String | null;
  isMain: String | null;
  user_comment: String | null;

}

interface ServerInfo {
  server_id: Number | null;
  game_id: Number | null;
  server_name: String | null;
  button_enable: Boolean | null;
}

interface GameInfo {
  game_id: Number | null;
  'gameName_zh-TW' : String | null;
  'gameName_en-US' : String | null;
  series_id: Number | null;
  description_1 : String | null;
  description_2 : String | null;
  danger_description : String | null;
}
interface UidManipulateStore {
  userGameInfo: UserGameInfo | null;
  serverInfo: ServerInfo | null;
  gameInfo: GameInfo | null;
  game_uid: string | null;
  game_username: string | null;
  isMain: string | null;
  user_comment : string | null;
  selectAccount_Index: string;
  tempUid: string | null;
  tempUsername: string | null;
  tempIsMain: string | null;
  tempUserComment: string | null;
  restoreUidValue: () => Promise<void>;
  resetUidValue: () => Promise<void>;
  settleInputBug: () => Promise<void>;
  passAndSetUidInfo: (userGameInfo: UserGameInfo | null) => void;
}

export const useUidManipulateStore:UidManipulateStore = defineStore("uidManipulate", () => {
  const userGameInfo = reactive<UserGameInfo>({
    user_id: null,
    server_id: null,
    game_id: null,
    game_uid: null,
    game_username: null,
    isMain: null,
    user_comment: null,
  })
  const validation_wordCount = (rule: any, value: string, callback: any, validationType: any) => {
  if(validationType == "game_uid"){
    if(value.length > 100){
      callback(new Error('你的UID有够长,你是不是在搞事,最多150个字'))
    } else {
      callback()
    }
  } else if(validationType == "game_username"){
    if(value.length > 100){
      callback(new Error('我不知道你是不是在搞事,我只懂游戏都不会给你取那么长的名,最多100个字'))
    } else {
      callback()
    }
  } else if (validationType == "user_comment"){
    if(value.length > 300){
      callback(new Error('太长了拉,最多300个字,你以为你写作文?'))
    } else {
      callback()
    }
  } 
  }
  const testvalid = (rule: any, value: string, callback: any) => {
    if(value.length > 10){
      callback(new Error('你的UID有够长,你是不是在搞事,最多150个字'))
    } else {
      callback()
    }
  }
  const validationRules = <FormRules<UserGameInfo>> ( {
    isMain: [
      { required: true, message: '請選擇賬號類型', trigger: 'blur' },
    ],
    server_id: [
      { required: true, message: '請選擇服務器', trigger: 'blur' },
    ],
    game_uid: [
      { required: true, message: '請輸入遊戲UID', trigger: 'blur' },
      { validator:(rule, value, callback) => validation_wordCount(rule, value, callback, "game_uid"), trigger: 'blur' },
    ],
    game_username: [
      { validator:(rule, value, callback) => validation_wordCount(rule, value, callback, "game_username"), trigger: 'blur' },

    ],
    user_comment: [
      { validator:(rule, value, callback) => validation_wordCount(rule, value, callback, "user_comment"), trigger: 'blur' },

    ],
  })
  const serverInfo: ServerInfo = reactive({
    server_id: ref(null),
    game_id: ref(null),
    server_name: ref(null),
    button_enable: ref(null),
  })
  const gameInfo: GameInfo = reactive({
    game_id: ref(null),
    'gameName_zh-TW': ref(null),
    'gameName_en-US': ref(null),
    series_id: ref(null),
    description_1: ref(null),
    description_2: ref(null),
    danger_description: ref(null),
  })


  const selectAccount_Index = ref("")
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
      tempUid.value == "" ? (tempUid.value = null) : tempUid.value
      tempUsername.value == ""
        ? (tempUsername.value = null)
        : tempUsername.value
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
    validation_wordCount,
    validationRules,
    userGameInfo,
    serverInfo,
    gameInfo,
    selectAccount_Index,
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
