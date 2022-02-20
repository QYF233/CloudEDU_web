<template>
  <el-row :gutter="20">
    <el-header>
      <Nav/>
    </el-header>
    <el-col :span="18" :offset="3">
      <el-container>
        <el-main>
          <!--初始化教室-->
          <set-room/>
          <h2>{{ form.roomName }}</h2>
          <el-row :gutter="20">
            <el-col :span="18">
              <!--视频区-->
              <Main/>
            </el-col>
            <el-col :span="6">
              <!--聊天区-->
              <Socket/>
            </el-col>
          </el-row>
          <!--          <Main/>-->
        </el-main>
        <el-footer>
          <el-button v-permission="['teacher','admin']" @click="startPublish">开始直播</el-button>
          <!--          <div class="appendix">-->
          <!--            附件区-->
          <!--          </div>-->
        </el-footer>
      </el-container>
    </el-col>
  </el-row>
</template>

<script>
import Nav from '@/components/Nav'
import Main from './components/Main'
import SetRoom from './components/SetRoom'
import Socket from './components/Socket'
import { eventBus } from '@/main'
import store from '@/store'
import permission from '@/directive/permission'
export default {
  name: 'Player',
  directives: { permission },
  components: {
    Nav,
    Main,
    SetRoom,
    Socket
  },
  data() {
    return {
      form: {
        uid: store.getters.uid,
        username: store.getters.name,
        classId: [],
        roomId: '',
        roomName: '',
        introduction: ''
      }
    }
  },
  created() {
    eventBus.$on('setRoom', (res) => {
      this.form = res
    })
  },
  methods: {
    startPublish() {
      this.$router.push({
        name: 'publish',
        params: {
          roomId: this.$route.query.roomId
        }
      })
    }
  }
}
</script>
<style lang="scss">
/*.el-carousel{*/
/*  margin: 0 40px;*/
/*}*/
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.appendix {
  width: 100%;
  height: 100px;
  line-height: 100px;
  background-color: gray;
  color: white;
  text-align: center;
}
</style>
