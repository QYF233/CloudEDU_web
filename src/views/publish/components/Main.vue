<template>
  <div>
    <el-row :gutter="20">
      <!--视频-->
      <video id="rtc_media_player" ref="video" src="" style="width:100%;height:400px" controls autoplay/>
      {{ infoStatus }}
      <!--设置-->
      <el-form :inline="true" class="videoSettings">
        <el-form-item label="分辨率">
          <el-select v-model="resolution" placeholder="请选择分辨率">
            <el-option v-for="(item,index) in resolutionOptions" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="麦克风">
          <el-select id="audioSource" v-model="audioDeviceId" placeholder="请选择麦克风">
            <el-option v-for="(item,index) in audioSourceOption" :key="index" :value="item.value" :label="item.text"/>
          </el-select>
        </el-form-item>
        <el-form-item label="视频源">
          <el-select id="videoSource" v-model="videoDeviceId" placeholder="请选择视频源">
            <el-option v-for="(item,index) in videoSourceOption" :key="index" :value="item.value" :label="item.text"/>
          </el-select>
        </el-form-item>
      </el-form>
      <!--开始直播-->
      <div class="btn-group">
        <el-button type="info" plain class="btn_publish" @click="startCapture">屏幕共享</el-button>
        <el-button type="success" plain class="btn_publish" @click="videoLoader">打开设备</el-button>
        <el-button :type="liveState ? 'danger' : 'success'" class="btn_publish" @click="startLive">
          {{ liveState ? '停止直播' : '开始直播' }}
        </el-button>
        {{ publishState }}
      </div>
    </el-row>
  </div>
</template>

<script>
import { closeRoom } from '@/api/class'
import { SrsRtcPublisherAsync } from '@/api/srs'
import store from '@/store'
import { eventBus } from '@/main'
import { mapGetters } from 'vuex'

export default {
  name: 'Main',
  data() {
    return {
      roomInfo: {
        teacherId: store.getters.uid,
        teacherName: store.getters.name,
        classId: [],
        roomId: store.getters.roomInfo.roomId,
        roomName: '',
        introduction: '',
        liveUrl: ''
      },
      // liveUrl: '',
      socketUrl: '',
      roomId: '',
      // 是否正在直播
      liveState: false,
      publishState: '',
      // 消息列表
      chatList: [],
      // 房间是否初始化
      infoStatus: false,
      // socket连接状态
      socketState: false,
      // 预加载
      loadState: false,
      resolution: '',
      resolutionOptions: [
        { label: '超清', value: 1920 },
        { label: '高清', value: 1024 },
        { label: '标清', value: 640 }],

      sdk: undefined,

      // videos
      myVideo: {},

      // source
      audioSourceOption: [],
      audioOutputOption: [],
      videoSourceOption: [],

      // 设备id
      audioDeviceId: '',
      videoDeviceId: '',

      // Constraints(媒体约束)
      videoConstraints: '',

      // record
      recordBtnText: 'start record',
      recordPlayFlag: false,
      downloadRecordFlag: false,

      // Media config
      constraints: {
        audio: {
          deviceId: undefined,
          noiseSuppression: true,
          echoCancellation: true
        },
        video: {
          deviceId: undefined,
          width: { min: 640, max: 1920 }, // 1280
          height: { min: 480, max: 1080 }, // 720
          frameRate: { min: 25, max: 60 },
          facingMode: 'environment'
        }
      },

      // local video stream
      localStream: undefined
    }
  },
  watch: {
    resolution: function(val) {
      this.changeResolution(val)
    },
    audioDeviceId: function() {
      this.checkDevice()
    },
    videoDeviceId: function() {
      this.checkDevice()
    }
  },
  async created() {
    // 获取设备信息
    await this.getDevices()
    // 教室初始化状态
    eventBus.$on('infoStatus', (infoStatus) => {
      this.infoStatus = infoStatus
    })
    // 教室信息
    eventBus.$on('setRoom', (roomInfo) => {
      this.roomInfo = roomInfo
    })
    // 聊天室状态
    eventBus.$on('socketState', (socketState) => {
      this.socketState = socketState
    })
  },
  mounted() {
    this.myVideo = this.$refs.video
    this.roomInfo = store.getters.roomInfo
    if (this.roomInfo.roomId !== '') {
      this.infoStatus = true
    }
    // console.log(this.roomInfo)
  },
  destroyed() {
  },
  methods: {
    // 前期准备：获取设备信息
    getDevices() {
      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log('不支持获取设备信息！')
      } else {
        navigator.mediaDevices.enumerateDevices()
          .then(this.showDevice)
          .catch((err) => {
            console.log(err.name + ':' + err.message)
          })
      }
    },
    // 展示设备信息
    showDevice(deviceInfos) {
      const _this = this
      deviceInfos.forEach(function(deviceinfo) {
        var option = {
          text: deviceinfo.label,
          value: deviceinfo.deviceId
        }
        // console.log(deviceinfo)
        if (deviceinfo.kind === 'audioinput') {
          _this.audioSourceOption.push(option)
        } else if (deviceinfo.kind === 'audiooutput') {
          _this.audioOutputOption.push(option)
        } else if (deviceinfo.kind === 'videoinput') {
          _this.videoSourceOption.push(option)
        }
      })
    },

    // 设置：更改分辨率
    changeResolution(val) {
      if (val === 1920) {
        this.constraints.video.width = 1920
        this.constraints.video.height = 1080
      } else if (val === 1024) {
        this.constraints.video.width = 1024
        this.constraints.video.height = 720
      } else if (val === 640) {
        this.constraints.video.width = 640
        this.constraints.video.height = 480
      }
      console.log('更换分辨率', this.constraints)
      this.checkDevice()
    },

    // 中期：加载视频
    videoLoader() {
      const _this = this
      if (this.checkDevice()) {
        if (this.getUserMedia()) {
          _this.loadState = true
          return true
        }
      }
      return false
    },
    // 开始直播
    startLive() {
      if (this.infoStatus) { // 房间初始化
        eventBus.$emit('linkSocket', true)
        if (this.loadState) {
          this.startPublish()
        } else {
          if (this.videoLoader()) {
            this.startPublish()
          }
        }
      } else {
        this.liveState = false
        this.$message.error('请先初始化教室！')
      }
    },
    // 检查设备
    checkDevice() {
      if (this.audioDeviceId) {
        this.constraints.audio = { deviceId: { exact: this.audioDeviceId } }
      } else {
        this.constraints.audio = false
      }
      if (this.videoDeviceId) {
        this.constraints.video = { deviceId: { exact: this.videoDeviceId } }
      } else {
        this.constraints.video = false
      }
      if (!this.audioDeviceId && !this.videoDeviceId) {
        this.$message({ message: '摄像头和麦克风必须开启一个才能直播', type: 'warning' })
        return false
      } else {
        return true
      }
    },
    // 设置媒体流
    async getUserMedia() {
      if ('mediaDevices' in navigator) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(this.constraints)
          this.myVideo.srcObject = stream
          this.localStream = stream
          return true
        } catch (error) {
          this.$message.error('获取设备失败！')
          return false
        }
      }
    },
    // 推流
    startPublish() {
      const _this = this
      // var sdk = null
      this.sdk = new SrsRtcPublisherAsync()
      this.sdk.constraints = this.constraints
      // console.log(this.roomInfo.liveUrl)
      this.sdk.publish(this.roomInfo.liveUrl).then(function(session) {
        console.log(session)
        _this.publishState = '推流中'
        _this.$message.success('推流中...')
        this.liveState = true
      }).catch(function(reason) {
        _this.sdk.close()
        _this.publishState = '开始推流'
        _this.$message.error('推流失败！')
        console.log(reason)
      })
    },
    stopPublish() {
      this.sdk.close()
      this.liveState = false
      // this.myVideo.srcObject = {}
    },
    // 其他设置
    // 进行屏幕共享
    async startCapture() {
      await this.getDisplayMedia()
      await this.getAudioVideo()
    },
    // 1.获取屏幕流
    async getDisplayMedia() {
      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }

      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }

      // 打开chrome中
      // chrome://flags/#enable-experimental-web-platform-features
      // getDisplayMedia无法同时采集音频
      let captureStream = null
      this.constraints.video.height = 1080
      this.constraints.video.width = 1920
      this.constraints.video.frameRate = 60
      try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(this.constraints)
        if ('srcObject' in this.myVideo) {
          this.myVideo.srcObject = captureStream
        } else {
          // 防止在新的浏览器里使用它，应为它已经不再支持了
          this.myVideo.src = window.URL.createObjectURL(captureStream)
        }
        this.localStream = captureStream
      } catch (err) {
        console.error('Error: ' + err)
      }
      return captureStream
    },
    // 2.拿到音视频轨道
    getAudioVideo() {
      const videoTrack = this.localStream.getVideoTracks()[0]
      const audioTrack = this.localStream.getAudioTracks()
      console.log(videoTrack)
      console.log(audioTrack)
      const videoConstraintsData = videoTrack.getSettings()
      // console.log(videoConstraintsData)
      this.videoConstraints = JSON.stringify(videoConstraintsData, null, 4)
      // console.log(this.videoConstraints)
    },

    // 关闭房间
    closeRoom() {
      closeRoom(this.roomId).then(res => {
        console.log(res)
      }).catch(res => {
        console.log(res)
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

.videoSettings {
  margin-top: 20px;
}

.btn-group {
  text-align: right;
}
</style>
