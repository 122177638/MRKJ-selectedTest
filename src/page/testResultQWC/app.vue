<template>
    <div class="testResult_container">

        <p class="order">订单号：{{orderid}}</p>
        <div class="banner">
  		    <img src="../../assets/img/qwcs_banner.png" width="100%" alt="banner"/>
  	    </div>
        <section class="test_container">
            <div class="test_wrap" v-for="item in pageData.jieguo">
                <h3 :class="['test_title',{'on':item.isOpen}]" @click="openEvent(item)">{{item.title}}</h3>
                <ul class="test_content" v-show="item.isOpen">
                    <li class="test_list" v-for="item in item.content">
                        <h4 class="test_c_t" v-if="item.heading">{{item.heading}}</h4>
                        <ul class="test_c_c">
                            <li class="test_c_list" v-for="item in item.content">
                                <h5 v-if="item.strong">{{item.strong}}</h5>
                                <div v-if="item.imgurl" class="lrflex">
                                    <img :src="item.imgurl" class="lrimg" alt="">
                                    <p>{{item.text}}</p>
                                </div>
                                <p v-else>{{item.text}}</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </section>
        <!-- <more-test></more-test> -->
        <m-footer></m-footer>
    </div>
</template>

<script>
// import moreTest from '@components/moreTest'
import { parseQueryString } from '../../config/mUtils'
import mFooter from '@components/mFooter'
export default {
  data () {
    return {
      isShow: false,
      pageData: [],
      urlparams: '',
      orderid: ''
    }
  },
  components: {
    // moreTest,
    mFooter
  },
  mounted () {
    this.urlparams = parseQueryString(window.location.href)
    console.log(this.urlparams)
    if (this.urlparams.orderid) {
      this.orderid = this.urlparams.orderid
      this.axios()
    } else {
      alert('没有该订单')
      window.history.go(-1);
    }
  },
  methods: {
    subslice (value, start, end) {
      if (value) {
        return value.slice(start, end)
      }
    },
    axios () {
      let _self = this
      this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-jieguoye-index2', {orderid: this.orderid})
        .then((response) => {
            _self.pageData = response.data;
            document.title = _self.pageData.big_title;
            _self.$set(_self.pageData.jieguo[0], 'isOpen', true);
            console.log(_self.pageData)
        })
    },
    switchBigEvent (key) {
      this.pageData.gong12.forEach(item => {
        if (item.key == key) {
          this.$set(item, 'isshow', true)
        }
      })
    },
    closeEvent (item) {
      item.isshow = false
    },
    openEvent (item) {
        this.$set(item, 'isOpen', !item.isOpen)
    }
  }
}
</script>

<style lang="scss">
    .lrflex{overflow: hidden;}
    .lrimg{float:right;width:80px;}
    .testResult_container{background-color:#4e8ef0;}
    .order{padding:10px;font-size:14px;color:#333333;background-color:#ffffff;}

    .test_container{
        overflow: hidden;
        margin:15px 10px;
        background-color:#ffffff;
        border-radius: 6px;
    }
    .test_wrap{
        margin-top:20px;
        &:nth-last-child(1){padding-bottom: 20px;}
        .test_title{
            margin:0 10px;
            box-sizing: border-box;
            padding-left:40px;
            border-radius: 6px;
            height:47px;
            line-height: 47px;
            background:url('../../assets/img/qwcs_bt.png') 0% 0% / 100% 100% no-repeat;
            font-size:18px;
            color:#ffffff;
            position: relative;
            &::after{
                content:'';
                width:20px;
                height:9px;
                display: inline-block;
                background:url('../../assets/img/icon_xiala.png') no-repeat;
                background-size:100% 100%;
                position: absolute;
                right:10px;
                top:50%;
                margin-top:-4.5px;
                transform: rotate(0deg);
            }
        }
        .test_title.on{
             &::after{
                transform: rotate(180deg);
            }
        }
        .test_content{
            padding:0 10px;
            .test_list{
                .test_c_t{
                    display: inline-block;
                    padding:5px 20px;
                    background-color:rgb(208, 254, 250);
                    border-radius: 15px 0 15px 0;
                    font-size:15px;
                    color:#333333;
                    margin-top:30px;
                }
                .test_c_c{
                    .test_c_list{
                        margin:10px 0 30px;
                        &:nth-last-child(1){margin:10px 0 0;}
                        h5{line-height:2;font-size:15px;color:#333333;}
                        p{font-size:13px;color:#333333;}
                    }
                }
            }
        }
    }
</style>

