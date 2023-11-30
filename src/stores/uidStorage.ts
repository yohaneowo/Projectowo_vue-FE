import { defineStore } from "pinia"
import { ref } from "vue"
import axios from "axios"
import { ElMessage, ElMessageBox } from "element-plus"

export const useGameUidStorageStore = defineStore("gameUidStorage", () => {
  const showUidRanking = ref(true)
  const showUidDisplay = ref(false)
  const selectedUserId = ref("")
  const selectedGameId = ref()
  // const showSpecificGameDisplayPlayer = ref(false)
  const showSpecificGameUidDisplay = ref(false)
  async function fetchUserGameInfo() {
    try {
      const response = await axios.get(
        "http://localhost:3366/api/get-userGameInfo",
        {
          params: {
            user_id: selectedUserId.value,
            game_id: selectedGameId.value
            // user_id: user_id,
            // game_id: game_id
          }
        }
      )

      // console.log(`res.data: ${response.data}`)
      // console.log(`IM GLres.data[0]: ${response.data[0].isMain}`)

      return response.data
    } catch (error) {
      console.log(error)
      throw error // 可选：如果希望在组件中捕获错误并进行处理，则可以抛出错误
    }
  }
  async function fetchSelectedGameServerInfo() {
    console.log("selectedGameId.value tis is pinia")
    try {
      const response = await axios.get(
        "http://localhost:3366/api/get-serverInfo",
        {
          params: {
            game_id: selectedGameId.value
          }
        }
      )
      console.log(response.data)
      console.log("NITAMAGAOWO?")
      return response.data.map((server) => ({
        ...server,
        button_enable: false
      }))
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchGameInfo() {
    try {
      const response = await axios.get(
        "http://localhost:3366/api/get-gameInfo",
        {
          params: {
            game_id: selectedGameId.value
          }
        }
      )
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCancelConfirmation() {
    return new Promise((resolve, reject) => {
      ElMessageBox.confirm("你剛剛有修改東西,你確定要直接離開?", "注意", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ElMessage({
            type: "success",
            message: "確認放行"
          })
          resolve(true)
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "攔截你成功"
          })
          resolve(false)
        })
    })
  }

  return {
    showUidRanking,
    showUidDisplay,
    selectedUserId,
    selectedGameId,
    showSpecificGameUidDisplay,
    fetchGameInfo,
    fetchUserGameInfo,
    fetchSelectedGameServerInfo,
    handleCancelConfirmation
  }
})
