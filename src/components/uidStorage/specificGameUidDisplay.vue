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
     
    <el-radio-group v-if="userGameInfo?.length > 0" v-model="uidManipulate.selectAccount_Index" class="account_radio_container">
      <el-radio  :label="0" border class="account_radio"  @change="handleSelectAccount(mainAccount[0])">主賬號</el-radio>
      <div v-for="(subAccount, index) in subAccounts" :key="index" >
        <el-radio :label="index + 1" border class="account_radio"  @change="handleSelectAccount(subAccount)" >小號 {{index + 1}}</el-radio>
        <!-- <div v-if="shouldModify(subAccount)" ></div> -->
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
              :loading="server.button_enable"
              :plain="!server.button_enable"
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
            :loading="server.button_enable"
            :plain="!server.button_enable"
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

const handleSelectAccount = (account) => {
  console.log(`handleSelectAccount: ${account}`)
  uidManipulate.passAndSetUidInfo(account)
  serverInfo.value.forEach((server) => (server.button_enable = false))
  serverInfo.value.find((s) => s.server_id == account.server_id).button_enable = true
  const index = findAccountIndex(account) 
 uidManipulate.selectAccount_Index = index 
}

const handleSelectServer = (server) => {
  serverInfo.value.forEach((server) => (server.button_enable = false))
  serverInfo.value.find((s) => s.server_id == server.server_id).button_enable = true
  const {foundAccount, foundAccount_Index} =  findAccountByGameServer(server)
  uidManipulate.passAndSetUidInfo(foundAccount)
  uidManipulate.selectAccount_Index = foundAccount_Index
}
const findAccountIndex = (entity) => {
   const isMainIndex = userGameInfo.value.findIndex(
    (user) => user.server_id == entity.server_id && entity.isMain == 1
  );
  return isMainIndex != -1 ? isMainIndex : userGameInfo.value.findIndex(
    (user) => user.game_uid == entity.game_uid )
 }

const findAccountByGameServer  = (gameServer) => {
  const findMainAccount  = userGameInfo.value.find(
    (user) => user.server_id == gameServer.server_id && user.isMain == 1
  )
  if(typeof findMainAccount == 'undefined'){
    const findSubAccount  = userGameInfo.value.find(
        (user) => user.server_id == gameServer.server_id 
      )
    // const findSubAccount_Index = userGameInfo.value.findIndex((user) => user.server_id == gameServer.server_id )
    const findSubAccount_Index = findAccountIndex(gameServer)
      return {
        foundAccount: findSubAccount,
        foundAccount_Index: findSubAccount_Index
      }
  } else {
    const findMainAccount_Index = findAccountIndex(gameServer)
      return {
        foundAccount: findMainAccount,
        foundAccount_Index: findMainAccount_Index
      }
  }

}

const handleEditMode = () => {
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
const starter = async () => {
  gameInfo.value = await gameUidStorage.fetchGameInfo()
  serverInfo.value = await gameUidStorage.fetchSelectedGameServerInfo()
  userGameInfo.value = await gameUidStorage.fetchUserGameInfo()
  const hasMain = userGameInfo.value.some((user) => user.isMain == 1)
  mainAccount.value = userGameInfo.value.filter((s) => s.isMain == 1)
  subAccounts.value = userGameInfo.value.filter((s) => s.isMain == 0)
  if (hasMain) {
    handleSelectAccount(userGameInfo.value.find((s) => s.isMain == 1))
  } else {
    uidManipulate.resetUidValue()
  }
}
onMounted(starter)


const onSubmit = () => {
  if (!errors.value.$anyError) {
    // 表单验证通过，执行提交逻辑
    console.log('提交表单');
  }
};

// const shouldModify= (index) =>{
//       // 判断是否需要修改
//     return this.modifiedIndexes.includes(index);
// }
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
