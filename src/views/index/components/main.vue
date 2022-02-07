<template>
  <div>
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ status }}</span>
          </div>
          <div class="box">
            <div v-for="n in joinRoomList.slice(0, 4)" :key="n.index" class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">{{ n.name }}</div>
            </div>
          </div>
          <div v-show="more" class="bottom clearfix">
            <router-link to="/find-room">
              <el-button type="text" class="button">查看更多</el-button>
            </router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>公开课</span>
          </div>
          <div class="box">
            <div class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">文字说明</div>
            </div>
            <div class="classBox">
              <el-image
                :src="url"
                fit="cover"
              />
              <div class="classTitle">文字说明</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from '@/store'
import { findJoinRoom, fndCreateRoom } from '@/api/user'

export default {
  data() {
    return {
      url: require('@/assets/images/cloudedu.png'),
      joinRoomList: [],
      status: '',
      more: false
    }
  },
  created() {
    this.findRoom()
  },
  methods: {
    findRoom() {
      if (store.getters.roles[0] === 'teacher' || store.getters.roles[0] === 'admin') {
        this.status = '我创建的教室'
        fndCreateRoom(store.getters.uid).then(res => {
          this.setRoomList(res)
        })
      } else {
        this.status = '我加入的教室'
        findJoinRoom(store.getters.uid).then(res => {
          this.setRoomList(res)
        })
      }
    },
    setRoomList(res) {
      this.joinRoomList = res.data.joinRoomList
      console.log(this.joinRoomList.length)
      if (this.joinRoomList.length > 4) {
        this.more = true
      } else {
        this.more = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin-bottom: 10px;

  .classBox {
    display: inline-block;
    text-align: center;
    height: 100px;
    width: 50%;

    .el-image {
      height: 100px;
      width: 65%;
    }

    .classTitle {
      font-size: 15px;
    }
  }
}

.bottom {

  text-align: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
