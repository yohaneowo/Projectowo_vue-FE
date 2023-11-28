<template>
  <div class="game-container">
    <p class="title">Ta玩的游戏</p>

    <div class="player-game-container">
      <div class="game-icon-container" v-for="game in userGameList">
        <el-avatar
          shape="square"
          :key="game.game_id"
          :size="80"
          :src="`/src/assets/game_icons/${game.game_id}/${game.game_id}.png`"
          class="game-icon"
          @click="handleGameItemClicked(game.game_id)"
        />
      </div>
    </div>
    <el-divider />
    <p class="title">Ta没玩的游戏</p>
    <div class="player-game-container">
      <div class="game-icon-container" v-for="game in userUnplayedGameList">
        <el-avatar
          shape="square"
          :key="game.game_id"
          :size="80"
          :src="`/src/assets/game_icons/${game.game_id}/${game.game_id}.png`"
          class="game-icon"
          @click="handleGameItemClicked(game.game_id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps, defineEmits, watch } from "vue"
import axios from "axios"
import { useGameUidStorageStore } from "./../../stores/uidStorage.ts"
const gameUidStorage = useGameUidStorageStore()
// 一个是玩家有储存的UID的游戏列表,一个是完整的游戏列表
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router"
const route = useRoute()

const userGameList = ref("")
const userUnplayedGameList = ref("")

const emit = defineEmits(["gameItemClick"])
const fetchPlayerGameList = () => {
  axios
    .get(
      `http://localhost:3366/api/get-userGameList?user_id=${route.params.userId}`
    )
    .then((res) => {
      console.log("fetchuserGameList: AXIOS ", res.data)
      userGameList.value = res.data
      
    })
    .catch((err) => {
      console.log(err)
    })
}

const fetchUnplayedGameList = () => {
  axios
    .get(`http://localhost:3366/api/get-gameList`)
    .then((res) => {
      console.log("fetchAllGameList: AXIOS ", res.data)
      const gameList = res.data
      const filteredGameList = gameList.filter((game) => {
        return !userGameList.value.some(
          (userGame) => userGame.game_id == game.game_id
        )
      })
      userUnplayedGameList.value = filteredGameList
      console.log("userUnplayedGameList: ", userUnplayedGameList.value)
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleGameItemClicked = (game_id) => {
  gameUidStorage.showSpecificGameUidDisplay = true
  gameUidStorage.selectedUserId = route.params.userId.toString()
  gameUidStorage.selectedGameId = game_id
  // emit("gameItemClick", user_id, game_id, showSpecificGameUidDisplay.value)
}
// onBeforeRouteUpdate((to, from, next) => {
//   // 检查路由参数是否发生变化
//   if (to.params.userId !== from.params.userId) {
//     // 路由参数发生变化，执行数据获取函数
//     fetchPlayerGameList()
//     fetchUnplayedGameList()
//   }
//   next()
// })
fetchPlayerGameList()
fetchUnplayedGameList()

watch(
  () => route.params.userId,
  (newId, oldId) => {
    // 对路由变化作出响应...
    fetchPlayerGameList()
    console.log("here")
    console.log(userGameList.value)
    console.log(userUnplayedGameList.value)
    fetchUnplayedGameList()
  }
)
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}
.game-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.player-game-container {
  /* justify-content: center; */

  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.game-icon {
  background-color: transparent;
}

.game-icon-container :hover {
  cursor: pointer;
  background-color: #e6e6e6;
  border-radius: 10px;
  box-shadow: 0 0 10px #e6e6e6;
}
</style>
