<template>
  <div v-if="!editMode" class="displayMode">
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
              <Edit @click="handleEditMode" />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <div class="big_container">
        <div class="account_list">
        <!-- <el-button type="primary" plain>主賬號</el-button> -->
     
    <el-radio-group v-if="userGameInfo?.length > 0" v-model="uidManipulate.selectedAccount" class="account_radio_container">
      <el-radio  :label="0" border class="account_radio"  @change="handleSelectedAccount(mainAccount[0])">主賬號</el-radio>
      <div v-for="(subAccount, index) in subAccounts" :key="index" >
        <el-radio :label="index + 1" border class="account_radio"  @change="handleSelectedAccount(subAccount)" >小號 {{index + 1}}</el-radio>
      </div>
    </el-radio-group>
         <!-- <div v-for="subAccount in subAccounts"></div> -->
      </div>
        <el-divider direction="vertical" />

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
            v-if="!editMode  && uidManipulate.gameUid"
            >{{ uidManipulate.gameUid }}
          </el-button>
          <p
            class="questionmark-text"
            v-if="!editMode  && !uidManipulate.gameUid"
          >
            {{ uidManipulate.gameUid || "???" }}
          </p>
          <el-button
            class="username_btn"
            :data-clipboard-text="uidManipulate.gameUsername"
            @click="copy"
            v-if="!editMode && uidManipulate.gameUsername"
            >{{ uidManipulate.gameUsername }}
          </el-button>
          <p
            class="questionmark-text"
            v-if="!editMode  && !uidManipulate.gameUsername"
          >
            {{ uidManipulate.gameUsername || "???" }}
          </p>
        </div>
      </div> 


    </el-card>
  </div>
  <div v-if="editMode" class="editMode">
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
            <Edit @click="handleEditMode" />
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
        <div class="t-input">
          <el-input
            class=""
            v-model="uidManipulate.gameUid"
            placeholder="输入你的UID"
            clearable
          />
        </div>
    
   
        <div class="t-input">
          <el-input
            class=""
            v-model="uidManipulate.gameUsername"
            placeholder="输入你的昵称,不要那么懒"
            clearable
          />
        </div>
   
      </div>
    </div> 
     <el-radio-group v-model="uidManipulate.isMain"  @change="handleIsMainSelection" class="isMain-Radio">
      <el-radio label="1" size="large"  >主賬號</el-radio>
      <el-radio label="0" size="large" >小號</el-radio>
    </el-radio-group>
    <div class="confirmation-button-container" >
      <el-button
        type="danger"
        plain
        size="large"
        @click="handleUidManipulateCancel"
        >取消</el-button
      >

      <el-button type="primary" plain size="large"  @click="handleSubmit(onSubmit)">确定</el-button>
    </div>

  </el-card>
  </div>
</template>
<script setup lang="ts">

const dummy = [
  {test: 'test'},
  {test: 'test'},
  {test: 'test'},
]
import axios from "axios"
import { ref, reactive, computed, defineProps, onMounted } from "vue"
import { useGameUidStorageStore } from "./../../stores/uidStorage.ts"
import { useUidManipulateStore } from "./../../stores/uidManipulate.ts"
import Clipboard from "clipboard"
import { useForm, defineRule ,ErrorMessage,Form ,Field} from 'vee-validate';
const gameUidStorage = useGameUidStorageStore()
const uidManipulate = useUidManipulateStore()
const userGameInfo = ref()
const gameInfo = ref()
const serverInfo = ref()
const editMode = ref(false)
const mainAccount = ref()
const subAccounts = ref()
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
const handleSelectedAccount = (account) => {
  console.log(account)
    const selectedAccount_user = userGameInfo.value.find(
    (user) => user.game_uid == account.game_uid
  )
  console.log(selectedAccount_user)
  if(selectedAccount_user){
      uidManipulate.passAndSetUidInfo(selectedAccount_user)
      serverInfo.value.forEach((server) => (server.loading = false))
      serverInfo.value.find((s) => s.server_id == account.server_id).loading = true

  }
    console.log(`handleAccountSelection ${uidManipulate.selectedAccount}`);
}
const handleSelectServer = (server) => {
  // 重置所有selected的状态
  serverInfo.value.forEach((server) => (server.loading = false))
  serverInfo.value.find((s) => s.server_id == server.server_id).loading = true
  console.log(`xcheck now userGameInfo.value: ${userGameInfo.value}`)
  console.log(userGameInfo.value)
  const selectedServer_user = userGameInfo.value.find(
    (s) => s.server_id == server.server_id
  )
  const test = userGameInfo.value.filter(
    (s) => s.server_id == server.server_id
  )
  const selectedServer_userIndex = userGameInfo.value.findIndex((s) => s.server_id == server.server_id);
  console.log(selectedServer_userIndex) 
  uidManipulate.selectedAccount = selectedServer_userIndex
  console.log("selectedServer:", selectedServer_user)
  console.log("什麼鬼為什麼沒有")
  // console.log(selectedServer_user)
  console.log(test)
  uidManipulate.passAndSetUidInfo(selectedServer_user)

}

const handleEditMode = () => {
  console.log("handleUidEdit")
  editMode.value = !editMode.value
  // 返回display模式时候还原数据
  if(!editMode.value){
    uidManipulate.restoreUidValue()
  }
}

const handleIsMainSelection = () => {
    console.log(`handleIsMainRadio ${uidManipulate.isMain}`);
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
      editMode.value = false
      uidManipulate.restoreUidValue()
    }
  } else {
    console.log("tempUidAA is empty")
    editMode.value = false
  }
}
const startingFunc = async () => {
  console.log("===============START HERE===================1")
  gameInfo.value = await gameUidStorage.fetchGameInfo()
  console.log("===============START HERE===================2")
  serverInfo.value = await gameUidStorage.fetchSelectedGameServerInfo()
  console.log("===============START HERE===================3")

  userGameInfo.value = await gameUidStorage.fetchUserGameInfo()
  console.log("===============START HERE===================4")

  const hasMain = userGameInfo.value.some((s) => s.isMain == 1)
  mainAccount.value = userGameInfo.value.filter((s) => s.isMain == 1)
  subAccounts.value = userGameInfo.value.filter((s) => s.isMain == 0)
  console.log("===============START HERE===================5")
  console.log(userGameInfo.value)
  console.log(mainAccount.value)
  console.log(subAccounts.value)
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
 const { defineField, handleSubmit, resetForm, values, errors } = useForm();
const onSubmit = () => {
  if (!errors.value.$anyError) {
    // 表单验证通过，执行提交逻辑
    console.log('提交表单');
  }
};
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

.account_radio_container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.account_radio {
  margin : 2px
}
</style>
