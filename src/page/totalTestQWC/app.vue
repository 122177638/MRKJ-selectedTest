<template>
  <div class="load_moreTest">

		<div class="more_top">
			<div class="more_top_t" @click="navigateToEvent(topTestData[0])"><img :src="topTestData[0].index_img" width="100%" alt=""></div>
			<div class="more_top_box">
				<div class="more_top_item" 
				v-for="(item,index) in topTestData" 
				v-if="index > 0" 
				:style="'background:url('+item.qwc_bg+') 0% 0% / 100% 100% no-repeat;'" 
				:key="item.typeid"
				@click="navigateToEvent(item)">
					<div class="item_top">
						<div class="item_type">{{item.qwc_name}}</div>
						<img :src="item.index_img" class="item_img" alt="">
					</div>
					<div class="item_warp">{{item.name}}</div>
				</div>
			</div>
		</div>

		<div class="more_wrap">
			<div class="moreTest_title"><h3 >更多测试</h3></div>
			<ul class="moreTest_list">
				<li class="moreTest_item" v-for="item in moreTestData" @click="navigateToEvent(item)" :key="item.typeid">
					<div class="item_l">
						<img :src="item.index_img"/>
						<!-- <span class="ttype">主编力荐</span> -->
					</div>
					<div class="item_c">
						<h4 class="ellipsis">{{item.name}}</h4>
						<p class="ellipsis">{{item.text}}</p>
						<!-- <p class="ellipsis">{{item.ccount > 9999?(item.ccount/10000)+'万':item.ccount}}人已测过</p> -->
					</div>
					<div class="item_r">测试</div>
				</li>
			</ul>
		</div>
		<p class="loadpromt">{{loadpromt}}</p>
  </div>
</template>

<script>
import { parseQueryString, uuid } from '../../config/mUtils'
export default {
  data () {
    return {
      page: 0,
			loadshow: false,
			topTestData: [
				{index_img: ''}
			],
			moreTestData: [],
      throttle_B: false,
      online: 1,
			loadpromt: '没有更多了',
			channel: 0,
			uid: ''
    }
  },
  mounted () {
    // localStorage.setItem('typeid', 999);
		// window.addEventListener('scroll', this.Pulluploading, false);

		this.urlparams = parseQueryString(window.location.href) // 参数

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
								window.location.href = 'https://www.yixueqm.com/jiance/index.php/Home-Index-getOpenid?typeXM=jiance2qZH&typeid=' + this.typeid + '&channel=' + this.channel;
						} else {
								this.uid = uuid(8, 16)
								localStorage.setItem('uid', this.uid)
						}
				}
		}
		if (this.uid) {
			this.getmoreTest();
			this.currYoumeng();
		}
  },
  methods: {
    getmoreTest () {
      let _self = this;
      this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-qwc_index').then((response) => {
				console.log(response)
				_self.topTestData = response.data.slice(0, 5);
				_self.moreTestData = response.data.slice(5);
        // if (response.data.code) {
        //   let data = JSON.parse(response.data.content);
        //   console.log(data);
        //   _self.moreTestData = _self.moreTestData.concat(data);
        //   _self.loadshow = false;
        // } else {
        //   window.removeEventListener('scroll', _self.Pulluploading, false)
        //   _self.loadpromt = '没有更多了'
        // }
      })
		},
		currYoumeng () {
				var _self = this;
				this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-cnzzID', {channel: _self.channel, typeid: 0, typeXM: 'jiance2q'}).then((response) => {
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
				this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-cnzz_pvuv', {channel: _self.channel, typeid: 0, typeXM: 'jiance2q'}).then((response) => {
				})
		},
    navigateToEvent (item) {
			window.location.href = item.url;
    }
    // Pulluploading () {
    //   var _self = this
    //   var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //   var scrollHeight = document.body.scrollHeight;
    //   var clientHeight = window.screen.height;
    //   if (scrollHeight - clientHeight < scrollTop + 1) {
    //     _self.loadshow = true
    //     if (!_self.throttle_B) {
    //       setTimeout(function () {
    //         _self.page++;
    //         _self.getmoreTest();
    //         _self.throttle_B = false;
    //       }, 300)
    //       _self.throttle_B = true;
    //     } else {
    //       return
    //     }
    //   }
    // },
    // deactivated () {
    //   window.removeEventListener('scroll', this.Pulluploading, false)
    // }
  }
}
</script>

<style lang="scss" scoped>
	$redcolor:#F04F41;
	.load_moreTest{
		background-color:#FFFFFF;
	}
	.more_top{
		min-height:390px;
		.more_top_box{
			padding:10px;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.more_top_item{
				width: 175px;
				height:118px;
				overflow: hidden;
				margin-bottom: 5px;
				&:nth-last-child(1){	margin-bottom:0px;}
				&:nth-last-child(2){	margin-bottom:0px;}
				&:nth-child(1){
					.item_top{
						.item_type{
							color:#f14f4d;
							border-color: #f14f4d;
						}
					}
				}
				&:nth-child(2){
					.item_top{
						.item_type{
							color:#f3872b;
							border-color: #f3872b;
						}
					}
				}
				&:nth-child(3){
					.item_top{
						.item_type{
							color:#429eef;
							border-color: #429eef;
						}					
					}
				}
				&:nth-child(4){
					.item_top{
						.item_type{
							color:#f9cd00;
							border-color: #f9cd00;
						}
					}
				}
				.item_top{
					overflow: hidden;
					.item_type{
						font-size:13px;
						font-weight: bold;
						color:#f14f4d;
						float: left;
						margin:10px;
						padding:0 6px;
						border-radius: 6px 0 6px 0;
						border:1px solid #f14f4d;
					}
					.item_img{
						float: right;
						width:88px;
						height:66px;
					}
				}
				.item_warp{
					font-size:16px;
					color:#333333;
					padding:0 10px;
					font-weight: bold;
				}
			}
		}
	}
	
	.more_wrap{padding:0 10px;border-top:5px solid #F5F5F5;}
	// .moreTest_container{
	// 	background-color:#FFFFFF;
	// 	padding:30px 10px;
	// }
	.moreTest_title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding:20px 0 5px 0;
		h3{
			font-size:18px;
			padding-left:12px;
			color:#333333;
			// background:url(../../assets/img/Featured.png) 0 55% no-repeat;
			// background-size:16px;
			position: relative;
			&::before{
				content:'';
				width:3px;
				height:15px;
				background-color:$redcolor;
				position: absolute;
				left:0;
				top:50%;
				margin-top:-7.5px;
			}
		}
		p{font-size:15px;color:#999999;}
	}
	.moreTest_list{
		.moreTest_item{
			padding:15px 0;
			display: flex;
			align-items: center;
			position:relative;
			&::before{
				content: '';
				display: inline-block;
				width:100%;
				height:1px;
				background-color:#f3f3f3;
				position: absolute;
				right:0;
				bottom:0;
			}
			&:nth-last-child(1)::before{
				background-color:transparent;
			}
			.item_l{
				position: relative;
				border-radius: 6px;
				flex-shrink: 0;
				overflow: hidden;
				img{width:60px;height:50px;vertical-align: middle;object-fit: cover;}
				.ttype{
					position: absolute;
					width: 100%;
					bottom:0;
					left:0;
					text-align: center;
					color:#FFFFFF;
					background-color:$redcolor;
					font-size:12px;
				}
			}
		}
		.item_c{
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			margin:0 10px;
			h4{font-size:16px;color:#333333;}
			p:nth-child(2){font-size:12px;color:#707070;margin-top:10px;}
			// p:nth-child(3){
			// 	font-size:12px;color:$redcolor;
			// 	margin-top:20px;
			// 	text-align: right;
			// 	&::before{
			// 		content: '';
			// 		display: inline-block;
			// 		border:6px solid transparent;
			// 		border-left-color: $redcolor;
			// 		// background-color:$redcolor;
			// 		// border-radius: 50%;
			// 		// vertical-align: middle;
			// 		// margin-right:5px;
			// 	}
			// }
		}
		.item_r{
			width: 50px;
			height:25px;
			line-height: 25px;
			text-align: center;
			flex-shrink:0;
			border:1px solid $redcolor;
			border-radius:6px;
			font-size:12px;
			color:$redcolor;
			&::after{
				content:'';
				display: inline-block;
				border:4px solid transparent;
				border-left-color:$redcolor; 
				margin-left:4px;
			}
		}
	}
	.loadpromt{padding:10px;text-align: center;font-size:14px;color:#999999;}
</style>

