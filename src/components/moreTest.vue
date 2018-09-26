<template>
  <div :class="islist?'load_moreTest':'moreTest_container'" v-if="moreTestData != ''">
  	<div class="moreTest_title" v-if="!islist"><h3>更多测评</h3><p @click="navigateTomorepage()">查看全部</p></div>
  	<ul class="moreTest_list">
  		<li class="moreTest_item" v-for="item in moreTestData" @click="navigateToEvent(item)">
  			<div class="item_l"><img :src="item.imgurl"/><span class="ttype">主编力荐</span></div>
  			<div class="item_c">
  				 <h4 class="ellipsis">{{item.title}}</h4>
  				 <p class="ellipsis">{{item.content}}</p>
  				 <p class="ellipsis">{{item.ccount > 9999?(item.ccount/10000)+'万':item.ccount}}人已测过</p>
  			</div>
  			<div class="item_r">开始测试</div>
  		</li>
  	</ul>
	<p v-if="islist" v-show="loadshow" class="loadpromt">{{loadpromt}}</p>  
  </div>
</template>

<script>
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
  props: ['islist'],
  mounted () {
    if (this.islist) {
      this.online = 0
      window.addEventListener('scroll', this.Pulluploading, false)
    }
    this.getmoreTest()
  },
  methods: {
    getmoreTest () {
      let _self = this
      this.$ajax.post('https://www.yixueqm.com/jiance/index.php/Home-Index-moreselftestsup', {page: _self.page, online: _self.online, typeid: localStorage.getItem('typeid')}).then((response) => {
        if (response.data.code) {
          let data = JSON.parse(response.data.content)
          _self.moreTestData = _self.moreTestData.concat(data)
          _self.loadshow = false
          if (document.body.scrollHeight < window.screen.height) {
            _self.loadshow = true
            window.removeEventListener('scroll', _self.Pulluploading, false)
            _self.loadpromt = '没有更多了'
          }
        } else {
          window.removeEventListener('scroll', _self.Pulluploading, false)
          _self.loadpromt = '没有更多了'
        }
      })
    },
    navigateToEvent (item) {
      window.location.href = item.weburi
    },
    navigateTomorepage () {
      window.location.href = 'totalTest.html'
    },
	// 上拉加载
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
    }
  }
}
</script>

<style lang="scss">
	$redcolor:#F44D4D;
	.load_moreTest{
		padding:0 10px;
		background-color:#FFFFFF;
	}
	.moreTest_container{
		background-color:#FFFFFF;
		padding:30px 10px;
	}
	
	.moreTest_title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		h3{
			font-size:18px;
			padding-left:20px;
			background:url(../assets/img/Featured.png) 0 55% no-repeat;
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
				width:calc(100% - 80px);
				height:1px;
				background-color:#E1E1E1;
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
				img{width:70px;height:70px;vertical-align: middle;}
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
			overflow: hidden;
			margin:0 10px;
			h4{font-size:15px;color:#333333;}
			p:nth-child(2){font-size:12px;color:#999999;}
			p:nth-child(3){
				font-size:12px;color:$redcolor;
				margin-top:10px;
				&::before{
					content: '';
					width:5px;
					height:5px;
					display: inline-block;
					background-color:$redcolor;
					border-radius: 50%;
					vertical-align: middle;
					margin-right:5px;
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
