<template>
  <div class="load_moreTest">
  	<ul class="moreTest_list">
  		<li class="moreTest_item" v-for="item in moreTestData" @click="navigateToEvent(item)">
  			<div class="item_l">
					<img :src="item.imgurl"/>
					<!-- <span class="ttype">主编力荐</span> -->
				</div>
  			<div class="item_c">
  				 <h4 class="ellipsis">{{item.title}}</h4>
  				 <p class="ellipsis">{{item.content}}</p>
  				 <p class="ellipsis">{{item.ccount > 9999?(item.ccount/10000)+'万':item.ccount}}人已测过</p>
  			</div>
  			<!-- <div class="item_r">开始测试</div> -->
  		</li>
  	</ul>
	<p v-show="loadshow" class="loadpromt">{{loadpromt}}</p>  
  </div>
</template>

<script>
	import { parseQueryString } from '../../config/mUtils'
export default {
  data () {
    return {
      page: 0,
      loadshow: false,
      moreTestData: [],
      throttle_B: false,
      online: 1,
      loadpromt: '加载中....'
    }
  },
  mounted () {
		localStorage.setItem('typeid', 999);
		this.urlparams = parseQueryString(window.location.href); // 参数

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
		window.addEventListener('scroll', this.Pulluploading, false)
    this.getmoreTest()
  },
  methods: {
    getmoreTest () {
      let _self = this
      this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-moreselftestsup', {page: _self.page, online: 0, typeid: localStorage.getItem('typeid')}).then((response) => {
				console.log(response.data)
				if (response.data.code) {
          let data = JSON.parse(response.data.content)
          _self.moreTestData = _self.moreTestData.concat(data)
          _self.loadshow = false
        } else {
          window.removeEventListener('scroll', _self.Pulluploading, false)
          _self.loadpromt = '没有更多了'
        }
      })
    },
    navigateToEvent (item) {
      window.location.href = item.weburi
    },
    Pulluploading () {
      var _self = this
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      var scrollHeight = document.body.scrollHeight
      var clientHeight = window.screen.height
      if (scrollHeight - clientHeight < scrollTop + 1) {
        _self.loadshow = true
        if (!_self.throttle_B) {
          setTimeout(function () {
            _self.page++
            _self.getmoreTest()
            _self.throttle_B = false
          }, 300)
          _self.throttle_B = true
        } else {
          return
        }
      }
    },
    deactivated () {
      window.removeEventListener('scroll', this.Pulluploading, false)
    }
  }
}
</script>

<style lang="scss" scoped>
	$redcolor:#F44D4D;
	.load_moreTest{
		padding:0 10px;
		background-color:#FFFFFF;
	}
	// .moreTest_container{
	// 	background-color:#FFFFFF;
	// 	padding:30px 10px;
	// }
	.moreTest_title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		h3{
			font-size:18px;
			padding-left:20px;
			background:url(../../assets/img/Featured.png) 0 55% no-repeat;
			background-size:16px;
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
				img{width:110px;height:92px;vertical-align: middle;object-fit: cover;}
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
			min-height: 92px;
			margin:0 10px;
			h4{font-size:16px;color:#333333;}
			p:nth-child(2){font-size:12px;color:#707070;margin-top:10px;}
			p:nth-child(3){
				font-size:12px;color:$redcolor;
				margin-top:20px;
				text-align: right;
				&::before{
					content: '';
					display: inline-block;
					border:6px solid transparent;
					border-left-color: $redcolor;
					// background-color:$redcolor;
					// border-radius: 50%;
					// vertical-align: middle;
					// margin-right:5px;
				}
			}
		}
		.item_r{
			flex-shrink:0;
			padding:2px 15px;
			border:1px solid $redcolor;
			border-radius: 25px;
			font-size:12px;
			color:$redcolor;
		}
	}
	.loadpromt{padding:10px;text-align: center;font-size:14px;color:#999999;}
</style>

