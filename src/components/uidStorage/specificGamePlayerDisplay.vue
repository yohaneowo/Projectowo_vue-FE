<template>
  <div class="container">
    <div v-for="player in players" class="player-container">
      <el-avatar
        class="user-avatar"
        :size="75"
        :src="player.avatar_url"
        @click="handleUserItemClicked(player)"
      ></el-avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps, defineEmits } from "vue"
import axios from "axios"
import { useRoute } from "vue-router"
import { useGameUidStorageStore } from "./../../stores/uidStorage.ts"

const gameUidStorage = useGameUidStorageStore()

const emit = defineEmits(["userItemClick"])
const route = useRoute()
const game_id = reactive(route.params.gameId)

const players = ref([])

const fetchPlayers = () => {
  console.log(
    `http://localhost:3366/api/get-gamePlayer?game_id=${route.params.gameId}`
  )
  axios
    .get(
      `http://localhost:3366/api/get-gamePlayer?game_id=${route.params.gameId}`
    )
    .then((res) => {
      console.log("fetchPlayers: ", res.data)
      players.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleUserItemClicked = (user) => {
  gameUidStorage.showSpecificGameUidDisplay = true
  console.log(gameUidStorage.showSpecificGameUidDisplay)
  gameUidStorage.selectedUserId = user.user_id
  gameUidStorage.selectedGameId = game_id
  // emit("userItemClick", user.user_id, game_id, showSpecificGameUidDisplay.value)
}

fetchPlayers()
</script>
<style scoped>
.user-avatar {
  margin: 10px;
}
.container {
  display: flex;
  flex-direction: row;
}

.player-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.el-divider {
  margin: 0px;
  height: 100px;
  justify-content: center;
  vertical-align: text-top;
}

.player-container :hover {
  cursor: pointer;
  background-color: #e6e6e6;
  border-radius: 10px;
  box-shadow: 0 0 10px #e6e6e6;
}
</style>
