<template>
  <el-row :gutter="20">
    <h2>以下为'{{ listQuery.searchVal }}'的搜索结果：</h2>
    <el-col :span="20" :offset="2" class="result">
      <el-row :gutter="20">
        <el-col v-for="n in roomList" :key="n.index" :span="6">
          <el-card :body-style="{ padding: '0px' }" class="room" @click.native="goRoom(n.id)">
            <el-image
              class="image"
              :src="url"
              fit="cover"
            />
            <div style="padding: 14px;">
              <span>{{ n.name }}</span>
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
      url: require('@/assets/images/cloudedu.png'),
      uid: store.getters.uid,
      roomList: [],
      status: '',
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        searchVal: this.$route.query.searchVal
      }
    }
  },
  watch: {
    '$route'(to, from) {
      this.getSearchVal()
    }
  },
  created() {
    this.getSearchVal()
    console.log(this.listQuery.searchVal)
  },
  methods: {
    getSearchVal() {
      this.listQuery.searchVal = this.$route.query.searchVal
      this.getList()
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
    },
    goRoom(n) {
      this.$router.push({
        path: '/player',
        query: {
          roomId: n
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.result {
  margin-top: 50px;
  margin-bottom: 50px;

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
    width: 100%;
  }
}

</style>
