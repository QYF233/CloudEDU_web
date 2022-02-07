<template>
  <el-row :gutter="20">
    <h2>{{ room.roomName }}</h2>
    <p>{{ room.introduction }}</p>
    {{ roomUrl }}
    <el-col :span="18">
      <video id="rtc_media_player" src="" style="width:100%;height:400px" controls autoplay/>
      <div class="btn-group">
        <el-button type="primary" icon="el-icon-phone" circle/>
        <el-button type="success" circle>
          <svg-icon icon-class="hand"/>
        </el-button>
        <div class="btn-group">
          <el-button type="warning" class="btn_publish" @click="startPlay">开始上课</el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
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
          <el-button class="send" size="mini" type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { findRoom, sendMsg } from '@/api/class'

export default {
  name: 'Main',
  data() {
    return {
      myMsg: '',
      liveUrl: undefined,
      socketUrl: undefined,
      room: {
        teacherId: '001',
        teacherName: '张三',
        classId: [],
        roomId: '',
        roomName: '',
        introduction: '',
        state: ''
      },
      roomId: this.$route.query.roomId,
      chatList: []
    }
  },
  watch: {

  },
  created() { // 页面创建生命周期函数
    this.findRoomInfo()
  },
  beforeDestroy() { // 离开页面生命周期函数
    this.websocketclose()
  },
  methods: {
    findRoomInfo() {
      console.log(this.roomId)
      findRoom(this.roomId).then(result => {
        console.log(result.data)
        const { name, note, state, liveUrl, teacherId } = result.data.room
        this.room.roomName = name
        this.room.introduction = note
        this.room.state = state
        this.liveUrl = liveUrl
        this.room.teacherId = teacherId
        this.initWebSocket()
      })
    },
    initWebSocket: function() {
      this.roomUrl = 'ws://127.0.0.1:8080/websocket/' + this.roomId
      var url = this.roomUrl
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
    },
    websocketonopen: function() {
      console.log('WebSocket连接成功')
    },
    websocketonerror: function() {
      console.log('WebSocket连接发生错误')
    },
    websocketonmessage: function(e) {
      console.log(e)
      this.chatList.push(e.data)
    },
    websocketclose: function(e) {
      console.log('connection closed (' + e.code + ')')
    },
    sendMessage() {
      if (this.websock.onopen) {
        if (this.myMsg !== '') {
          this.myMsg = this.myName + '：' + this.myMsg
          sendMsg(this.roomId, this.myMsg).then(res => {
            console.log(res)
            this.myMsg = ''
          }).catch(e => console.log)
          console.log(this.textarea)
        } else {
          this.$message.error('输入内容不能为空')
        }
      } else {
        console.log('您未1连2接')
      }
    },
    // 设置教室信息
    getRoomInfo() {
      // 存储房间信息并向后端申请教室
      // getRoomInfo(this.roomId).then(response => {
      //   this.roomUrl = 'webrtc://localhost/live/' + this.room.roomId
      // }).catch(response => {
      //
      // })
      //
      //
      this.roomUrl = 'webrtc://localhost/live/' + this.room.roomId
      setTimeout(() => {
        this.startPlay()
      }, 1000)
    },
    startPlay() {
      var sdk = null

      // eslint-disable-next-line no-undef
      sdk = new SrsRtcPlayerAsync()

      // eslint-disable-next-line no-undef
      $('#rtc_media_player').prop('srcObject', sdk.stream)

      sdk.play(this.roomUrl).then(function(session) {
        console.log('yes')
      }).catch(function(reason) {
        sdk.close()
        console.error(reason)
      })
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
