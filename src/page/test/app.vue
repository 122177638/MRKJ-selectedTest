<template>
  <div class="test_container" 
		:style="pageData.indexBg?'background:url('+pageData.indexBg+') no-repeat;background-size:100% 100%;':'',hasShareHD?'padding-bottom:50px':''">
  	<div class="banner">
  		<img :src="pageData.bannel_img" width="100%" :alt="pageData.name"/>
  	</div>
  	<div class="test_slogan">
  		<p>{{pageData.text1}}</p>
  		<h3>{{pageData.text2}}</h3>
  	</div>
		<div class="coupon-wrap" v-if="hasShareHD && shareData.discount != 0">
			<div class="coupon-box">
				<div class="coupon-title"><h3 class="coupon-name">{{shareData.csName}}</h3><div class="coupon-type">分享赚</div></div>
				<div class="coupon-value">
						<div class="coupon-money">
								<span class="coupon-m">￥<strong>{{shareData.price}}</strong>券后</span>
								<span class="coupon-y">原价￥{{Number(shareData.discount)+Number(shareData.price)}}</span>
								<span class="coupon-j">奖￥{{shareData.bouns}}</span>
						</div>
						<div class="coupon-ce">{{shareData.csNumber}}人已测过</div>
				</div>
				<div class="coupon-content">
						<p class="coupon-jname"><strong>{{shareData.discount}}元</strong>优惠券</p>
						<p class="coupon-time">使用期限：{{shareData.weekStart+' - '+shareData.weekEnd}}</p>
				</div>
			</div>
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
  					<span id="datetime" data-date="1985-04-18-6" data-id="birthday">请选择出生日期</span>
  					<input type="hidden" id="birthday" ref="birthdayval" />
  				</div>
  			</li>
  		</ul>
  		<div class="form_subimt" @click="startTestEvent()">立即测算</div>
			<a v-if="pageData.ispay" href="mytest.html" class="readhistory">查看我的测算记录</a>
  	</div>
  	<div class="detail_container">
  		<h3 class="detail_title">{{pageData.small_title}}</h3>
  		<ul class="detail_list">
  			<li v-for="(item,index) in pageData.tbArr" :title="item"><span>{{index+1}}</span>{{item}}</li>
  		</ul>
  	</div>
  	<more-test></more-test>
		<!-- 分享赚 -->
		<div class="shareSale-container" v-if="hasShareHD && !shareUid">
			<div class="shareSale-wrapper">
				<div :class="['shareSale-collec',{'on':isCollection}]" @click="collection()">收藏</div>
				<div class="shareSale-start" @click="startTestEvent()">领券开始测试</div>
				<div class="shareSale-share" @click="shareReward()">分享奖励</div>
			</div>
		</div>
		<div class="guize_wrap" v-if="hasShareHD && !shareUid" @click="arguEvent()"></div>
  </div>
</template>

<script>
	import datePlugin from '../../assets/js/YD_calendar.js'
	import { Toast, Indicator } from 'mint-ui'
	import { parseQueryString, uuid, payMoney135 } from '../../config/mUtils'
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
	      typeid: 11,
				channel: 0,
				isCollection: false,
				hasShareHD: false,  // 分享赚
				shareData: {},
				shareUid: ''
	    }
		},
		created () {
			this.initData()
		},
  	mounted () {
			this.getpageData();
			if (this.hasShareHD) { this.shareMoney(); }
			window.PayResultCallBack = payMoney135.PayResultCallBack; // jsonp回调
			new datePlugin.lCalendar('#datetime') // eslint-disable-line
			
	    console.log(
				'uid:' + this.uid,
				 'channel:' + this.channel, 
				 'price:' + this.price,
				 'csType:' + this.csType,
			)
			this.conuntTJ();
  	},
  	methods: {
	    initData () {
	      let _self = this;
	      let getpaytime;
	      let intervalTime = 5000;
	      let totalintervalTime = 0;
				this.urlparams = parseQueryString(window.location.href) // 参数
				// 判断是否为ios终端
				let u = navigator.userAgent;
				this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	      // 分享赚
				// typeid=11&price=48&csType=jc11&uid=2018120539434104309
				if (this.urlparams.price && this.urlparams.csType) {
					this.csType = this.urlparams.csType;
					this.price = this.urlparams.price;
					this.shareUid = this.urlparams.shareUid;
					this.hasShareHD = true;
				}
	      
	      this.typeid = this.urlparams.typeid ? this.urlparams.typeid : this.typeid
				localStorage.setItem('typeid', this.typeid)
				
				if (this.urlparams.uid) {
					this.uid = this.urlparams.uid;
	        localStorage.setItem('uid', this.urlparams.uid);
      	} else {
					if (localStorage.getItem('uid') && localStorage.getItem('uid') != '') {
						this.uid = localStorage.getItem('uid')
					} else {
						let ua = window.navigator.userAgent.toLowerCase();
						if (ua.match(/MicroMessenger/i) == 'micromessenger') {
							if (this.hasShareHD) {
								window.location.href = `https://www.yixueqm.com/jiance/index.php/Home-Index-getOpenid?typeid=${this.typeid}&csType=${this.csType}&price=${this.price}&shareUid=${this.shareUid}`
							} else {
								window.location.href = `https://www.yixueqm.com/jiance/index.php/Home-Index-getOpenid?typeid=${this.typeid}`
							}
						} else {
								this.uid = uuid(8, 16)
								localStorage.setItem('uid', this.uid)
						}
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
					_self.pageData = response.data;
					document.title = _self.pageData.name;
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
					if (_self.channel == 'qudao135') {
						_self.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-placeOrder', {
							username: _self.username,
							birthday: _self.birthday,
							sex: _self.sex,
							typeid: _self.typeid,
							uid: _self.uid,
							channel: _self.channel
						}).then(function (response) {
							var data = response.data;
							payMoney135.payMoney(data.price, data.uid, data.orderid)
						}).catch(function (e) {
							alert('qudao135支付接口错误')
						})
					} else {
						if (_self.hasShareHD) {
							window.location.href = `https://www.yixueqm.com/jiance/index.php/Home-Index-placeOrder?username=${_self.username}&&birthday=${_self.birthday}&&sex=${_self.sex}&&typeid=${_self.typeid}&&uid=${_self.uid}&&channel=${_self.channel}&&price=${_self.shareData.price}&&shareUid=${_self.urlparams.shareUid}`
						} else {
							window.location.href = `https://www.yixueqm.com/jiance/index.php/Home-Index-placeOrder?username=${_self.username}&&birthday=${_self.birthday}&&sex=${_self.sex}&&typeid=${_self.typeid}&&uid=${_self.uid}&&channel=${_self.channel}`
						}
					}
	      }, 1000)
			},
			shareMoney () {
				this.$ajax.post('https://www.yixueqm.com/zhiming/index.php/Home-share-shareZhuan', {uid: this.uid, csType: this.csType})
				.then((response) => {
					this.shareData = response.data;
					this.isCollection = this.shareData.collection;
					console.log(this.shareData)
				})
			},
			collection () {
				this.isCollection = !this.isCollection;
				if (this.isCollection) {
					this.$ajax.post('https://www.yixueqm.com/zhiming/index.php/Home-share-addCollection', {uid: this.uid, csType: this.csType})
					.then((response) => {
						if (response.data === 1) Toast('收藏成功'); 
					})
				} else {
					this.$ajax.post('https://www.yixueqm.com/zhiming/index.php/Home-share-deleteCollection', {uid: this.uid, csType: this.csType})
					.then((response) => {
						if (response.data === 1) Toast('取消收藏');
					})
				}
			},
			shareReward () {
				this.$ajax.post('https://www.yixueqm.com/zhiming/index.php/Home-share-shareCode', {uid: this.uid, csType: this.csType})
				.then((response) => {
					let strJson = JSON.stringify(response.data);
					if (this.isiOS) {
						window.webkit.messageHandlers.earnshare.postMessage(strJson); // eslint-disable-line
					} else {
						android.earnshare(strJson); // eslint-disable-line
					}
				})
			},
			arguEvent () {
				if (this.isiOS) {
					window.webkit.messageHandlers.toActivity.postMessage('sm://sm.mrkj.com/me/shareearn'); // eslint-disable-line
				} else {
					android.toActivity('sm://sm.mrkj.com/me/shareearn') // eslint-disable-line
				}
			},
			conuntTJ () {
				let _self = this;
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
				console.log(firstOpen)
				this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-cnzz_pvuv', {channel: _self.channel, typeid: _self.typeid, typeXM: 'jiance', loginNum: firstOpen}).then((response) => {
				})
				this.$ajax.post('https://hy.yixueqm.com/zhiming/index.php/Home-Interface-remain', {channel: _self.channel, nickName: '简测', typeName: 'JC' + _self.typeid, uid: _self.uid}).then((response) => {
					console.log(response)
				})
			}
	  }
	}
</script>

<style lang="scss">
	@import url('../../assets/css/YD_calendar.css');
  @font-face {
    font-family: 'FZYTK';
    src: url('../../assets/fonts/FZYTK.ttf');
	}
	.test_container{
		background-size:cover;
		min-height:100vh;
	}
	.banner{min-height: 150px;}
  .test_slogan{
  	padding:30px 25px 20px;
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

	.shareSale-container{
    position:fixed;
    width:100%;
    bottom:0;
    left:0;
		.shareSale-wrapper{
			display: flex;
			display:-webkit-box;
			-webkit-box-align: center;
			align-items:center;
			text-align:center;
			background-color:#ffffff;
			.shareSale-collec{
				width:63px;
				padding-top:27.5px;
				box-sizing: border-box;
				height:50px;
				font-size:12px;
				color:#333333;
				background:url('../../assets/img/fxzq_wsc.png') #f2f2f2 center 8px / 18px 18px no-repeat;
				text-align:center;
			}
			.shareSale-collec.on{
				background:url('../../assets/img/fxzq_ysc.png') #f2f2f2 center 8px / 18px 18px no-repeat;
			}
			.shareSale-start{
				flex:1;
				-webkit-box-flex:1;
				width:100%;
				background-color:#f48d1d;
				color:#ffffff;
				font-size:18px;
				height:50px;
				line-height:50px;
			}
			.shareSale-share{
				height:50px;
				flex:1;
				-webkit-box-flex:1;
				width:100%;
				color:#ffffff;
				line-height:50px;
				background-color:#5a3004;
				font-size:18px;
			}
		}
  }
  .guize_wrap{
    width:80px;
    height:30px;
    background:url('../../assets/img/fxzq_fygz.png') 0% 0% / 100% 100% no-repeat;
    position: fixed;
    right:0;
    bottom:70px;
  }
	.coupon-wrap{margin:0 10px 20px;border: 1px solid #eaeaea;border-radius: 5px;box-shadow: 0 0 5px #cccccc;}
	.coupon-box{padding:15px;}
	.coupon-title{ display: flex;}
	.coupon-name{font-size:18px;color:#333333;font-weight:bold;}
	.coupon-type{
			width:50px;
			height:20px;
			line-height:20px;
			text-align:center;
			border-radius:35px 35px 35px 0;
			background-color:#FF9800;
			font-size:12px;
			color:#ffffff;
			display:inline-block;
			font-weight: normal;
	}
	.coupon-value{
			display: flex;
			justify-content:space-between;
			align-items:center;
			margin:5px;
	}
	.coupon-money{}
	.coupon-m{font-size:12px;color:#f44d4d;}
	.coupon-m strong{font-weight:bold;font-size:20px;}
	.coupon-y{text-decoration:line-through;font-size:12px;color:#999999;}
	.coupon-j{
			width:62.5px;
			height:20px;
			line-height:20px;
			text-align:center;
			font-size:12px;
			color:#ffffff;
			display: inline-block;
			background:url('../../assets/img/fxzq_jiang01.png') 0% 0% /100% 100% no-repeat;
	}
	.coupon-ce{font-size:12px;color:#999999;}
	.coupon-content{
			width:326px;
			height:56px;
			margin:0 auto;
			background:url('../../assets/img/fxzq_yhq.png') 0% 0% /100% 100% no-repeat;
			padding-right:62.5px;
			box-sizing:border-box;
			display: flex;
			flex-direction:column;
			text-align: center;
			justify-content: center;
	}
	.coupon-content .coupon-jname{font-size:13px;color:#333333;}
	.coupon-content .coupon-jname strong{font-size:18px; color:#333333;font-weight:bold;}
	.coupon-content .coupon-time{font-size:10px;color:#333333}
</style>