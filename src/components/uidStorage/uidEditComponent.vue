<template>
    <div>
    <el-table ref="tableRef" row-key="date" :data="userGameInfo" style="width: 100%">
    <el-table-column label="索引">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
    <el-table-column
      prop="isMain"
      label="賬號類型"
      :formatter="accountTypeFormatter"
      sortable
      width="110"
      column-key="date"
    />
    <el-table-column prop="server_id" label="服务器" :formatter="serverFormatter" />
    <el-table-column prop="game_uid" label="遊戲UID"  width="100" />
    <el-table-column prop="game_username" label="遊戲暱稱" />
    <el-table-column prop="user_comment" label="留言"  />
    <el-table-column prop="" label="操作" :formatter="formatter" />
    

  </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  userGameInfo: {
    type: Object,
    required: true,
  },
  gameInfo: {
    type: Object,
    required: true,
  },
  serverInfo: {
    type: Object,
    required: true,
  }
})
const accountTypeFormatter = row => {
  if (row.isMain == 1) {
    return '主賬號'
  } else {
    return '小號'
  }
}

const serverFormatter = row => {

  const server = props.serverInfo.find((server) =>  server.server_id == row.server_id);
  // return foundServer.server_name
  return server.server_name
}
console.log(props.serverInfo)
console.log(props.userGameInfo)
console.log(props.gameInfo)



</script>

<style scoped>

</style>