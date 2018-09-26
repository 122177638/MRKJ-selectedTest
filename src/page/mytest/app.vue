<template>
    <div class="mytest_container">
        <div class="mytest_wrap">
            <ul class="mytest_list" v-if="mytestData != ''">
                <li class="mytest_item" v-for="item in mytestData" :key="item.orderid" @click="navigateToResult(item)">
                    <div class="mytest_l">
                        <h3>{{item.typeName}}</h3>
                        <p>订单号：{{item.orderid}}</p>
                        <p>测算人：{{item.username}}</p>
                        <p>{{item.createtime}}</p>
                    </div>
                    <div class="mytest_r">查看测算结果</div>
                </li>
            </ul>
            <p v-else class="mytestpromt">你还没有测试,<a href="https://www.yixueqm.com/jianceH5/test.html">快去测试吧</a></p>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
        mytestData: []
      }
  },
  mounted () {
    this.getmytestData()
  },
  methods: {
    getmytestData () {
        var _self = this
        if (localStorage.getItem('uid')) {
              console.log(localStorage.getItem('uid'))
              this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-payOrder', {uid: localStorage.getItem('uid')})
                .then((response) => {
                  _self.mytestData = response.data
                  console.log(_self.mytestData)
                })
            } else {
              alert('uid不存在')
              window.location.href = 'https://www.yixueqm.com/jianceH5/test.html'
            }
      },
    navigateToResult (item) {
        window.location.href = 'testResult.html?orderid=' + item.orderid
      }
  }
}
</script>

<style lang="scss">
    body{background-color:#eeeeee;}
    .mytest_list{
        padding:15px 10px;
        .mytest_item{
            background-color:#ffffff;
            padding:10px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom:10px;
            box-shadow: 0 0 8px 0 #535252,2px 2px 10px 0 #535252;
            &:nth-last-child(1){margin-bottom:0;}
            .mytest_l{
                flex: 1;
                overflow: hidden;
                h3{font-size:14px;color:#333333;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;}
                p{font-size:12px;color:#333333;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;}
            }
            .mytest_r{
                padding:5px 10px;
                background-color:tomato;
                border-radius: 15px;
                color:#ffffff;
                margin-left:10px;
            }
            
        }
    }
    .mytestpromt{text-align: center;padding:15px 0;font-size:14px}
    
</style>
