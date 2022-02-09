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

export default {
  name: 'Socket',
  data() {
    return {
      dialogFormVisible: false,
      form: {
        teacherId: store.getters.uid,
        teacherName: store.getters.name,
        classId: [],
        roomId: '',
        roomName: '',
        introduction: ''
      },
      formLabelWidth: '100px',
      myMsg: '',
      props: { multiple: true },
      options: [],
      liveUrl: '',
      socketUrl: '',
      roomId: '',
      liveState: '开始录制',
      publishState: '开始直播',
      chatList: []
    }
  },
  watch: {
    resolution: function(val) {
      this.changeResolution(val)
    }
  },
  created() {
    this.dialogFormVisible = true
    this.init()
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  methods: {
    // 初始化
    init() {
      // 获取班级列表
      getAllClassesOption().then(response => {
        // console.log(response.data)
        this.options = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 设置教室信息
    setRoomInfo() {
      // 处理班级信息
      var classList = []
      this.form.classId.forEach(function(value) {
        classList.push(value[2])
      })
      this.form.classId = classList.toString()
      // 存储房间信息并向后端申请教室
      setRoomInfo(this.form).then(response => {
        console.log(response)
        this.liveUrl = response.data.liveUrl
        this.roomId = response.data.roomId
      }).catch(response => {
        console.log(response)
      })

      // this.liveUrl = 'webrtc://localhost/live/' + this.form.roomId

      this.dialogFormVisible = false
    },
    startLive() {
      this.initWebSocket()
      // if (this.liveState) {
      //   this.getVideo()
      // }
    },
    initWebSocket: function() {
      getSocketUrl(this.roomId).then(res => {
        this.socketUrl = res.data.socketUrl
        console.log(this.socketUrl)
        var url = this.socketUrl
        console.log(url)
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        this.websock = new WebSocket(url)
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      })
      // this.socketUrl = 'ws://127.0.0.1:8088/websocket/' + this.roomId
    },
    websocketonopen: function() {
      console.log('WebSocket连接成功')
      this.liveState = '停止直播'
      this.getVideo()
    },
    websocketonerror: function() {
      console.log('WebSocket连接发生错误')
      this.liveState = false
    },
    websocketonmessage: function(e) {
      console.log(e)
      this.chatList.push(e.data)
    },
    websocketclose: function(e) {
      this.liveState = false
      console.log('连接关闭 (' + e.code + ')')
    },
    sendMessage() {
      if (this.websock.onopen) {
        if (this.myMsg !== '') {
          this.myMsg = this.form.teacherName + '：' + this.myMsg
          sendMsg(this.roomId, this.myMsg).then(res => {
            console.log(res)
            this.myMsg = ''
          }).catch(e => console.log)
          console.log(this.textarea)
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
