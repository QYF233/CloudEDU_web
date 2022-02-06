const classList = [{
  value: 1,
  label: '信息工程学院',
  children: [{
    value: 2,
    label: '计算机科学与技术',
    children: [
      { value: 1, label: '1班' },
      { value: 2, label: '2班' },
      { value: 3, label: '3班' }
    ]
  }, {
    value: 3,
    label: '软件工程',
    children: [
      { value: 1, label: '1班' },
      { value: 2, label: '2班' },
      { value: 3, label: '3班' }
    ]
  }, {
    value: 4,
    label: '网络工程',
    children: [
      { value: 1, label: '1班' },
      { value: 2, label: '2班' },
      { value: 3, label: '3班' }
    ]
  }]
}, {
  value: 3,
  label: '生命科学学院',
  children: [{
    value: 18,
    label: '高分子工程',
    children: [
      { value: 19, label: '1班' },
      { value: 20, label: '2班' }
    ]
  }, {
    value: 21,
    label: '生命技术',
    children: [
      { value: 22, label: '1班' },
      { value: 23, label: '2班' }
    ]
  }]
}
]

module.exports = [
  {
    url: '/cloudEDU/class/list',
    type: 'get', // 必须和你接口定义的类型一样
    response: response => {
      return {
        code: 20000,
        data: {
          status: 'success',
          classList: classList
        }
      }
    }
  }
]

