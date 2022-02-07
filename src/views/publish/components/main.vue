<template>
  <el-row :gutter="20">
    <p>教室代号：{{ form.roomId }}</p>
    <p>上课教师：{{ form.teacherId }}-{{ form.teacherName }}</p>
    <p>上课班级：{{ form.classId }}</p>
    <p>课程名称：{{ form.roomName }}</p>
    <p>课程介绍：{{ form.introduction }}</p>
    <p>直播地址：{{ liveUrl }}</p>
    <el-col :span="18">
      <video id="rtc_media_player" src="" style="width:100%;height:400px" controls autoplay/>
      Audio: <span id="acodecs"/><br>
      Video: <span id="vcodecs"/>
      <div class="btn-group">
        <el-button type="warning" class="btn_publish" @click="startLive">{{ liveState }}</el-button>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="comment">
        <div class="comment-area">
          <p v-for="i in chatList">{{ i }}</p>
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
          <el-button class="closeRoom" size="mini" type="info" @click="closeRoom">关闭直播间</el-button>
        </div>
      </div>
    </el-col>

    <el-dialog title="上课信息设置" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="上课教师：" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-input v-model="form.teacherName" autocomplete="off" disabled/>
          </el-col>
        </el-form-item>
        <el-form-item label="上课班级：" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-cascader
              v-model="form.classId"
              placeholder="请输入班级名称"
              :options="options"
              :props="{ multiple: true }"
              filterable
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="课程名称：" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-input v-model="form.roomName" autocomplete="off" maxlength="10"/>
          </el-col>
        </el-form-item>
        <el-form-item label="课程介绍：" :label-width="formLabelWidth">
          <el-col :span="18">
            <el-input v-model="form.introduction" autocomplete="off" maxlength="10"/>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoomInfo">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>

</template>

<script>
import { closeRoom, getAllClassesOption, getSocketUrl, sendMsg, setRoomInfo } from '@/api/class'
import store from '@/store'

export default {
  name: 'Main',
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
      liveState: '开始直播',
      chatList: []
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
    },
    // 推流
    getVideo() {
      var sdk = null
      // eslint-disable-next-line no-undef
      sdk = new SrsRtcPublisherAsync()
      // eslint-disable-next-line no-undef
      $('#rtc_media_player').prop('srcObject', sdk.stream)
      // console.log(sdk.stream)
      // this.srcStream = sdk.stream
      sdk.pc.onicegatheringstatechange = function(event) {
        if (sdk.pc.iceGatheringState === 'complete') {
          // eslint-disable-next-line no-undef
          $('#acodecs').html(SrsRtcFormatSenders(sdk.pc.getSenders(), 'audio'))
          // eslint-disable-next-line no-undef
          $('#vcodecs').html(SrsRtcFormatSenders(sdk.pc.getSenders(), 'video'))
        }
      }

      sdk.publish(this.liveUrl).then(function(session) {
        console.log(session)
      }).catch(function(reason) {
        sdk.close()
        console.log('报错')
        console.log(reason)
      })
    },
    closeRoom() {
      closeRoom(this.roomId).then(res => {
        console.log(res)
      }).catch(res => {
        console.log(res)
      })
    },
    beforeunloadHandler() {
      closeRoom(this.roomId).then(res => {
        console.log(res)
      }).catch(res => {
        console.log(res)
      })
    },

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
