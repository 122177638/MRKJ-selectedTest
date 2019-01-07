<template>
  <div class="test_container" :style="pageData.indexBg?'background:url('+pageData.indexBg+') no-repeat;background-size:100% 100%;':''">
  	<div class="banner">
  		<img :src="pageData.bannel_img" width="100%" :alt="pageData.name"/>
  	</div>
  	<!-- <div class="test_slogan">
  		<p>{{pageData.text1}}</p>
  		<h3>{{pageData.text2}}</h3>
  	</div> -->
  	<div class="form_container">
			<h3 class="h_title">请输入您的信息</h3>
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
  					<span id="datetime" data-date="1985-04-18-6" data-id="birthday">请选择出生日期</span>
  					<input type="hidden" id="birthday" ref="birthdayval" />
  				</div>
  			</li>
  		</ul>
			<p class="price_p"><del>原价：￥{{pageData.priceY}}</del><strong>限时优惠：<span>￥{{pageData.priceX}}</span></strong></p>
  		<div class="form_subimt" @click="startTestEvent()">立即测算</div>
			<a v-if="pageData.ispay" href="mytest.html" class="readhistory">查看我的测算记录</a>
  	</div>
		<div class="evalUate_container">
			<h3 class="h_title">用户评价</h3>
			<div class="evalUate_types">
				<canvas id="liubi1" class="evalUate_type" width="100" height="116"></canvas>
				<canvas id="liubi2" class="evalUate_type" width="100" height="116"></canvas>
				<canvas id="liubi3" class="evalUate_type" width="100" height="116"></canvas>
			</div>
			<ul class="evalUate_list">
				<li class="evalUate_item" v-for="item in pageData.tbArr">
					<figure><img :src="item.headImg" class="headImg" alt=""></figure>
					<div class="item_c">
						<p>发布时间：{{item.time}}</p>
						<p>{{item.text}}</p>
					</div>
				</li>
			</ul>
		</div>
  	<!-- <div class="detail_container">
  		<h3 class="detail_title">{{pageData.small_title}}</h3>
			<canvas id="liubi1" width="100" height="116"></canvas>
  		<ul class="detail_list">
  			<li v-for="(item,index) in pageData.tbArr" :title="item"><span>{{index+1}}</span>{{item}}</li>
  		</ul>
  	</div> -->
  	<more-test></more-test>
		<m-footer></m-footer>
  </div>
</template>

<script>
	import datePlugin from '../../assets/js/YD_calendar.js'
	import drawPlugin from '../../assets/js/drawProgress.js'
	import { Toast, Indicator } from 'mint-ui'
	import { parseQueryString, uuid } from '../../config/mUtils'
	import moreTest from '@components/moreTest'
	import mFooter from '@components/mFooter'
	export default {
	  components: {
			moreTest,
			mFooter
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
			if (this.typeid && this.uid) {
				this.getpageData();
			}
			// new drawPlugin.drawProg('#liubi1',{num:4.8,title:'结果具体性'})// eslint-disable-line
			// new drawPlugin.drawProg('#liubi2',{num:4.8,title:'结果具体性'})// eslint-disable-line
			// new drawPlugin.drawProg('#liubi3',{num:4.8,title:'结果具体性'})// eslint-disable-line
			new datePlugin.lCalendar('#datetime') // eslint-disable-line
	    console.log('uid:' + this.uid, 'channel:' + this.channel, 'typeid:' + this.typeid)
  	},
  	methods: {
	    initData () {
	      let _self = this
	      let getpaytime
	      let intervalTime = 5000
	      let totalintervalTime = 0
	      this.urlparams = parseQueryString(window.location.href) // 参数
	      if (this.urlparams.festival) {
	        window.location.href = 'totalTest.html'
      	}
	      if (this.urlparams.uid) {
	        localStorage.setItem('uid', this.urlparams.uid)
      	}
	      this.typeid = this.urlparams.typeid ? this.urlparams.typeid : this.typeid
	      localStorage.setItem('typeid', this.typeid);
	      if (localStorage.getItem('uid')) {
	        this.uid = localStorage.getItem('uid');
      	} else {
					let ua = window.navigator.userAgent.toLowerCase()
					if (ua.match(/MicroMessenger/i) == 'micromessenger') {
						window.location.href = 'https://www.yixueqm.com/jiance/index.php/Home-Index-getOpenid'
						return;
					} else {
						this.uid = uuid(8, 16);
						localStorage.setItem('uid', this.uid);
					}
				}

				// 获取渠道
				if (this.urlparams.channel) {
					this.channel = this.urlparams.channel;
					sessionStorage.setItem('channel', this.channel);
				} else {
					if (sessionStorage.getItem('channel') && sessionStorage.getItem('channel') != 0) {
						this.channel = sessionStorage.getItem('channel');
					}	else {
						this.channel = 0;
						sessionStorage.setItem('channel', this.channel);
					}
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
									window.location.href = `testResultDC.html?orderid=${_self.urlparams.orderid}`
								}
							})
						}
					}, intervalTime)
      	}
	    },
	    getpageData () {
	      let _self = this
	      this.$ajax.post('https://www.yixueqm.com/jiance2/index.php/Home-Index-index', {typeid: _self.typeid, uid: _self.uid}).then((response) => {
					_self.pageData = response.data
					document.title = _self.pageData.name;
					for (let i = 0; i < _self.pageData.tbArrNum.length; i++) {
						new drawPlugin.drawProg('#liubi'+(i+1),{num: _self.pageData.tbArrNum[i].number,title:_self.pageData.tbArrNum[i].name})// eslint-disable-line
					}
	        console.log(_self.pageData)
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
	        window.location.href = `https://www.yixueqm.com/jiance/index.php/Home-Index-placeOrder?username=${_self.username}&&birthday=${_self.birthday}&&sex=${_self.sex}&&typeid=${_self.typeid}&&uid=${_self.uid}&&channel=${_self.channel}&&typeXM=jiance2`
	      }, 1000)
    	}
	  }
	}
</script>

<style lang="scss" scoped>
	@import url('../../assets/css/YD_calendar.css');
	.test_container{
		// background:url('../../assets/img/test1_bj.png') no-repeat;
		background-size:100% 100%;
		min-height:100vh;
	}
	.banner{min-height: 150px;}
  // .test_slogan{
  // 	padding:30px 25px;
  // 	p{
  // 		font-size:13px;
  // 		color:#333333;
  // 		text-align: center;
  // 		margin-bottom: 30px;
  // 	}
  // 	h3{
  // 		font-size:24px;
  // 		color:#000000;
  // 		font-family:'FZYTK' !important;
  // 		text-align: center;
  // 		padding:0 18px;
  // 		font-weight:400;
  // 	}
	// }
	.h_title{
		font-size:15px;
		color:#333333;
		text-align: center;
		line-height: 1.7;
		margin-top:10px;
		margin-bottom: 15px;
		&::before{
			content:'';
			height:2px;
			width:15%;
			display: inline-block;
			vertical-align: middle;
			margin-right:5px;
			background:linear-gradient(left,#ffffff,#000000);
			background: -webkit-linear-gradient(left,#ffffff,#000000);
		}
		&::after{
			content:'';
			height:2px;
			width:15%;
			display: inline-block;
			vertical-align: middle;
			margin-left:5px;
			background:linear-gradient(right,#ffffff,#000000);
			background: -webkit-linear-gradient(right, #ffffff, #000000);
		}
	}
  .form_container{
		padding:0 10px;
  	.form_list{
			border:1px solid #FD7DA6;
			box-shadow: 0 0 5px #FD7DA6;
			border-radius: 6px;
			overflow: hidden;
  		.form_item{
  			display: flex;
  			height: 44px;
  			line-height: 44px;
  			border-radius: 3px;
				border-bottom:1px solid #cdcdcd;
				&:nth-last-child(1){border-bottom:0;}
  			.item_left{width: 25%;text-align: center;color:#333333;padding-right:15px;display: block;font-size:15px;font-weight: 700;}
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
		.price_p{
			text-align: center;
			margin-top:10px;
			font-size:12px;
			color:#333333;
			strong{
				margin-left:10px;
				span{color:#ff4243;}
			}
		}
  	.form_subimt{
  		width:100%;
  		height:45px;
			background: linear-gradient(top,#ff7575,#ff4242);
			background: -webkit-linear-gradient(top, #ff7575, #ff4242);
			box-shadow: 0 3px 0 #D02424;
  		border-radius: 6px;
  		color:#FFFFFF;
  		font-size:16px;
  		text-align: center;
  		line-height: 45px;
  		margin:10px 0;
  	}
		.readhistory{text-align: center;color:#f44c4c;display: block;text-decoration:underline;margin-top:15px;font-size:16px;}
	}
	.evalUate_container{
		padding:20px 0 15px;
		.evalUate_types{
			display: flex;
			padding:0 15px;
			justify-content: space-between;
			.evalUate_type{
				background-color:#FFFFFF;
				border-radius: 6px;
				box-shadow: 0 0 2px #f5f5f5;
			}
		}
		.evalUate_list{
			padding:0 10px;
			.evalUate_item{
				display: flex;
				padding:15px 0;
				border-bottom: 1px solid #EBEBEB;
				&:nth-last-child(1){border-bottom:0;}
				.headImg{width:30px;height:30px;border-radius: 50%;object-fit: cover;}
				.item_c{
					flex: 1;
					margin-left:14px;
					p:nth-child(1){
						font-size:13px;
						color:#a0a0a0;
					}
					p:nth-child(2){
						margin-top:3px;
						font-size:13px;
						color:#333333;
						word-break: break-all;
						word-wrap: break-word;
					}
				}
			}
		}
	}
  // .detail_container{
  // 	padding:20px 0 15px;
  // 	.detail_title{
  // 		font-size:18px;
  // 		color:#333333;
  // 		text-align: center;
  // 	}
  // 	.detail_list{
  // 		padding:15px 0 0;
  // 		li{
  // 			width:75%;
  // 			margin:0 auto 10px;
  // 			text-align: left;
  // 			padding-left:40px;
	// 			height:30px;
  // 			line-height: 30px;
  // 			background-color: #F44C4C;
  // 			color:#FFFFFF;
  // 			font-size:14px;
  // 			position: relative;
  // 			border-radius: 50px;
	// 			white-space: nowrap;
	// 			text-overflow: ellipsis;
	// 			overflow: hidden;
  // 			span{
  // 				width:28px;
  // 				height:28px;
  // 				margin:1px;
  // 				display:inline-block;
  // 				background-color:#FFFFFF;
  // 				color:#F44C4C;
  // 				position: absolute;
  // 				left:0;
  // 				text-align: center;
  // 				border-radius: 50%;
  // 			}
  // 		}
  // 		li:nth-last-child(1){margin:0 auto;}
  // 	}
  // }
</style>