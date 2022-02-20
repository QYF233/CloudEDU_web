<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <h3>初始化教室信息</h3>
        </template>
        <el-form ref="roomInfo" :model="roomInfo" :rules="rules">
          <el-form-item label="上课教师：" :label-width="formLabelWidth">
            <el-col :span="18">
              <el-input v-model="roomInfo.username" autocomplete="off" disabled/>
            </el-col>
          </el-form-item>
          <el-form-item label="上课班级：" :label-width="formLabelWidth" prop="classId">
            <el-col :span="18">
              <el-cascader
                :key="options.index"
                v-model="roomInfo.classId"
                placeholder="请输入班级名称"
                :options="options"
                :props="{ multiple: true }"
                filterable
                clearable
              />
            </el-col>
          </el-form-item>
          <el-form-item label="课程名称：" :label-width="formLabelWidth" prop="roomName">
            <el-col :span="18">
              <el-input v-model="roomInfo.roomName" autocomplete="off" maxlength="15"/>
            </el-col>
          </el-form-item>
          <el-form-item label="课程介绍：" :label-width="formLabelWidth" prop="introduction">
            <el-col :span="18">
              <el-input v-model="roomInfo.introduction" autocomplete="off" maxlength="30"/>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="setRoomInfo('roomInfo')">创建教室</el-button>
            <el-button @click="clean()">清空</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getAllClassesOption, getRoomInfo, setRoomInfo } from '@/api/class'
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
        roomId: '',
        roomName: '',
        introduction: '',
        liveUrl: ''
      },
      options: [],
      formLabelWidth: '100px',
      activeNames: ['1'],
      rules: {
        roomName: [
          { required: true, message: '请输入教室名（课程名）', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '请选择上课班级', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.judge()
  },
  mounted() {
    if (this.roomInfo.roomId !== '' && this.roomInfo.roomId !== undefined) {
      eventBus.$emit('infoStatus', true)
      // console.log('chuandi')
      eventBus.$emit('setRoom', this.roomInfo)
      this.activeNames = []
    }
  },
  methods: {
    judge() {
      var id = this.$route.params.roomId
      // console.log('id:' + id)
      if (id != null) {
        this.roomInfo.roomId = id
        getRoomInfo(id).then(res => {

          var { room } = res.data
          console.log('info:', room)
          this.roomInfo.roomId = room.id
          this.roomInfo.roomName = room.name
          this.roomInfo.introduction = room.note
          this.roomInfo.liveUrl = room.liveUrl
        })
      } else {
        this.init()
      }
    },
    // 初始化
    init() {
      // 如果房间已经初始化
      const room = store.getters.roomInfo
      // console.log(room)
      this.roomInfo.roomId = room.roomId
      this.roomInfo.roomName = room.roomName
      this.roomInfo.introduction = room.introduction
      this.roomInfo.liveUrl = room.liveUrl

      // 获取班级列表
      getAllClassesOption().then(response => {
        this.options = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 初始化教室信息
    setRoomInfo(roomInfo) {
      const _this = this
      this.$refs[roomInfo].validate((valid) => {
        if (valid) {
          // 处理班级信息
          var classList = []
          this.roomInfo.classId.forEach(function(value) {
            classList.push(value[2])
          })
          this.roomInfo.classId = classList.toString()
          // 存储房间信息并向后端申请教室
          setRoomInfo(this.roomInfo).then(response => {
            _this.roomInfo.liveUrl = response.data.liveUrl
            _this.roomInfo.roomId = response.data.roomId
            eventBus.$emit('infoStatus', true)
            eventBus.$emit('setRoom', _this.roomInfo)
            store.dispatch('roomInfo/setRoomInfo', this.roomInfo)
            this.$message.success('初始化成功！')
            this.activeNames = []
          }).catch(response => {
            console.log(response)
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    clean() {
      this.roomInfo = {
        uid: store.getters.uid,
        username: store.getters.name,
        classId: [],
        roomId: '',
        roomName: '',
        introduction: '',
        liveUrl: ''
      }
    }
  }

}
</script>

<style scoped>

</style>
