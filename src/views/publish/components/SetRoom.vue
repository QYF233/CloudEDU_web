<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item>
        <template slot="title">
          <h3>初始化教室信息</h3>
        </template>
        <el-form :model="form">
          <el-form-item label="上课教师：" :label-width="formLabelWidth">
            <el-col :span="18">
              <el-input v-model="form.teacherName" autocomplete="off" disabled/>
            </el-col>
          </el-form-item>
          <el-form-item label="上课班级：" :label-width="formLabelWidth">
            <el-col :span="18">
              <el-cascader
                :key="options.index"
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
          <el-form-item>
            <el-button type="primary" @click="setRoomInfo">创建教室</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getAllClassesOption, setRoomInfo } from '@/api/class'
import store from '@/store'
import { eventBus } from '@/main'

export default {
  name: 'SetRoom',
  data() {
    return {
      form: {
        teacherId: store.getters.uid,
        teacherName: store.getters.name,
        classId: [],
        roomId: '',
        roomName: '',
        introduction: ''
      },
      options: [],
      formLabelWidth: '100px',
      activeNames: [1]
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      // 获取班级列表
      getAllClassesOption().then(response => {
        this.options = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 初始化教室信息
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
        eventBus.$emit('setRoomId', this.roomId)
        eventBus.$emit('setRoom', this.form)
      }).catch(response => {
        console.log(response)
      })
    }
  }

}
</script>

<style scoped>

</style>
