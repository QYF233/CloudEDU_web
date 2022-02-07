<template>
  <el-row :gutter="20">
    <el-col :span="20" :offset="2" class="result">
      <div class="title">{{ status }}</div>
      <el-row :gutter="20">
        <el-col v-for="n in joinRoomList" :key="n.index" :span="6">
          <el-card :body-style="{ padding: '0px' }" class="room" @click.native="goRoom(n.id)">
            <el-image
              class="image"
              :src="url"
              fit="cover"
            />
            <div class="card-body">
              <span class="room-name">{{ n.name }}</span>
              <p class="description">{{ n.note }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>

  </el-row>
</template>

<script>
import store from '@/store'
import { findJoinRoom, fndCreateRoom } from '@/api/user'

export default {
  name: 'Main',
  data() {
    return {
      textarea: '',
      searchVal: '',
      url: require('@/assets/images/cloudedu.png'),
      uid: store.getters.uid,
      joinRoomList: [],
      status: ''
    }
  },
  watch: {
    '$route'(to, from) {

    }
  },
  created() {
    if (store.getters.roles[0] === 'teacher' || store.getters.roles[0] === 'admin') {
      this.findCreateRoom()
    } else {
      this.findJoinRoom()
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        name: '/index'
      })
    },
    goRoom(n) {
      this.$router.push({
        path: '/player',
        query: {
          roomId: n
        }
      })
    },
    findJoinRoom() {
      this.status = '我加入的直播'
      findJoinRoom(this.uid).then(res => {
        this.joinRoomList = res.data.joinRoomList
        console.log(this.joinRoomList)
      }).catch(res => {
        console.error(res)
      })
    },
    findCreateRoom() {
      this.status = '我创建的直播'
      fndCreateRoom(this.uid).then(res => {
        this.joinRoomList = res.data.joinRoomList
        console.log(this.joinRoomList)
      }).catch(res => {
        console.error(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.result {
  .room {
    height: 150px;
    margin: 20px 0;
    overflow: hidden;
    cursor: pointer;
  }

  .image {
    height: 80px;
    width: 100%;
  }

  .title {
    border-bottom: 5px solid #0fa784;
    padding: 10px;
    display: inline-block;
    font-size: 20px;
  }
}

.card-body {
  padding: 10px 20px;
  .room-name {
    display: inline;
    width: 100%;
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  .description {
    padding-left: 1px;
    font-size: 8px;
    color: #909399;
  }

}

</style>
