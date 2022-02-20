<template>
  <!--  <el-col :span="6">-->
  <div class="comment">
    <div class="comment-area">
      <p v-for="i in chatList" :key="i.index">{{ i }}</p>
    </div>
    <div class="send-area">
      <el-input
        v-model="myMsg"
        type="input"
        :rows="2"
        placeholder="请输入内容"
        class="send-message"
        show-word-limit
        maxlength="20"
        resize="none"
        @keyup.enter.native="sendMessage"
      />
      <el-button class="send" round size="mini" type="success" @click="sendMessage">发送</el-button>
    </div>
  </div>
  <!--  </el-col>-->

</template>

<script>
import { getAllClassesOption, getSocketUrl, sendMsg, setRoomInfo } from '@/api/class'
import store from '@/store'
import { eventBus } from '@/main'

export default {
  name: 'Socket',
  data() {
    return {
      roomInfo: {
        uid: store.getters.uid,
        username: store.getters.name,
        classId: [],
        roomId: '',
        roomName: '',
        introduction: '',
        liveUrl: ''
      },
      myMsg: '',
      props: { multiple: true },
      options: [],
      liveUrl: '',
      socketUrl: '',
      roomId: '',
      liveState: '开始录制',
      publishState: '开始直播',
      chatList: [],
      state: false,
      linkSocket: false
    }
  },
  created() {
    // 教室信息
    eventBus.$on('setRoom', (roomInfo) => {
      this.socketUrl = roomInfo.socketUrl
      this.roomInfo = roomInfo
      // console.log(roomInfo)
      this.initWebSocket()
    })
  },
  methods: {
    initWebSocket: function() {
      if (this.roomInfo.roomId !== '') {
        getSocketUrl(this.roomInfo.roomId).then(res => {
          this.socketUrl = res.data.socketUrl
          const url = this.socketUrl
          store.dispatch('roomInfo/setSocketUrl', this.socketUrl)
          // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
          this.websock = new WebSocket(url)
          this.websock.onopen = this.websocketonopen
          this.websock.onerror = this.websocketonerror
          this.websock.onmessage = this.websocketonmessage
          this.websock.onclose = this.websocketclose
        })
      }
    },
    websocketonopen: function() {
      console.log('WebSocket连接成功')
      this.myMsg = '您已加入直播间'
      sendMsg(this.roomInfo.roomId, this.myMsg).then(res => {
        // console.log(res)
        this.myMsg = ''
      }).catch(e => console.log)
      // console.log(this.textarea)
      this.liveState = '停止直播'
      this.state = true
      eventBus.$emit('socketState', true)
    },
    websocketonerror: function() {
      this.state = false
      console.log('WebSocket连接发生错误')
      eventBus.$emit('socketState', false)
    },
    websocketonmessage: function(e) {
      this.chatList.push(e.data)
      // console.log(e.data)
    },
    websocketclose: function(e) {
      this.state = false
      this.myMsg = '直播已关闭'
      sendMsg(this.roomInfo.roomId, this.myMsg).then(res => {
        // console.log(res)
        this.myMsg = ''
      }).catch(e => console.log)
      // console.log('连接关闭 (' + e.code + ')')
      eventBus.$emit('socketState', false)
    },
    sendMessage() {
      if (this.state) {
        if (this.myMsg !== '') {
          this.myMsg = this.roomInfo.username + '：' + this.myMsg
          sendMsg(this.roomInfo.roomId, this.myMsg).then(res => {
            // console.log(res)
            this.myMsg = ''
          }).catch(e => console.log)
        } else {
          this.$message.error('输入内容不能为空')
        }
      } else {
        console.log('您未连接')
      }
    }
  }

}
</script>

<style lang="scss" scoped>

::-webkit-scrollbar {
  width: 8px;
}

//滚动条的滑块
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
}

.comment {
  background-color: #a8a6a6;
  //border: 10px solid #9898a4;
  height: 400px;
  width: 100%;

  .comment-area {
    /**修改全局的滚动条*/
    /**滚动条的宽度*/

    width: 100%;
    height: 73%;
    overflow: auto;
    padding: 5px;
  }

  .send-area {

    background-color: #97a8be;
    padding: 8px 8px;
    height: 27%;

    .send-message {
      width: 100%;
      margin-bottom: 5px;
    }

    .send {
      float: right;
    }
  }

}

.btn-group {
  margin-top: 10px;
}
</style>
