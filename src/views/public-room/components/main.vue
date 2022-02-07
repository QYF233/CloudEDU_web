<template>
  <el-row :gutter="20">
    <el-col :span="20" :offset="2" class="result">
      <div class="title">公开课</div>
      <el-row :gutter="20">
        <el-col v-for="n in roomList" :key="n.index" :span="6">
          <el-card :body-style="{ padding: '0px' }" class="room" @click.native="goRoom(n.id)">
            <el-image
              class="image"
              :src="url"
              fit="cover"
            />
            <div class="card-body">
              <span class="room-name">{{ n.name }}</span>
              <p class="description">{{ n.note }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div style="text-align: right ;">
        <pagination
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>

    </el-col>

  </el-row>
</template>

<script>
import store from '@/store'
import { searchRoom } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: 'Main',
  components: { Pagination },
  data() {
    return {
      textarea: '',
      searchVal: '',
      url: require('@/assets/images/cloudedu.png'),
      uid: store.getters.uid,
      roomList: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      status: ''
    }
  },
  watch: {
    '$route'(to, from) {

    }
  },
  created() {
    this.getList()
  },
  methods: {
    goBack() {
      this.$router.push({
        name: '/index'
      })
    },
    goRoom(n) {
      this.$router.push({
        path: '/player',
        query: {
          roomId: n
        }
      })
    },
    getList() {
      // 获取数据
      searchRoom(this.listQuery).then(res => {
        const { list, total } = res.data
        console.log(list)
        this.roomList = list
        this.total = total
      }).catch(res => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.result {
  .room {
    height: 150px;
    margin: 20px 0;
    overflow: hidden;
    cursor: pointer;
  }

  .image {
    height: 80px;
    width: 100%;
  }

  .title {
    border-bottom: 5px solid #0fa784;
    padding: 10px;
    display: inline-block;
    font-size: 20px;
  }
}

.card-body {
  padding: 10px 20px;

  .room-name {
    display: inline;
    width: 100%;
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  .description {
    padding-left: 1px;
    font-size: 8px;
    color: #909399;
  }

}

</style>
