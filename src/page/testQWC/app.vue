<template>
    <div class="quceTest_container" :style="'background:url('+pageData.index_bj+') 0% 0% / 100% 100% no-repeat;'">
        <div :class="['form_container0'+pageData.typeid,'visiHidden']">
            <form action="" method="POST">
                <ul class="form_ul">
                    <li class="form_sex">
                        <input type="radio" id="man" checked v-model="sex" value="1">
                        <label for="man" class="sexBtn sexMan" 
                        :style="sex == 1
                        ?'background:url('+pageData.index_nan+') 0% 0% / 100% 100% no-repeat;'
                        :'background:url('+pageData.index_nan_1+') 0% 0% / 100% 100% no-repeat;'">
                        </label>
                        <input type="radio" id="woman" v-model="sex" value="0">
                        <label for="woman" class="sexBtn sexWoman"
                        :style="sex == 0
                        ?'background:url('+pageData.index_nv+') 0% 0% / 100% 100% no-repeat;'
                        :'background:url('+pageData.index_nv_1+') 0% 0% / 100% 100% no-repeat;'">
                        </label>
                    </li>
                    <li class="form_li" 
                        :style="'background:url('+pageData.index_xrk+') 0% 0% / 100% 100% no-repeat;'">
                        <input type="text" placeholder="请选择出生日期" id="datetime" class="form_ipt"
                            :style="'background:url('+pageData.index_xl+') 95% center / 22px 15px no-repeat;padding:0 35px 0 20px;'">
                    </li>
                    <li class="form_li" 
                        :style="'background:url('+pageData.index_xrk+') 0% 0% / 100% 100% no-repeat;'">
                        <input type="text" placeholder="请输入名字(可不填)" v-model="username" class="form_ipt">
                    </li>
                </ul>
                <div class="submit_btn" 
                :style="'background:url('+pageData.index_xfjx+') 0% 0% / 100% 100% no-repeat;'" 
                @click="submitFormEvent()">
                </div>
                <p class="money_p"><span class="del">原价：￥{{pageData.priceY}}</span>&nbsp;&nbsp; 限时优惠：<span class="addyh">￥{{pageData.priceX}}</span></p>
            </form>
        </div>
        <a href="mytest.html" class="mytestBtn">我的测算</a>
    </div>
</template>

<script>
import datePlugin from '../../assets/js/YD_calendar.js';
import { Toast, Indicator } from 'mint-ui'
import { parseQueryString, uuid, payMoney135 } from '../../config/mUtils'
export default {
    data () {
        return {
            sex: 1,
            birthday: '',
            username: '',
            typeid: 1,
            pageData: {},
            channel: 0,
            uid: ''
        }
    },
    mounted () {
        document.querySelector('.visiHidden').style.opacity = '0';
        window.PayResultCallBack = payMoney135.PayResultCallBack; // jsonp回调
        this.initData()
        // 是否登陆状态
        if (this.typeid && this.uid) {
            this.getpageData();
            this.currYoumeng();
        }
        new datePlugin.lCalendar('#datetime') // eslint-disable-line
    },
    methods: {
        initData () {
            let _self = this;
            var getpaytime = null;
            let intervalTime = 5000;
            let totalintervalTime = 0;
            this.urlparams = parseQueryString(window.location.href) // 参数
            
            // 获取typeid
            this.typeid = this.urlparams.typeid ? this.urlparams.typeid : this.typeid
            localStorage.setItem('typeid', this.typeid)
            
            // 获取渠道
            if (this.urlparams.channel) {
                this.channel = this.urlparams.channel;
                sessionStorage.setItem('channel', this.channel);
            } else {
                if (sessionStorage.getItem('channel') && sessionStorage.getItem('channel') != '') {
                    this.channel = sessionStorage.getItem('channel');
                }	else {
                    this.channel = 0;
                    sessionStorage.setItem('channel', this.channel);
                }
            }

            // 获取uid
            if (this.urlparams.uid) {
                this.uid = this.urlparams.uid;
                localStorage.setItem('uid', this.uid);
            } else {
                if (localStorage.getItem('uid') && localStorage.getItem('uid') != '') {
                    this.uid = localStorage.getItem('uid')
                } else {
                    let ua = window.navigator.userAgent.toLowerCase()
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        // typeXM -- jiance2q => testQWC.html jiance2 => test.html jiance2qZH => totalTestQWC.html
                        window.location.href = 'https://www.yixueqm.com/jiance/index.php/Home-Index-getOpenid?typeXM=jiance2q&typeid=' + this.typeid + '&channel=' + this.channel;
                    } else {
                        this.uid = uuid(8, 16)
                        localStorage.setItem('uid', this.uid)
                    }
                }
            }

            // 获取订单
            if (this.urlparams.orderid) {
                getpaytime = setInterval(function () {
                    totalintervalTime += intervalTime
                    if (totalintervalTime >= (5 * 60 * 1000)) {
                        clearInterval(getpaytime);
                        alert('支付失败')
                    } else {
                        _self.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-selectOrder', {orderid: _self.urlparams.orderid}).then(function (response) {
                            if (response.data) {
                                window.location.href = `testResultQWC.html?orderid=${_self.urlparams.orderid}`
                            }
                        })
                    }
                }, intervalTime)
            }
        },
        currYoumeng () {
            var _self = this;
            this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-cnzzID', {channel: _self.channel, typeid: _self.typeid, typeXM: 'jiance2q'}).then((response) => {
                if (response.data) {
                    var qudaoId = response.data;
                    var scriptView = document.createElement('script');
                    var cprotocol = document.location.protocol == 'https:' ? ' https://' : ' http://';
                        scriptView.src = cprotocol + 's19.cnzz.com/z_stat.php?id=' + qudaoId;
                        scriptView.type = 'text/javascript';
                        document.body.appendChild(scriptView);
                } else {
                    console.log('友盟未统计')
                }
            })
            // 统计进来次数
            let firstOpen;
            try {
                firstOpen = localStorage.getItem('firstOpen');
                if (firstOpen) {
                    firstOpen++;
                    localStorage.setItem('firstOpen', firstOpen);
                } else {
                    localStorage.setItem('firstOpen', 1);
                }
            } catch (error) {
                alert('不支持localStorage')
            }
            this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-cnzz_pvuv', {channel: _self.channel, typeid: _self.typeid, typeXM: 'jiance2q', loginNum: firstOpen}).then((response) => {
            })
        },
        getpageData () {
            var _self = this;
            this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-index2', {channel: _self.channel, typeid: _self.typeid, uid: _self.uid, typeXM: 'jiance2q'}).then((response) => {
                _self.pageData = response.data;
                document.title = _self.pageData.name;
                document.querySelector('.visiHidden').style.opacity = '1';
                console.log(_self.pageData)
            })
        },
        submitFormEvent () {
            var _self = this
            this.birthday = document.querySelector('#datetime').getAttribute('data-value')
            if (_self.username == '') {
                _self.username = '匿名'
            } else if (!/^[\u4e00-\u9fa5]+$/.test(_self.username)) {
                Toast('请输入中文名字')
                return false;
            }
            if (!this.birthday) {
                Toast('请选择出生日期')
                return false;
            }
            Indicator.open({
                text: '正在发起支付',
                spinnerType: 'fading-circle'
            })
            setTimeout(() => {
                Indicator.close();
                if (_self.channel == 'qudao135') {
                    this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-placeOrder', {
                        username: _self.username,
                        birthday: _self.birthday,
                        sex: _self.sex,
                        typeid: _self.typeid,
                        uid: _self.uid,
                        channel: _self.channel,
                        typeXM: 'jiance2q'
                    }).then(function (response) {
                        var data = response.data;
                        payMoney135.payMoney(data.price, data.uid, data.orderid)
                    }).catch(function (e) {
                        alert('qudao135支付接口错误')
                    })
                } else {
                    window.location.href = `https://www.yixueqm.com/jiance/index.php/Home-Index-placeOrder?username=${_self.username}&&birthday=${_self.birthday}&&sex=${_self.sex}&&typeid=${_self.typeid}&&uid=${_self.uid}&&channel=${_self.channel}&typeXM=jiance2q`
                }
            }, 1000)
            console.log(
                '生日:' + this.birthday,
                '\n名字:' + this.username, 
                '\n性别:' + this.sex, 
                '\n类别ID:' + this.typeid, 
                '\n渠道:' + this.channel, 
                '\n用户ID:' + this.uid
            )
        }
    }
}
</script>

<style lang="scss">
    @import url('../../assets/css/YD_calendar.css');
    .quceTest_container{
        position: relative;
        min-height:667px;
    }
    .mytestBtn{
        display: block;
        width:28px;
        font-size:14px;
        text-align: center;
        padding:5px;
        border-radius: 8px 0 0 8px;
        background-color:rgba(0,0,0,0.7);
        color:#ffffff;
        position: absolute;
        top:50px;
        right:0;
    }
    .del{
        text-decoration: line-through;
    }
    .addyh{color:#f44c4c;}
    // 富贵指数
    .form_container01{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:30px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 22px;
                input{display: none;}
                .sexBtn{
                    width:110px;
                    height:39px;
                    &:nth-last-child(1){margin-left:42px;}
                }
            }
            .form_li{
                height:50px;
                width:303px;
                // background:url('../../assets/img/btdl_xrk.png') no-repeat;
                // background-size:100% 100%;
                overflow: hidden;
                margin:0 auto 21px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:174px;
            height:55px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:11px;
            color:#000000;
        }
    }
    // 操劳命还是享福命？
    .form_container02{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:30px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 22px;
                input{display: none;}
                .sexBtn{
                    width:110px;
                    height:39px;
                    &:nth-last-child(1){margin-left:42px;}
                }
            }
            .form_li{
                height:50px;
                width:303px;
                // background:url('../../assets/img/btdl_xrk.png') no-repeat;
                // background-size:100% 100%;
                overflow: hidden;
                margin:0 auto 21px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:174px;
            height:55px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:11px;
            color:#ffffff;
            .addyh{color:#ffffff;}
        }
    }
    // 好事登门
    .form_container03{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:57px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 22px;
                input{display: none;}
                .sexBtn{
                    width:114px;
                    height:53px;
                    &:nth-last-child(1){margin-left:40px;}
                }
            }
            .form_li{
                height:45px;
                width:246px;
                // background:url('../../assets/img/btdl_xrk.png') no-repeat;
                // background-size:100% 100%;
                overflow: hidden;
                margin:0 auto 13px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:156px;
            height:53px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:11px;
            color:#ffffff;
            padding:5px 0;
            .addyh{color:#ffffff;}
        }
    }
    // 犯小人
    .form_container04{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:21px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 22px;
                input{display: none;}
                .sexBtn{
                    width:113px;
                    height:32px;
                    &:nth-last-child(1){margin-left:29px;}
                }
            }
            .form_li{
                height:46px;
                width:277px;
                // background:url('../../assets/img/btdl_xrk.png') no-repeat;
                // background-size:100% 100%;
                overflow: hidden;
                margin:0 auto 13px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:174px;
            height:54px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:11px;
            color:#333333;
            padding:5px 0 20px 0;
        }
    }
    // 白头到老
    .form_container05{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:56px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 25px;
                input{display: none;}
                .sexBtn{
                    width:115px;
                    height:45px;
                    &:nth-last-child(1){margin-left:44px;}
                }
            }
            .form_li{
                height:50px;
                width:303px;
                // background:url('../../assets/img/btdl_xrk.png') no-repeat;
                // background-size:100% 100%;
                overflow: hidden;
                margin:0 auto 21px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:195px;
            height:58px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:12px;
            color:#333333;
            padding:13px 0 11px 0;
        }
    }
    // 第三者
    .form_container06{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:21px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 22px;
                input{display: none;}
                .sexBtn{
                    width:113px;
                    height:32px;
                    &:nth-last-child(1){margin-left:29px;}
                }
            }
            .form_li{
                height:46px;
                width:277px;
                // background:url('../../assets/img/btdl_xrk.png') no-repeat;
                // background-size:100% 100%;
                overflow: hidden;
                margin:0 auto 13px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:174px;
            height:54px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:11px;
            color:#333333;
            padding:5px 0 20px 0;
        }
    }
    // 天生富贵
    .form_container07{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:35px;
            margin-left:100px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 13px;
                input{display: none;}
                .sexBtn{
                    width:95px;
                    height:41px;
                    &:nth-last-child(1){margin-left:29px;}
                }
            }
            .form_li{
                height:44px;
                width:236px;
                // background:url('../../assets/img/btdl_xrk.png') no-repeat;
                // background-size:100% 100%;
                overflow: hidden;
                margin:0 auto 14px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:328px;
            height:54px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:11px;
            color:#333333;
            padding:5px 0 15px 0;
        }
        .money_p .addyh{color:#f44c4c;}
    }
    // 幸福婚姻
    .form_container08{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:56px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 25px;
                input{display: none;}
                .sexBtn{
                    width:115px;
                    height:45px;
                    &:nth-last-child(1){margin-left:44px;}
                }
            }
            .form_li{
                height:50px;
                width:303px;
                // background:url('../../assets/img/btdl_xrk.png') no-repeat;
                // background-size:100% 100%;
                overflow: hidden;
                margin:0 auto 21px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:195px;
            height:58px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:12px;
            color:#333333;
            padding:13px 0 11px 0;
        }
    }
    // 今生什么命
    .form_container09{
        position: absolute;
        bottom:0;
        width: 100%;
        .form_ul{
            margin-bottom:15px;
            .form_sex{
                display: flex;
                justify-content: center;
                margin-bottom: 22px;
                input{display: none;}
                .sexBtn{
                    width:111px;
                    height:40px;
                    &:nth-last-child(1){margin-left:42px;}
                }
            }
            .form_li{
                height:50px;
                width:303px;
                // background:url('../../assets/img/btdl_xrk.png')  no-repeat;
                // background-size:contain;
                overflow: hidden;
                margin:0 auto 21px;
                &:nth-last-child(1){margin-bottom: 0;}
                .form_ipt{
                    width:100%;
                    height:100%;
                    background-color:transparent;
                    padding:0 20px;
                    font-size:17px;
                    color:#333333;
                    // &.dated{
                    //     background:url('../../assets/img/btdl_xl.png') 95% center / 22px 15px no-repeat;
                    //     padding:0 35px 0 20px;
                    // }
                }
            }
        }   
        .submit_btn{
            width:174px;
            height:53px;
            // background:url('../../assets/img/btdl_xfjx.png') no-repeat;
            // background-size:100% 100%;
            margin:0 auto
        } 
        .money_p{
            text-align: center;
            font-size:11px;
            color:#000000;
            padding:0px 0 20px 0;
        }
    }
    

</style>
