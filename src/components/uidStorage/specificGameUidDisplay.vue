<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-avatar
          class="game-icon"
          shape="square"
          :size="75"
          :src="`/src/assets/game_icons/${gameUidStorage.selectedGameId}/${gameUidStorage.selectedGameId}.png`"
        ></el-avatar>

        <span class="game-title">{{ gameNameTW }}</span>
        <el-tooltip
          class="edit-tooltip"
          effect="dark"
          content="这里可以修改你的东东"
          placement="top"
        >
          <el-icon :size="20">
            <Edit @click="handleUidEdit" />
          </el-icon>
        </el-tooltip>
      </div>
    </template>
    <div class="big_container">
      <div class="serverDisplay">
        <div v-for="server in serverInfo">
          <el-button
            type="primary"
            class="server_choser"
            :loading="server.loading"
            :plain="!server.loading"
            @click="handleSelectServer(server)"
            >{{ server.server_name }}</el-button
          >
        </div>
      </div>
      <el-divider direction="vertical" />

      <div class="container_1">
        <p>UID:</p>
        <p>昵称:</p>
      </div>
      <div class="container_2">
        <el-button
          class="text_btn"
          :data-clipboard-text="uidManipulate.gameUid"
          @click="copy"
          v-if="showUid == true && uidManipulate.gameUid"
          >{{ uidManipulate.gameUid }}
        </el-button>
        <div class="t-input">
          <el-input
            class=""
            v-if="editUid == true"
            v-model="uidManipulate.gameUid"
            placeholder="输入你的UID"
            clearable
          />
        </div>
        <p
          class="questionmark-text"
          v-if="showUid == true && !uidManipulate.gameUid"
        >
          {{ uidManipulate.gameUid || "???" }}
        </p>

        <el-button
          class="username_btn"
          :data-clipboard-text="uidManipulate.gameUsername"
          @click="copy"
          v-if="showUid == true && uidManipulate.gameUsername"
          >{{ uidManipulate.gameUsername }}
        </el-button>
        <div class="t-input">
          <el-input
            class=""
            v-if="editUid == true"
            v-model="uidManipulate.gameUsername"
            placeholder="输入你的昵称,不要那么懒"
            clearable
          />
        </div>
        <p
          class="questionmark-text"
          v-if="showUid == true && !uidManipulate.gameUsername"
        >
          {{ uidManipulate.gameUsername || "???" }}
        </p>
      </div>
    </div>
    <div class="confirmation-button-container" v-if="editUid == true">
      <el-button
        type="danger"
        plain
        size="large"
        @click="handleUidManipulateCancel"
        >取消</el-button
      >

      <el-button type="primary" plain size="large">确定</el-button>
    </div>

    <div class="username-container"></div>
  </el-card>
</template>
<script setup lang="ts">
import axios from "axios"
import { ref, reactive, computed, defineProps, onMounted } from "vue"
import { useGameUidStorageStore } from "./../../stores/uidStorage.ts"
import { useUidManipulateStore } from "./../../stores/uidManipulate.ts"
import Clipboard from "clipboard"

const gameUidStorage = useGameUidStorageStore()
const uidManipulate = useUidManipulateStore()
const userGameInfo = ref()
const gameInfo = ref()
const serverInfo = ref()
const showUid = ref(true)
const editUid = ref(false)

const copy = () => {
  const clipboard = new Clipboard(".text")
  clipboard.on("success", (e) => {
    // 释放内存
    clipboard.destroy()
  })
  clipboard.on("error", (e) => {
    // 不支持复制
    Message({
      message: "该浏览器不支持自动复制",
      type: "warning"
    })
    // 释放内存
    clipboard.destroy()
  })
}

const gameNameTW = computed(() => {
  if (gameInfo.value && gameInfo.value.length > 0) {
    return gameInfo.value[0]["gameName_zh-TW"]
  }
  return ""
})

const handleSelectServer = (server) => {
  // 重置所有selected的状态
  serverInfo.value.forEach((server) => (server.loading = false))
  serverInfo.value.find((s) => s.server_id == server.server_id).loading = true
  const selectedServer = userGameInfo.value.find(
    (s) => s.server_id == server.server_id
  )
  console.log("什麼鬼為什麼沒有")
  if (selectedServer) {
    console.log("草")

    uidManipulate.tempUid = selectedServer["game_uid"]
    uidManipulate.tempUsername = selectedServer["game_username"]
    // uidManipulate.gameUid = uidManipulate.gameUid
    //   ? (uidManipulate.gameUid = selectedServer["game_uid"])
    //   : null
    // uidManipulate.gameUsername = uidManipulate.gameUsername
    //   ? (uidManipulate.gameUsername = selectedServer["game_username"])
    //   : null
    uidManipulate.gameUid = selectedServer["game_uid"]
    uidManipulate.gameUsername = selectedServer["game_username"]
    console.log(`CHECK USER 888 ${selectedServer["game_uid"]}`)
    console.log(`CHECK USER 888 ${selectedServer["game_username"]}`)
    console.log("HERE uidManipulate.gameUid:", uidManipulate.gameUid)
    console.log("HERE uidManipulate.gameUsername:", uidManipulate.gameUsername)
  } else {
    console.log("真的没有吧我草")
    // console.log(`CHECK USER 888 ${selectedServer["game_uid"]}`)
    // console.log(`CHECK USER 888 ${selectedServer["game_username"]}`)
    // console.log("HERE uidManipulate.gameUid:", uidManipulate.gameUid)
    // console.log("HERE uidManipulate.gameUsername:", uidManipulate.gameUsername)
    uidManipulate.gameUid = ""
    uidManipulate.gameUsername = ""
    uidManipulate.tempUid = ""
    uidManipulate.tempUsername = ""
  }
}

const handleUidEdit = () => {
  console.log("handleUidEdit")
  showUid.value = false
  editUid.value = true
}

const handleUidManipulateCancel = async () => {
  uidManipulate.settleInputBug()
  if (
    uidManipulate.gameUid != uidManipulate.tempUid ||
    uidManipulate.gameUsername != uidManipulate.tempUsername
  ) {
    const isCancel = await gameUidStorage.handleCancelConfirmation()
    console.log("isCancel:", isCancel)

    if (isCancel) {
      showUid.value = true
      editUid.value = false
      uidManipulate.restoreUidValue()
    }
  } else {
    console.log("tempUidAA is empty")
    showUid.value = true
    editUid.value = false
  }
}
const startingFunc = async () => {
  console.log("===============START HERE===================")
  gameInfo.value = await gameUidStorage.fetchGameInfo()
  console.log("===============START HERE===================2")
  serverInfo.value = await gameUidStorage.fetchSelectedGameServerInfo()
  console.log("===============START HERE===================3")

  userGameInfo.value = await gameUidStorage.fetchUserGameInfo()
  console.log("===============START HERE===================4")

  const hasMain = userGameInfo.value.some((s) => s.isMain == 1)
  console.log(`hasMain: ${hasMain}`)
  if (hasMain) {
    // 正常来说handleSelectServer只接受server对象,这个是取巧的方法
    handleSelectServer(userGameInfo.value.find((s) => s.isMain == 1))
  } else {
    console.log(uidManipulate)

    console.log("BABABABBABA NANA")
    uidManipulate.resetUidValue()
    console.log(uidManipulate)
    console.log("BABABABBABA NANA2")

    // uidManipulate.gameUsername = null
    // uidManipulate.gameUid = null
    // uidManipulate.tempUid = null
    // uidManipulate.tempUsername = null
  }
  // console.log("===============END HERE===================")
}
onMounted(startingFunc)
</script>

<style scoped>
.card-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.game-icon {
  background-color: transparent;
}
.game-title {
  text-align: center;
  font-size: 20px;
}
.serverDisplay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.server_choser {
  margin: 10px;
}
.big_container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
.container_1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
.container_2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
.container_3 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
.uid-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 5px;
}

.username-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 5px;
}

.questionmark-text {
  margin-left: 10px;
  margin-right: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border: 1px solid #ccc;
}

.confirmation-button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 5px;
}

.box-item {
  font-size: 20px;
  width: 110px;
  margin-top: 10px;
  z-index: 9999;
}
</style>
