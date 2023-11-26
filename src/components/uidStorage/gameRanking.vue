<template>
  <h1 class="Title">遊戲玩家數量 排行榜</h1>
  <div v-for="game in gameRankingData" class="gameIconContainer">
    <el-avatar
      shape="square"
      :key="game.game_id"
      :size="80"
      :src="`/src/assets/game_icons/${game.game_id}/${game.game_id}.png`"
      class="game-icon"
      @click="handleGameItemClicked(game.game_id)"
    />
    <p class="player_count">{{ game.player_count }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps, defineEmits } from "vue"
import { useGameUidStorageStore } from "./../../stores/uidStorage.ts"
const gameUidStorage = useGameUidStorageStore()

import axios from "axios"
const emit = defineEmits(["gameItemClick"])
// const showSpecificGameDisplayPlayer = ref(false)
const gameRankingData = ref([])
const selectedGameId = ref("")

import { useRouter } from "vue-router"

const router = useRouter()
const fetchGameRanking = () => {
  axios
    .get("http://localhost:3366/api/get-gameRanking")
    .then((res) => {
      console.log("fetchGameRanking: ", res.data)
      gameRankingData.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleGameItemClicked = (game_id) => {
  // gameUidStorage.showSpecificGameDisplayPlayer = true
  console.log(`NOW TESTING game_id: ${game_id}`)
  // selectedGameId.value = game_id
  // emit(
  //   "gameRankingClick",
  //   game_id,
  //   gameUidStorage.showSpecificGameDisplayPlayer
  // )
  router.push({
    name: "specificGameDisplayPlayer",
    params: { gameId: game_id }
  })
}
fetchGameRanking()
</script>

<style scoped>
.Title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}
.player_count {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.gameIconContainer {
  background-color: transparent;
  position: relative;
  display: inline-block;
}
.game-icon {
  background-color: transparent;
}

.gameIconContainer:hover {
  cursor: pointer;
  background-color: #e6e6e6;
  border-radius: 10px;
  box-shadow: 0 0 10px #e6e6e6;
}
</style>
