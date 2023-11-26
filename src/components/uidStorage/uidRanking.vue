<template>
  <div class="container">
    <h1 class="Title">玩家UID数量 排行榜</h1>

    <!-- <img :src="lol" /> -->
    <div class="top-users">
      <div
        class="avatar-card second-place"
        @click="handleUserItemClicked(users[1]?.user_id)"
      >
        <el-card>
          <el-avatar
            v-if="users[1]?.avatar_url"
            :size="75"
            :src="users[1].avatar_url"
          ></el-avatar>
          <p v-if="users[1]?.global_name">{{ users[1].global_name }}</p>
        </el-card>
      </div>
      <div
        class="avatar-card first-place"
        @click="handleUserItemClicked(users[0]?.user_id)"
      >
        <el-card>
          <el-avatar
            v-if="users[0]?.avatar_url"
            :size="100"
            :src="users[0].avatar_url"
          ></el-avatar>
          <p v-if="users[0]?.global_name">{{ users[0].global_name }}</p>
        </el-card>
      </div>
      <div
        class="avatar-card third-place"
        @click="handleUserItemClicked(users[2]?.user_id)"
      >
        <el-card>
          <el-avatar
            v-if="users[2]?.avatar_url"
            :size="75"
            :src="users[2].avatar_url"
          ></el-avatar>
          <p v-if="users[2]?.global_name">{{ users[2].global_name }}</p>
        </el-card>
      </div>
    </div>

    <div class="item-container">
      <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
        <li
          v-for="user in users"
          :key="user.id"
          class="user-item"
          @click="handleUserItemClicked(user.user_id)"
        >
          <div class="user-item-block">
            <div class="block">
              <el-avatar :size="50" :src="user.avatar_url" />
            </div>
            <div class="block2">
              {{ user.global_name }}
            </div>
            <div class="block3">
              {{ user.count }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div>
      <!-- 显示用户头像和名字的列表 -->

      <!-- 显示错误信息 -->
      <div v-if="error" class="error-message">{{ error }}</div>
      <!-- 显示加载状态 -->
      <div v-if="loading" class="loading-message">Loading...</div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, defineEmits } from "vue"
import { useRoute, useRouter } from "vue-router"
const router = useRouter()
import axios from "axios"
import { ref, reactive } from "vue"
const loading = ref(false)
const error = ref(null)
const emit = defineEmits(["userItemClick"])

const count = ref(0)
const load = () => {
  if (users.length >= 100) {
    return // 如果已加载所有用户，则停止加载
  }
}
console.log(`emit: ${emit}`)
const handleUserItemClicked = (userId) => {
  //
  console.log("User item clicked:", userId)
  router.push({
    name: "PlayerGamesDisplay",
    params: { userId: userId }
  })
}

const users = reactive([])
const scrollHandle = (evt) => {
  console.log(evt)
}

const data = () => {
  return {
    users: []
  }
}

const settings = () => {
  suppressScrollY: false
  suppressScrollX: false
  wheelPropagation: false
}

const fetchUsers = () => {
  axios
    .get("http://localhost:3366/api/get-usersRanking")
    .then((response) => {
      users.splice(0, users.length, ...response.data)
      console.log("Top users:", users)
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      console.error("Failed to fetch top users:", error)
      error.value = "Failed to fetch top users"
      loading.value = false
    })
}
fetchUsers()
</script>

<style scoped>
header {
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
}
footer {
  height: 100px; /*
设置页脚的高度 */
}
.el-card__body {
  padding: 0;
}
.el-card {
  background-color: transparent;
  border-color: transparent;
}
.avatar-card p {
  color: white;
  font-size: 1.24rem;
  text-align: center;
}

.top-users {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.avatar-card :hover {
  cursor: pointer;
}

.infinite-list {
  width: 800px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.item-container {
  display: flex;
  flex-wrap: wrap;

  justify-content: center;
  align-items: flex-start;
}

.user-item {
  border: groove;
  padding: 10px;
  margin-bottom: 10px;
}
.user-item-block {
  display: flex;
}

.user-item-block:hover {
  cursor: pointer;
}

.user-item-block {
  display: flex;
  align-items: center;
}

.block {
  margin-left: 25px;
  margin-right: 25px;
}
.block2 {
  flex-grow: 1;
  font-size: 2rem;
}
.block3 {
  margin-left: auto;
  margin-right: 25px;
  font-size: 2rem;
}
</style>
