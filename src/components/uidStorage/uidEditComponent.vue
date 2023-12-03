<template>
    <div>
      <el-form  :model="uidManipulate.userGameInfo"  :rules="validationRules">
          <el-table  row-key="index" :data="uidManipulate.userGameInfo" style="width: 100%" >
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
          >
            <template #default="{row, $index}">
              <div v-show="editTableIndex != $index" style="display: flex">
                  <span v-show="row.isMain == 1">主賬號</span>
                  <span v-show="row.isMain == 0">小號</span>
              </div>
              <el-form-item :prop="`[${$index}].isMain`"  :rules="validationRules.isMain" >
                <el-radio-group v-show="editTableIndex == $index" v-model="uidManipulate.userGameInfo[$index].isMain"  @change="" class="isMain-Radio" >
                  <el-radio label="1" size="large"  >主賬號</el-radio>
                  <el-radio label="0" size="large" >小號</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="server_id" label="服务器" :formatter="serverFormatter"  width="150">
            <template #default="{ row, $index }">
              <span  v-show="editTableIndex != $index">{{ serverFormatter(row) }}</span>
              <div v-show="editTableIndex == $index" >
              <el-form-item :prop="`[${$index}].server_id`"  :rules="validationRules.server_id" > 
                <el-select v-model="uidManipulate.userGameInfo[$index].server_id" placeholder="選擇服務器" aria-label="kakaka">
                  <el-option
                    v-for="server in uidManipulate.serverInfo"
                    :key="server.server_id"
                    :label="server.server_name"
                    :value="server.server_id"
                  ></el-option>
                </el-select>
              </el-form-item> 
              </div>
            </template>
          </el-table-column>
            <el-table-column  label="遊戲UID"  width="150" >
              <template #default="{ row, $index }">
                <span v-show="editTableIndex != $index">{{ row.game_uid }}</span>
                 <el-form-item :prop="`[${$index}].game_uid`"  :rules="validationRules.game_uid" >
                  <div v-show="editTableIndex == $index" >
                    <el-input  v-model="uidManipulate.userGameInfo[$index].game_uid" placeholder="Please input" clearable />
                  </div>
                </el-form-item>
                
              </template>
            </el-table-column>
          <el-table-column  label="遊戲暱稱">
        
          </el-table-column >
          <el-table-column prop="user_comment" label="留言"  ></el-table-column>
          <el-table-column label="操作"  width="120">
            <template #default="{ row, $index }">
              <div v-show="editTableIndex != $index" style="display: flex">
                <el-button type="primary" size="small" plain @click="handleEditRow(row, $index)">編輯</el-button>
                <el-button type="danger" size="small" plain @click="handleDeleteRow(row)">刪除</el-button>
              </div>
              <div v-show="editTableIndex == $index" style="display: flex">
                <el-button type="success" size="small" plain @click="handleSaveRow(row)">保存</el-button>
                <el-button type="danger" size="small" plain @click="handleCancel(row)">取消</el-button>
              </div>
            </template>
          </el-table-column>
          

        </el-table>
      </el-form>
    </div>
</template>

<script setup lang="ts">
import { useUidManipulateStore } from "./../../stores/uidManipulate.ts"
const uidManipulate = useUidManipulateStore()
import { column } from 'element-plus/es/components/table-v2/src/common.mjs';
import { ref , reactive} from 'vue'
const editTableIndex = ref<number | null>(null)

const test2 =(x) => {
  console.log(x)

}
const test = (a,b) => {
  console.log(typeof a)
  console.log(a)
  console.log(typeof b)
  console.log(b)
}
const modal = ref({
  userGameInfo: [{
    user_id: 1231,
    server_id: 1,
    game_id: 1,
    game_uid: 1231223,
    game_username: 'asdas',
    isMain: 1,
    user_comment: null,
  }]
})


const validationRules = {
  isMain: [
    { required: true, message: '請選擇賬號類型', trigger: 'blur' },
  ],
  server_id: [
    { required: true, message: '請選擇服務器', trigger: 'change' },
  ],
  game_uid: [
    { required: true, message: '請輸入遊戲UID', trigger: 'change' },
  ],
  game_username: [
    { required: true, message: '請輸入遊戲暱稱', trigger: 'blur' },
  ],
  user_comment: [
    { required: true, message: '請輸入留言', trigger: 'blur' },
  ],
}


const accountTypeFormatter = row => {
  if (row.isMain == 1) {
    return '主賬號'
  } else {
    return '小號'
  }
}
const handleIsMain_EditMode = () => {

}
const serverFormatter = row => {
  // console.log(row.server_id)
  // console.log(typeof row.server_id)
  // console.log(typeof uidManipulate.serverInfo.find((server) =>  server.server_id == row.server_id).server_id)
  const server = uidManipulate.serverInfo.find((server) =>  server.server_id == row.server_id);
  return server.server_name
}

const handleEditRow = (row, index)=> {
  editTableIndex.value = index
  console.log(row)
  // console.log(index)
}

const handleDeleteRow = row => {
  console.log(row)
}

const handleSaveRow = row => {
  console.log(row)
}

const handleCancel = row => {
  editTableIndex.value = null
  console.log(row)
}

console.log(uidManipulate.serverInfo)
console.log( uidManipulate.userGameInfo)
console.log(uidManipulate.gameInfo)



</script>

<style scoped>

</style>