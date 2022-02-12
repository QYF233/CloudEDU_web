<template>
  <div/>
</template>

<script>
import { checkUserToRoom } from '@/api/class'
import store from '@/store'
import { eventBus } from '@/main'

export default {
  name: 'SetRoom',
  data() {
    return {
      roomInfo: {
        uid: store.getters.uid,
        username: store.getters.name,
        classId: [],
        roomId: this.$route.query.roomId,
        roomName: '',
        introduction: '',
        liveUrl: ''
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    // 初始化
    init() {
      // 如果房间已经初始化
      console.log(this.roomInfo.roomId)
      checkUserToRoom(this.roomInfo.roomId, this.roomInfo.uid).then(res => {
        const { roomInfo } = res.data
        this.roomInfo.roomId = roomInfo.id
        this.roomInfo.roomName = roomInfo.roomName
        this.roomInfo.introduction = roomInfo.introduction
        this.roomInfo.liveUrl = roomInfo.liveUrl

        if (res.data.flag) {
          console.log(this.roomInfo)
          eventBus.$emit('setRoom', this.roomInfo)
        } else {
          this.$alert('您没有权限进入此教室', '警告', {
            confirmButtonText: '确定',
            callback: action => {
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.go(-1)
            }
          })
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
