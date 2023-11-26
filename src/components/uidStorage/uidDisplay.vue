divdiv
<template>
  <div class="container">
    <p>UID展示</p>
    <div
      class="overlay"
      v-if="showSpecificGameUidDisplay"
      @click="closeCard"
    ></div>
    <div v-for="game in miscList" class="gameIconContainer">
      <el-avatar
        shape="square"
        :key="game.game_id"
        :size="80"
        :src="`/src/assets/game_icons/${game.game_id}/${game.game_id}.jpg`"
        class="game-icon"
      />
      <p class="player_count">{{ game.player_count }}</p>
    </div>

    <div class="specific-game-card" v-if="showSpecificGameUidDisplay">
      <SpecificGameUidDisplay
        :selectedUserId="selectedUserId"
        :selectedGameId="selectedGameId"
        :selectedServerTypeId="selectedServerTypeId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SpecificGameUidDisplay from "@/components/uidStorage/specificGameUidDisplay.vue"

import { ref, reactive, computed, defineProps } from "vue"
import axios from "axios"
const serverList = reactive([])
const miscList = reactive([])
const activeNames = ref<string[]>(["1"])
const locked_gameList = reactive([])
const dead_gameList = reactive([])
const selectedGameId = ref("")
const selectedServerTypeId = ref("")
let showSpecificGameUidDisplay = ref(false)

const props = defineProps({
  selectedUserId: {
    type: String,
    required: true
  }
})
const selectedUserId = ref(props.selectedUserId)

console.log("Selected user ID here <:", props.selectedUserId)
const setShowSpecificGameUidDisplay = (game, serverType_Id) => {
  showSpecificGameUidDisplay.value = true

  selectedGameId.value = game.game_id.toString()
  selectedServerTypeId.value = serverType_Id.toString()
}
const handleChange = (val: string[]) => {
  console.log(val)
}
const isDeadGame = (gameId, serverId) => {
  return dead_gameList.some(
    (item) => item.game_id == gameId && item.server_id == serverId
  )
}

const fetchLockedGameList = () => {
  axios
    .get("http://localhost:3366/api/get-Locked_gameList")
    .then((response) => {
      locked_gameList.splice(0, locked_gameList.length, ...response.data)
      console.log("Locked game list:", locked_gameList)
    })
}
const fetchDead_gameList = () => {
  axios.get("http://localhost:3366/api/get-Dead_gameList").then((response) => {
    dead_gameList.splice(0, dead_gameList.length, ...response.data)
    console.log("Dead game list:", dead_gameList)
  })
}

const fetchServerList = () => {
  axios.get("http://localhost:3366/api/get-serverList").then((response) => {
    serverList.splice(0, serverList.length, ...response.data)
    console.log("Server list:", serverList)
  })
}

const fetchGameList = () => {
  axios.get("http://localhost:3366/api/get-gameList").then((response) => {
    miscList.splice(0, miscList.length, ...response.data)

    console.log("Game list:", miscList)
  })
}

fetchServerList()
fetchGameList()
fetchLockedGameList()
fetchDead_gameList()

const specialList = computed(() => {
  // 根据游戏的game_id进行筛选
  const allowedGameIds = [1, 2, 3] // 只显示游戏ID为1、2和3的图标
  const filteredGames = miscList.filter((game) =>
    allowedGameIds.includes(game.game_id)
  )
  console.log("Filtered games: asasas", filteredGames)

  return filteredGames
})

const gameList = computed(() => {
  // 根据游戏的game_id进行筛选
  const excludedGameIds = [1, 2, 3] // 不显示游戏ID为1、2和3的图标

  return filterAndMapGames(miscList, excludedGameIds)
})
const seriesList = computed(() => {
  // 根据系列属性将游戏分组
  const seriesMap = new Map<number, { series_id: number; games: any[] }>()

  for (const game of gameList.value) {
    if (seriesMap.has(game.series_id)) {
      seriesMap.get(game.series_id)?.games.push(game)
    } else {
      seriesMap.set(game.series_id, {
        series_id: game.series_id,
        games: [game]
      })
    }
  }

  return Array.from(seriesMap.values())
})
const filterAndMapGames = (games, excludedGameIds) => {
  return games.filter((game) => !excludedGameIds.includes(game.game_id))
}
console.log("Game list: LAST", miscList)

const closeCard = () => {
  if (showSpecificGameUidDisplay.value == true) {
    showSpecificGameUidDisplay.value = false
  }
}
</script>
<style>
body {
  margin: 0;
  padding: 0;
}

/* 在这里添加样式 */
.el-collapse-item__header {
  color: white;
  background-color: transparent;
  border-color: transparent;
  width: 100vh;
  margin: 0 auto;
}

.el-collapse-item__content {
  background-color: #34343c;
  border-color: transparent;
  width: 100vh;
  margin: 0 auto;
}
.game-icon {
  margin: 5px;
}
.lock-icon {
  position: absolute;
  margin: 5px;
  background-color: transparent;
  top: 0;
  left: 0;
}

.gameIconContainer {
  position: relative;
  display: inline-block;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(8px); /* 添加模糊效果 */
  opacity: 0.7; /* 调整透明度 */
  background-color: rgba(0, 0, 0, 0.5); /* 添加背景颜色 */
  z-index: 999; /*
确保遮罩层在卡片之上 */
}
</style>
