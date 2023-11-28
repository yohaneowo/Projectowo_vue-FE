<template>
  <div class="base-container">
    <vueCustomScrollbar
      class="scroll-area"
      :settings="settings"
      @ps-scroll-y="scrollHandle"
    >
      <el-container>
        <el-header>
          <div class="header-container">
            <div class="login-button">
              <p>Login</p>
              <el-avatar
                :size="50"
                :src="circleUrl"
                @click="universal.loginComponentController()"
              />
            </div>
          </div>
        </el-header>
        <div
          class="overlay"
          v-if="gameUidStorage.showSpecificGameUidDisplay"
          @click="closeCard"
        ></div>
        <div class="login-card" v-if="universal.showLoginComponent">
          <login />
        </div>
        <div
          class="specific-game-card"
          v-if="gameUidStorage.showSpecificGameUidDisplay"
        >
          <SpecificGameUidDisplay
            :selectedUserId="gameUidStorage.selectedUserId"
            :selectedGameId="gameUidStorage.selectedGameId"
          />
        </div>

        <el-container>
          <el-aside width="350px"
            ><uidRanking
              v-if="gameUidStorage.showUidRanking"
              @userItemClick="handleUserItemClicked"
            />
          </el-aside>

          <el-main :style="{ width: '1080px' }">
            <router-view
              @userItemClick="handleUserItemClick"
              @gameRankingClick="handleGameRankingClick"
              @gameItemClick="handleGameItemClicked"
            />
          </el-main>
          <el-aside width="350px"
            ><uidRanking
              v-if="gameUidStorage.showUidRanking"
              @userItemClick="handleUserItemClicked"
            />
          </el-aside>
        </el-container>
      </el-container>
    </vueCustomScrollbar>
  </div>
</template>

<script setup>
import vueCustomScrollbar from "vue-custom-scrollbar/src/vue-scrollbar.vue"
import uidRanking from "@/components/uidStorage/uidRanking.vue"
import uidDisplay from "@/components/uidStorage/uidDisplay.vue"
import gameRanking from "@/components/uidStorage/gameRanking.vue"
import specificGameDisplayPlayer from "@/components/uidStorage/specificGamePlayerDisplay.vue"
import SpecificGameUidDisplay from "@/components/uidStorage/specificGameUidDisplay.vue"
import login from "@/components/login.vue"
import { useGameUidStorageStore } from "../stores/uidStorage.ts"
import { useUidManipulateStore } from "../stores/uidManipulate.ts"
import { useUniversalStore } from "../stores/universal.ts"
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import { defineComponent, defineProps, defineEmits } from "vue"
import axios from "axios"
import { ref, reactive } from "vue"
defineEmits(["userItemClick"])
const gameUidStorage = useGameUidStorageStore()
const uidManipulate = useUidManipulateStore()
const universal = useUniversalStore()

const scrollHandle = (evt) => {
  // console.log(evt)
}

const handleGameRankingClick = (game_id) => {
  gameUidStorage.selectedGameId = game_id
  console.log(`game_id: ${game_id}`)
  console.log(
    `showSpecificGameDisplayPlayerXXXXXXXXXXXX: ${showSpecificGameDisplayPlayer.value}`
  )
}
const handleGameItemClicked = (user_id, game_id, show) => {
  gameUidStorage.showSpecificGameUidDisplay = true
  gameUidStorage.selectedGameId = game_id
  gameUidStorage.selectedUserId = user_id

  console.log(`game_id: ${game_id}`)
  console.log(
    `showSpecificGameDisplayPlayerXXXXXXXXXXXX: ${showSpecificGameDisplayPlayer.value}`
  )
}

const handleUserItemClick = (user_id, game_id, show) => {
  // showGameRanking.value = false
  // showUidDisplay.value = true
  console.log("HANDLE User item clicked:", user_id, game_id)
  // gameUidStorage.showSpecificGameUidDisplay = true
  gameUidStorage.selectedUserId = user_id
  gameUidStorage.selectedGameId = game_id
}

const closeCard = async () => {
  // 如果card開著才有要關的必要
  if (gameUidStorage.showSpecificGameUidDisplay == true) {
    console.log(`uidManipulate.tempUid: ${uidManipulate.tempUid}`)
    console.log(`uidManipulate.tempUsername: ${uidManipulate.tempUsername}`)
    console.log(`uidManipulate.gameUid: ${uidManipulate.gameUid}`)
    console.log(`uidManipulate.gameUsername: ${uidManipulate.gameUsername}`)
    // 如果有修改過，就要跳出確認視窗
    console.log("=============================================================")
    uidManipulate.settleInputBug()
    if (
      uidManipulate.tempUid != uidManipulate.gameUid ||
      uidManipulate.tempUsername != uidManipulate.gameUsername
    ) {
     
      const isCancel = await gameUidStorage.handleCancelConfirmation()
      if (isCancel) {
        gameUidStorage.showSpecificGameUidDisplay = false
        uidManipulate.tempUid
          ? (uidManipulate.gameUid = uidManipulate.tempUid)
          : (uidManipulate.gameUid = null)
        uidManipulate.tempUsername
          ? (uidManipulate.gameUsername = uidManipulate.tempUsername)
          : (uidManipulate.gameUsername = null)
        console.log(`FINAL uidManipulate.tempUid: ${uidManipulate.tempUid}`)
        console.log(
          `FINAL uidManipulate.tempUsername: ${uidManipulate.tempUsername}`
        )
        // uidManipulate.gameUid == uidManipulate.tempUid
        // uidManipulate.gameUsername = uidManipulate.tempUsername
      }
    } else {
      gameUidStorage.showSpecificGameUidDisplay = false
    }
  }
}
console.log(universal)
</script>

<style>
.base-container {
  padding: 0 25px;
  height: 100vh;
  width: 100vw;
}

.base-container .scroll-area {
  height: 100%;
  width: 100%;
}
.base-container .header-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}
.login-button {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;

  backdrop-filter: blur(8px); /* 添加模糊效果 */
  opacity: 0.7; /* 调整透明度 */
  background-color: rgba(0, 0, 0, 0.5); /* 添加背景颜色 */
  z-index: 999; /*
确保遮罩层在卡片之上 */
}

.specific-game-card {
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-card {
  z-index: 2000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
</style>
