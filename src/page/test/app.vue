<template>
  <div class="test_container">
  	<div class="banner">
  		<img :src="pageData.bannel_img" width="100%" :alt="pageData.name"/>
  	</div>
  	<div class="test_slogan">
  		<p>{{pageData.text1}}</p>
  		<h3>{{pageData.text2}}</h3>
  	</div>
  	<div class="form_container">
  		<ul class="form_list">
  			<li class="form_item">
  				<label class="item_left">您的姓名</label>
  				<div class="item_right">
  					<input type="text" id="username" v-model.trim="username" placeholder="请输入名字（可匿名）" value="" />
  				</div>
  			</li>
  			<li class="form_item">
  				<label class="item_left">您的性别</label>
  				<div class="item_right">
  					<input type="radio" checked id="man" v-model="sex" value="1"/>
  					<label for="man">男</label>
  					<input type="radio" id="woman" v-model="sex" value="0"/>
  					<label for="woman">女</label>
  				</div>
  			</li>
  			<li class="form_item">
  				<label class="item_left">出生日期</label>
  				<div class="item_right">
  					<span id="datetime" data-id="birthday">请选择出生日期</span>
  					<input type="hidden" id="birthday" ref="birthdayval" />
  				</div>
  			</li>
  		</ul>
  		<div class="form_subimt" @click="startTestEvent()">立即测算</div>
			<a v-if="pageData.ispay" href="https://www.yixueqm.com/jianceH5/mytest.html" class="readhistory">查看我的测算记录</a>
  	</div>
  	<div class="detail_container">
  		<h3 class="detail_title">{{pageData.small_title}}</h3>
  		<ul class="detail_list">
  			<li v-for="(item,index) in pageData.tbArr" :title="item"><span>{{index+1}}</span>{{item}}</li>
  		</ul>
  	</div>
  	<more-test></more-test>
  </div>
</template>

<script>
	import lCalendar from '../../assets/js/YD_calendar.min.js'
	import { Toast, Indicator } from 'mint-ui'
	import moreTest from '@components/moreTest'
	export default {
	  components: {
	    moreTest
	  },
	  data () {
	    return {
	      pageData: '',
	      urlparams: '',
	      username: '',
	      sex: 1,
	      birthday: '',
	      uid: '',
	      typeid: 1,
	      channel: 0
	    }
	  },
  	mounted () {
	    this.initData()
	    this.getpageData()
	    var calendar = new lCalendar.lCalendar().init('#datetime')
	    console.log('uid:' + this.uid, 'channel:' + this.channel, 'typeid:' + this.typeid)
  	},
  	methods: {
	    initData () {
	      let _self = this
	      let getpaytime
	      let intervalTime = 5000
	      let totalintervalTime = 0
				this.urlparams = this.parseQueryString(window.location.href) // 参数
				if(this.urlparams.festival){
					window.location.href = 'totalTest.html'
				}
	      if (this.urlparams.uid) {
	        localStorage.setItem('uid', this.urlparams.uid)
      	}
	      this.typeid = this.urlparams.typeid ? this.urlparams.typeid : this.typeid
	      localStorage.setItem('typeid', this.typeid)
	      if (localStorage.getItem('uid')) {
	        this.uid = localStorage.getItem('uid')
      } else {
	        let ua = window.navigator.userAgent.toLowerCase()
	        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
	          window.location.href = 'https://www.yixueqm.com/jiance/index.php/Home-Index-getOpenid'
	          return
        } else {
	          this.uid = this.uuid(8, 16)
	          localStorage.setItem('uid', this.uid)
        }
      }

	      if (localStorage.getItem('channel')) {
	        this.channel = localStorage.getItem('channel')
      } else {
	        this.channel = this.urlparams.channel ? this.urlparams.channel : this.channel
	        localStorage.setItem('channel', this.channel)
      }

	      if (this.urlparams.orderid) {
	        getpaytime = setInterval(function () {
	          totalintervalTime += intervalTime
	          if (totalintervalTime >= (5 * 60 * 1000)) {
	            clearInterval(getpaytime)
	            alert('支付失败')
          	} else {
	            _self.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-selectOrder', {orderid: _self.urlparams.orderid}).then(function (response) {
	              if (response.data) {
	                window.location.href = `testResult.html?orderid=${_self.urlparams.orderid}`
              }
            })
          }
        }, intervalTime)
      }
	    },
	    getpageData () {
	      let _self = this
	      this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-index', {typeid: _self.typeid, uid: _self.uid}).then((response) => {
	        _self.pageData = response.data
	        console.log(response)
	      })
	    },
	    startTestEvent () {
	      let _self = this
	      _self.birthday = this.$refs.birthdayval.value
	      if (_self.username == '') {
	        _self.username = '匿名'
      	} else if (!/^[\u4e00-\u9fa5]+$/.test(_self.username)) {
	        Toast('请输入中文名字')
	        return
      	}
	      if (_self.birthday == '') {
	        Toast('请选择出生日期')
	        return
      	}
	      Indicator.open({
	        text: '正在发起支付',
	        spinnerType: 'fading-circle'
      })
	      setTimeout(() => {
	        Indicator.close()
	        window.location.href = `https://www.yixueqm.com/jiance/index.php/Home-Index-placeOrder?username=${_self.username}&&birthday=${_self.birthday}&&sex=${_self.sex}&&typeid=${_self.typeid}&&uid=${_self.uid}&&channel=${_self.channel}`
	      }, 1000)
    	},
	    parseQueryString: function (url) {
	      var reg_url = /^[^\?]+\?([\w\W]+)$/,
	        reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
	        arr_url = reg_url.exec(url),
	        ret = {}
	      if (arr_url && arr_url[1]) {
	        var str_para = arr_url[1], result
	        while ((result = reg_para.exec(str_para)) != null) {
	          ret[result[1]] = result[2]
        }
	      }
	      return ret
	    },
			// uuid
	    uuid (len, radix) {
	      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
	      var uuid = [], i
	      radix = radix || chars.length

	      if (len) {
					// Compact form
	        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
      	} else {
					// rfc4122, version 4 form
	        var r

				// rfc4122 requires these characters
	        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
	        uuid[14] = '4'

				// Fill in random data.  At i==19 set the high bits of clock sequence as
				// per rfc4122, sec. 4.1.5
	        for (i = 0; i < 36; i++) {
	          if (!uuid[i]) {
	            r = 0 | Math.random() * 16
	            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
	          }
        }
      }
	      return uuid.join('')
	    }
	  }
	}
</script>

<style lang="scss">
	@import url('../../assets/css/YD_calendar.min.css');
  @font-face {
    font-family: 'FZYTK';
    src: url('../../assets/fonts/FZYTK.ttf');
	}
	.test_container{
		background:url('../../assets/img/bj.png') 50% #FFF9F5;
		background-size:cover;
		min-height:100vh;
	}
	.banner{min-height: 150px;}
  .test_slogan{
  	padding:30px 25px;
  	p{
  		font-size:13px;
  		color:#333333;
  		text-align: center;
  		margin-bottom: 30px;
  	}
  	h3{
  		font-size:24px;
  		color:#000000;
  		font-family:'FZYTK' !important;
  		text-align: center;
  		padding:0 18px;
  		font-weight:400;
  	}
  }
  .form_container{
  	padding:0 10px;
  	.form_list{
  		.form_item{
  			display: flex;
  			height: 44px;
  			line-height: 44px;
  			border-radius: 3px;
  			background-color:#F0F0F0;
  			margin-bottom: 10px;
  			.item_left{width: 25%;text-align: center;color:#333333;padding-right:15px;display: block;font-size:15px;}
  			.item_right{
  				flex: 1;
  				label{
  					height:44px;
  					padding-left:20px;
  					display: inline-block;
  					background:url(../../assets/img/select_nomal.png) 0 50% no-repeat;
  					background-size:13px;
  					margin-right:20px;
					font-size:15px;
  				}
  				#datetime{width: 100%;height:100%;-webkit-tap-highlight-color: transparent;display: block;color:#757575;font-size:15px;}
  				input[type="radio"]{display: none;}
  				input:checked+label{background:url(../../assets/img/select_press.png) 0 50% no-repeat;background-size:13px;}
  				input{width: 100%;height:100%;border:none;background-color:transparent;font-size:15px;}
  			}
  		}
  	}
  	.form_subimt{
  		width:100%;
  		height:45px;
  		background-color:#f44c4c;
  		border-radius: 3px;
  		color:#FFFFFF;
  		font-size:15px;
  		text-align: center;
  		line-height: 45px;
  		margin:10px 0;
  	}
		.readhistory{text-align: center;color:#f44c4c;display: block;text-decoration:underline;margin-top:15px;font-size:16px;}
  }
  .detail_container{
  	padding:20px 0 15px;
  	.detail_title{
  		font-size:18px;
  		color:#333333;
  		text-align: center;
  	}
  	.detail_list{
  		padding:15px 0 0;
  		li{
  			width:75%;
  			margin:0 auto 10px;
  			text-align: left;
  			padding-left:40px;
				height:30px;
  			line-height: 30px;
  			background-color: #F44C4C;
  			color:#FFFFFF;
  			font-size:14px;
  			position: relative;
  			border-radius: 50px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
  			span{
  				width:28px;
  				height:28px;
  				margin:1px;
  				display:inline-block;
  				background-color:#FFFFFF;
  				color:#F44C4C;
  				position: absolute;
  				left:0;
  				text-align: center;
  				border-radius: 50%;
  			}
  		}
  		li:nth-last-child(1){margin:0 auto;}
  	}
  }
</style>