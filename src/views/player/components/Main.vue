<template>
  <div>
    <el-row :gutter="20">
      <!--视频-->
      <div style="height:450px">
        <video
          id="rtc_media_player"
          ref="video"
          src=""
          style="width:100%;height:400px"
          controls
          autoplay
          muted="muted"
        />
        <!--        {{ infoStatus }}-->
        <Time/>
<!--        {{ publishState }}-->
      </div>
    </el-row>
  </div>
</template>

<script>
import { closeRoom } from '@/api/class'
import { SrsRtcPlayerAsync } from '@/api/srs'
import store from '@/store'
import { eventBus } from '@/main'
import Time from '@/components/Time/Time'

export default {
  name: 'Main',
  components: {
    Time
  },
  data() {
    return {
      roomInfo: {
        uid: store.getters.uid,
        username: store.getters.name,
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
      loading: false,
      // 消息列表
      chatList: [],
      // 房间是否初始化
      infoStatus: false,
      // socket连接状态
      socketState: false,
      // 预加载
      loadState: false,
      // 计时器
      time: '',
      resolution: '',
      sdk: undefined,

      // videos
      myVideo: {},

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
    }
  },
  async created() {
    // 教室信息
    eventBus.$on('setRoom', (roomInfo) => {
      this.roomInfo = roomInfo
      // console.log(this.roomInfo)
      this.startPlayer(roomInfo.liveUrl)
    })
  },
  mounted() {
    this.myVideo = this.$refs.video
  },
  destroyed() {
  },
  methods: {

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
    startPlayer(url) {
      const _this = this
      this.sdk = new SrsRtcPlayerAsync()
      this.sdk.constraints = this.constraints
      // console.log(url)

      this.sdk.play(url).then(function(session) {
        _this.myVideo.srcObject = _this.sdk.stream
        // console.error(session)
      }).catch(function(reason) {
        // _this.sdk.close()
        _this.$message.info('当前教室未开播')
        console.error(reason)
      })
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
