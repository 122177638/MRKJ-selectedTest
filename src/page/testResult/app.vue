<template>
    <div class="testResult_container">
        <div class="banner">
  		    <img :src="pageData.bannelImg" width="100%" alt="banner"/>
  	    </div>
        <section class="paipan_container">
            <div class="usermsg_wrap">
                <h2 class="usermsg_title">个人信息</h2>
                <ul class="usermsg_content">
                    <li><span>姓名：</span>{{pageData.nickname}}</li>
                    <li><span>性别：</span>{{pageData.sex==1?'男':'女'}}</li>
                    <li><span>阳历生辰：</span>{{pageData.yangli}}</li>
                </ul>
            </div>

            <div class="ziwei_mingpan" v-if="pageData.pan == 'zw'">
                <div class="zwmp_box">
                    <div class="mp_tr" v-for="item in pageData.gong12" :key="item.key" @click="switchBigEvent(item.key)">
                        <div class="mp_tr_words_left">
                            <p v-for="citem in item.leftUp" v-if="citem.red && citem.value != ''"><span class="red_words">{{citem.value}}</span></p>
                        </div>
                        <div class="mp_tr_words">
                            <p class="words">{{item.srg}}</p>
                            <p class="fangda"><i></i>放大</p>
                        </div>
                    </div>

                    <div class="box_center">
                        <p class="red_words">{{pageData.nickname}}</p>
                        <p>农历：{{pageData.yinli}} </p>
                        <p>命局：{{pageData.yysex}} {{pageData.wxj}}</p>
                        <p>命宫-{{subslice(pageData.smgong,0,1)}}  身宫-{{subslice(pageData.smgong,1)}}</p>
                        <p>命主-{{pageData.mssnzx.m}}  身主-{{pageData.mssnzx.s}}</p>
                        <p>禄-{{pageData.shua[0].hlu}} 权-{{pageData.shua[0].hquan}} 科-{{pageData.shua[0].hke}} 忌-{{pageData.shua[0].hji}}</p>
                        <div class="bc_list">
                            <div class="left l_words red_words">坤造</div>
                            <div class="right r_infor">
                                <div class="r_infor_date"><span>年</span><p>{{subslice(pageData.sizhu[0],0,1)}}<br>{{subslice(pageData.sizhu[0],1)}}</p></div>
                                <div class="r_infor_date"><span>月</span><p>{{subslice(pageData.sizhu[1],0,1)}}<br>{{subslice(pageData.sizhu[1],1)}}</p></div>
                                <div class="r_infor_date"><span>日</span><p>{{subslice(pageData.sizhu[2],0,1)}}<br>{{subslice(pageData.sizhu[2],1)}}</p></div>
                                <div class="r_infor_date"><span>时</span><p>{{subslice(pageData.sizhu[3],0,1)}}<br>{{subslice(pageData.sizhu[3],1)}}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div class="zwmp_box_pop" v-for="item in pageData.gong12" :key="item.key" v-show="item.isshow" @click="closeEvent(item)">
                    <a class="icon_close" href="javascript:;">缩小</a>
                    <div class="zwmp_bp_left">
                        <p class="violet_words" v-for="citem in item.leftUp" v-if="citem.value != ''">
                            <span class="red_words" v-if="citem.red && citem.value != ''">{{citem.value}}</span>
                            <span v-else>{{citem.value}}</span>
                        </p>
                        
                    </div>
                    <div class="zwmp_bp_center">
                        <p class="words_center">{{item.srg}}</p>
                        <p class="sui">{{item.dx}}</p>
                        <div class="b_nubmer">
                            <p v-for="snum in item.xx">{{snum}}</p>
                        </div>
                    </div>
                    <div class="left_bottom">
                        <p>{{item.snbs}}</p>
                        <p>{{item.tg}}</p>
                    </div>
                    <div class="right_bottom">
                        <p>{{item.cssex}}</p>
                        <p>{{item.snjq}}</p>
                        <p>{{item.snsq}}</p>
                    </div>
                </div>
            </div>

            <div class="liunian_table" v-if="pageData.pan == 'bz'">
                <table>
                    <tbody>
                        <tr>
                            <td class="bg_col_y">命造</td>
                            <td class="bg_col_y" colspan="2">年柱</td>
                            <td class="bg_col_y" colspan="2">月柱</td>
                            <td class="bg_col_y" colspan="2">日柱</td>
                            <td class="bg_col_y" colspan="2">时柱</td>
                        </tr>
                        <tr>
                            <td class="bg_col_y">天干十神</td>
                            <td class="red_words" colspan="2">{{pageData.nianzhuss[0]}}</td>
                            <td class="red_words" colspan="2">{{pageData.nianzhuss[1]}}</td>
                            <td class="red_words" colspan="2">命主</td>
                            <td class="red_words" colspan="2">{{pageData.nianzhuss[2]}}</td>
                        </tr>
                        <tr>
                            <td class="bg_col_y">八字</td>
                            <td colspan="8">
                                <ul>
                                    <li><p>{{subslice(pageData.sizhu[0],0,1)}}</p><p>{{subslice(pageData.sizhu[0],1)}}</p></li>
                                    <li><p>{{subslice(pageData.sizhu[1],0,1)}}</p><p>{{subslice(pageData.sizhu[1],1)}}</p></li>
                                    <li><p>{{subslice(pageData.sizhu[2],0,1)}}</p><p>{{subslice(pageData.sizhu[2],1)}}</p></li>
                                    <li><p>{{subslice(pageData.sizhu[3],0,1)}}</p><p>{{subslice(pageData.sizhu[3],1)}}</p></li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td class="bg_col_y">藏干</td>
                            <td colspan="2">{{pageData.canggan[0]}}</td>
                            <td colspan="2">{{pageData.canggan[1]}}</td>
                            <td colspan="2">{{pageData.canggan[2]}}</td>
                            <td colspan="2">{{pageData.canggan[3]}}</td>
                        </tr>
                        <tr>
                            <td class="bg_col_y">地支十神</td>
                            <td colspan="2"><p>{{pageData.zhishen[0]}}</p></td>
                            <td colspan="2"><p>{{pageData.zhishen[1]}}</p></td>
                            <td colspan="2"><p>{{pageData.zhishen[2]}}</p></td>
                            <td colspan="2"><p>{{pageData.zhishen[3]}}</p></td>
                        </tr>
                        <tr>
                            <td class="bg_col_y">纳音</td>
                            <td colspan="2"><p>{{pageData.sizhuny[0]}}</p></td>
                            <td colspan="2"><p>{{pageData.sizhuny[1]}}</p></td>
                            <td colspan="2"><p>{{pageData.sizhuny[2]}}</p></td>
                            <td colspan="2"><p>{{pageData.sizhuny[3]}}</p></td>
                        </tr>
                        <tr>
                            <td class="bg_col_y">地势</td>
                            <td colspan="2">{{pageData.bzdishi[0]}}</td>
                            <td colspan="2">{{pageData.bzdishi[1]}}</td>
                            <td colspan="2">{{pageData.bzdishi[2]}}</td>
                            <td colspan="2">{{pageData.bzdishi[3]}}</td>
                        </tr>
                        <tr>
                            <td class="bg_col_y">喜用神:{{pageData.xiys}}</td>
                            <td colspan="4"><p>旺相休囚死:</p><p class="red_words">{{pageData.wxsqs}}</p></td>
                            <td colspan="2"><p>胎元:</p><p class="red_words">{{pageData.taiyuan}}</p></td>
                            <td colspan="2"><p>日空:</p><p class="red_words">{{pageData.rikong}}</p></td>
                        </tr>
                        <!-- <tr>
                            <td colspan="10" class="hr_words">起大运：出生后年月起大运</td>
                        </tr> -->
                        <tr>
                            <td >大运岁数</td>
                            <td v-for="item in pageData.dayun">{{item}}</td>
                        </tr>
                        <tr>
                            <td >大运年份</td>
                            <td v-for="(item,index) in pageData.dayungz">{{subslice(pageData.dayungz[index],0,1)}}<br>{{subslice(pageData.dayungz[index],1)}}</td>
                           
                        </tr>
                        <tr>
                            <td >十神</td>
                            <td v-for="(item,index) in pageData.dayunss">{{subslice(pageData.dayunss[index],0,1)}}<br>{{subslice(pageData.dayunss[index],1)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="test_container">
            <div class="test_wrap" v-for="item in pageData.jieguo">
                <h3 class="test_title">{{item.title}}</h3>
                <ul class="test_content">
                    <li class="test_list" v-for="item in item.content">
                        <h4 class="test_c_t">{{item.heading}}</h4>
                        <ul class="test_c_c">
                            <li class="test_c_list" v-for="item in item.content">
                                <h5>{{item.strong}}</h5>
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
        <more-test></more-test>
    </div>
</template>

<script>
import moreTest from '@components/moreTest'
import { parseQueryString } from '../../config/mUtils'
export default {
  data () {
    return {
      pageData: [],
      urlparams: '',
      orderid: ''
    }
  },
  components: {
    moreTest
  },
  mounted () {
    this.urlparams = parseQueryString(window.location.href)
    console.log(this.urlparams)
    if (this.urlparams.orderid) {
      this.orderid = this.urlparams.orderid
      this.axios();
      // 统计
      this.$ajax.post('https://hy.yixueqm.com/zhiming/index.php/Home-Interface-remain', {channel: sessionStorage.getItem('channel'), nickName: '简测', typeName: 'JC' + localStorage.getItem('typeid') + '-J', uid: localStorage.getItem('uid')}).then((response) => {})
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
      this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-jieguoye-index', {orderid: this.orderid})
        .then((response) => {
            _self.pageData = response.data
            document.title = _self.pageData.big_title
            console.log(response)
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
    }
  }
}
</script>

<style lang="scss">
    .lrflex{overflow: hidden;}
    .lrimg{float:right;width:80px;}
    .testResult_container{background-color:#FFF9F5;}
    .paipan_container{
        padding:0 10px;
        .usermsg_wrap{
            margin:10px 0;
            border:1px solid #cccccc;
            .usermsg_title{
                width: 100%;
                font-weight: 400;
                color:#333333;
                font-size:18px;
                height:40px;
                line-height: 40px;
                background-color:#fed3d0;
                border-bottom:1px solid #cccccc;
                text-align: center;
            }
            .usermsg_content{
                padding:10px 15px;
                overflow: hidden;
                li{
                    float: left;
                    min-width: 50%;
                    margin-bottom: 10px;
                    font-size:15px;
                    color:#333333;
                    span{color:#999999;}
                    &:nth-child(2){
                        float: right;
                        text-align: right;
                    }
                    &:nth-last-child(1){
                        margin-bottom: 0;
                    }
                    &:nth-last-child(2){
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
    .test_wrap{
        margin-top:30px;
        &:nth-last-child(1){padding-bottom: 30px;}
        .test_title{
            font-size:18px;
            color:#333333;
            text-align: center;
            position: relative;
        }
        .test_content{
            padding:0 10px;
            .test_list{
                .test_c_t{
                    display: inline-block;
                    padding:5px 20px;
                    background-color:#FED3D0;
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

    // 命盘
    .ziwei_mingpan {
        overflow: hidden;
        background: #f8f8f8;
        position: relative;
    }

    .zwmp_box {
    overflow: hidden;
    border-left: 1px solid #d7d7d7;
    border-top: 1px solid #d7d7d7;
    position: relative;
    .mp_tr {
        position: relative;
        height: 100px;
        float: left;
        border-right: 1px solid #d7d7d7;
        border-bottom: 1px solid #d7d7d7;
        width: 25%;
        text-align: center;
        padding: 10px 0;
        box-sizing: border-box;
        background: #fff4fc url('../../assets/img/bg_mingpan.jpg') no-repeat center center;
        background-size: 100%;
    }
    }

    .public_red {
    color: #fc0c0f;
    }

    .red_words {
    color: #d70000;
    }

    .mp_tr_words_left {
    position: absolute;
    top: 2px;
    left: 2px;
    font-size: 12px;
    p {
        display: inline-block;
        width: 14px;
        text-align: center;
        vertical-align: top;
    }
    }

    .mp_tr_words {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: auto;
    width: 50px;
    height: 40px;
    }

    .zwmp_box .mp_tr {
    .words {
        color: #611b7b;
        box-sizing: border-box;
        display: block;
        font-size: 16px;
    }
    .fangda {
        font-size: 14px;
        color: #d70000;
        margin-top: 5px;
        display: block;
        i {
        display: inline-block;
        background: url('../../assets/img/icon_fangda.png') no-repeat center center;
        width: 13px;
        height: 13px;
        background-size: 100% 100%;
        margin-right: 5px;
        }
    }
    }

    .box_center {
    height: 200px;
    width: 50%;
    position: absolute;
    top: 100px;
    left: 25%;
    z-index: 3;
    overflow: hidden;
    font-size: 12px;
    box-sizing: border-box;
    border-right: 1px solid #d7d7d7;
    border-bottom: 1px solid #d7d7d7;
    padding: 5px;
    background: #fff;
    }

    .bc_list {
    overflow: hidden;
    margin-top: 5px;
    .l_words {
        width: 20%;
        height: 24px;
        float: left;
    }
    .r_infor {
        width: 80%;
        float:right;
    }
    }

    .right {
    float: right;
    }

    .bc_list .r_infor_date {
    width: 25%;
    float: left;
    text-align: center;
    p {
        color: #d70000;
    }
    }

    .sl_content {
    display: none;
    }

    .zwmp_box .mp_tr {
    &:nth-child(6), &:nth-child(8) {
        margin-left: 50%;
    }
    }

    .zwmp_box_pop {
    height: 400px;
    background: #fff4fc url('../../assets/img/bg_mingpan.jpg') no-repeat center center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 4;
    background-size: 100%;
    border-top: 1px solid #d7d7d7;
    .icon_close {
        position: absolute;
        right: 5px;
        top: 5px;
        display: block;
        background: url('../../assets/img/icon_suoxiao.png') no-repeat left center;
        background-size: 18px auto;
        padding-left: 18px;
        color: #d70000;
        -webkit-tap-highlight-color: transparent;
    }
    }

    .zwmp_bp_left {
    position: absolute;
    top: 5px;
    left: 5px;
    }
    .zwmp_bp_center {
    width: 200px;
    height: 200px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    }

    .zwmp_box_pop {
    .left_bottom {
        font-size: 20px;
        position: absolute;
        left: 5px;
        bottom: 10px;
    }
    .right_bottom {
        font-size: 20px;
        position: absolute;
        right: 5px;
        bottom: 10px;
        text-align: right;
    }
    }

    .zwmp_bp_left p {
        float: left;
        width: 19px;
        text-align: center;
        margin-right: 5px;
        font-size:14px;
        color:#611b7b;
    }

    .zwmp_bp_center {
    .words_center {
        font-size: 30px;
        color: #d70000;
    }
    .sui {
        font-size: 18px;
        margin: 5px 0;
    }
    .b_nubmer {
        overflow: hidden;
        p {
        float: left;
        width: 16.66%;
        }
    }
    }

    .zwmp_box_pop {
    .left_bottom p, .right_bottom p {
        width: 19px;
        text-align: center;
        margin-right: 5px;
        float: left;
    }
    }
    // 八字命盘
    .liunian_table { margin:10px 0;color: #512a18;font-size:14px;}
    table {border-spacing: 0;}
    .red_words {color: #a40b1c;}
    .red {color: #d52800;}
    .liunian_table table {width: 100%;background: #fff4d6;margin-bottom: 5px;border: 1px solid #ddbd67;}
    .liunian_table td.bg_col_y {
        background: #f8d0a8;
        color: #763515;
        border-right: 1px solid #ddbd67;
        border-bottom: 1px solid #ddbd67;
    }
    .liunian_table td {
        width: 10%;
        padding: 5px 0;
        box-sizing: border-box;
        border-right: 1px solid #ddbd67;
        border-bottom: 1px solid #ddbd67;
        text-align: center;
    }
    .hr_words {
        text-align: center;
        height: 30px;
        line-height: 30px;
        color: #a40b1c;
        border-left: 1px solid #ddbd67;
    }
    .liunian_table li {float: left;width: 25%;}
    .liunian_table li p {font-weight: 700;font-size: 20px;}
    .liunian_table td.bg_red {background: #a61222;color: #fff4d6;}
</style>

