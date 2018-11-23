<template>
    <div id="home">
        <header class="index_header">
			<div class="hlist">
				<img src="../assets/images/rexiao.png" />
				<p>热销榜</p>
			</div>
			
			<div class="hlist">
				<img src="../assets/images/caidan.png" />
				<p>点过的菜</p>
			</div>
			
			<div class="hlist">
				<img src="../assets/images/sousuo.png" />
				<p>搜你喜欢</p>
			</div>
		</header>
		<aside class="left_cate" id="left_cate">
			<ul>
				<li v-for="(item,key) in list" @click="selectItem(key)">{{item.title}}</li>
			</ul>
			<div id="nav_cate" class="nav_cate">
				<img src="../assets/images/nav.png" />
				<p>菜单</p>
			</div>
		</aside>
		
		
		<div class="content">
			
			<div class="item" v-for="(item,key) in list">
				<h3 class="item_cate">{{item.title}}</h3>
				<ul class="item_list">
					<li v-for="(val,key) in item.list">
                        <div class="inner">
                            <router-link :to="'pcontent/?id='+val._id">
                                <img :src="api+val.img_url" />
                                <p class="title">{{val.title}}</p>
                                <p class="price">¥{{val.price}}</p>
                            </router-link>
                        </div>
					</li>
				</ul>
			</div>
		</div>
		
		<div class="bg" id="bg"></div>

        <v-navfooter></v-navfooter>
		
		<div class="footer_cart">
            <router-link to="/cart">
                <img src="../assets/images/cart.png" />
                <p>购物车</p>
                <span class="num" v-if="cartNum">{{cartNum}}</span>
            </router-link>
		</div>

    </div>
</template>

<script>
import storage from '../model/storage.js'
//引入底部组件/导航-购物车
import NavFooter from './public/NavFooter.vue'
//引入配置文件
import Config from '../model/config.js'
export default {
    data(){
        return{
            list:[],
            api:Config.api,
            cartNum:0,
        }
    },
    sockets:{//接收服务器广播过来的addcart
        addcart:function(){
            //更新服务器的数量
            this.getCartNum();
        }
    },
    methods:{
        // 侧边栏的点击出现，点击消失
        
        navClick(){
            window.onload = function(){
				var navCate = document.getElementById("nav_cate");
				var leftCate = document.getElementById("left_cate");
				var bg = document.getElementById("bg");
				var flag = true;
				bg.onclick=navCate.onclick = function(){
					if(flag){
						flag = false;
						leftCate.style.transform = 'translate(0,0)';
						bg.style.display="block";
					}else{
						flag = true;
						leftCate.style.transform = 'translate(-100%,0)';
						bg.style.display="none";
					}
					
				}
				
			}
        },
        //请求菜品信息
        requestData(){
            var api = this.api+'api/productlist';
            this.$http.get(api).then((response)=>{
                    // console.log(response);
                    this.list = response.body.result;
            },(err)=>{
                alert('数据请求失败了');

            })
        },
        selectItem(key){
            // alert(key)
            var title = document.querySelectorAll('.item_cate');
            document.documentElement.scrollTop = title[key].offsetTop;
            var leftCate = document.getElementById("left_cate");
            var bg = document.getElementById("bg");
            leftCate.style.transform = 'translate(-100%,0)';
			bg.style.display="none";
        },
        getCartNum(){
            var uid = storage.get('roomid');
            var api = this.api+'api/cartCount?uid='+uid;
            this.$http.get(api).then((response)=>{
                // console.log(response)
                this.cartNum = response.body.result;
            },(err)=>{
                alert('请求失败了')
            })
        }

    },
    components:{
        'v-navfooter':NavFooter
    },
    mounted(){
        this.navClick();
        this.requestData();
        this.getCartNum();
    }
}
</script>

<style lang="scss">
.index_header {
    width: 96%;
    height: 4.4rem;
    display: flex;
    margin: 0 auto;
    background: #fff;
    margin-top: 1rem;
    border-radius: .5rem;
    .hlist {
        flex: 1;
        text-align: center;
        padding-top: .2rem;
        border-right: 1px solid #eee;
        img {
            height: 2rem;
            width: 2rem;
        }
        &:last-child {
            border-right: none;
        }
    }
}

.content {
    .item {
        .item_cate {
            text-align: center;
            padding: .5rem;
        }
        .item_list {
            display: flex;
            flex-wrap: wrap;
            padding: 0 .5rem;
            //自动换行
            li {
                width: 33.3%;
                padding: .5rem;
                box-sizing: border-box;
                .inner {
                    border-radius: .5rem;
                    background: #fff;
                    width: 100%;
                    overflow: hidden;
                    a{
                        color: #666;
                        text-decoration: none;
                    }
                    img {
                        width: 100%;
                        height: 8rem;
                    }
                    p {
                        padding: .2rem .5rem;
                    }
                    .title {
                        font-weight: bold;
                    }
                }
            }
        }
    }
}
//侧边栏
.left_cate{
    //css3 运动  加过度效果
    transition: all .5s; 
    transform: translate(-100%,0);
    width: 6rem;
    height: 100%;
    position: fixed;
    background: #eee;
    top: 0;
    left: 0;
    z-index: 2;
    ul{
        padding: .5rem;
        position: absolute;
        height: 100%;
        z-index: 3;
        background: #eee;
        li{
            line-height: 4.4rem;
        }
        
    }
    .nav_cate{
        position: absolute;
        right: -3.2rem;
        background: rgba(132,128,128,0.9);
        top: 42%;
        width: 5rem;
        height: 4rem;
        text-align: center;
        border-radius: 0 50% 50% 0;
        z-index: 2;
        img{
            height: 1.8rem;
            width: 1.8rem;
            margin-left: 1rem;
            margin-top: .5rem;
        }
        p{
            color: #fff;
            margin-left: 1rem;
            margin-top: -.3rem;
        }
    }
}
.bg{
    height: 100%;
    width: 100%;
    position: fixed;
    background: rgba(132,128,128,0.4);
    left: 0;
    top: 0;
    z-index: 1;
    display: none;
}
//首页导航

//底部导航
.footer_nav{
    height: 4.4rem;
    width: 4.4rem;
    background: #000;
    position: fixed;
    color: #fff;
    bottom: .5rem;
    text-align: center;
    border-radius: 50%;
    left: .5rem;
    img{
        width: 1.8rem;
        height: 1.8rem;
        margin-top: .4rem;
    }
    p{
        position: relative;
        top: -.2rem;
    }
}
//底部导航弹出层
.footer_nav_show{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.6);
    z-index: 2;
    .list{
        
        li{
            height: 4.4rem;
            width: 4.4rem;
            background: #000;
            position: fixed;
            color: #fff;
            position: absolute;
            text-align: center;
            border-radius: 50%;
            left: .5rem;
            img{
                width: 1.8rem;
                height: 1.8rem;
                margin-top: .4rem;
            }
            p{
                position: relative;
                top: -.2rem;
                font-size: 1rem;
            }
            &:nth-child(1){
                bottom: 17.4rem;
                left: .5rem;
            }
            &:nth-child(2){
                bottom: 14rem;
                left: 22%;
            }
            &:nth-child(3){
                bottom: 8rem;
                left: 39%;
            }
            &:nth-child(4){
                bottom: .5rem;
                left: 50%;
            }
            &:nth-child(5){
                bottom: .5rem;
                left: .5rem;
            }
        }
    }
}



.footer_cart{
    height: 4.4rem;
    width: 4.4rem;
    background: red;
    position: fixed;
    z-index: 1;
    color: #fff;
    bottom: .5rem;
    text-align: center;
    border-radius: 50%;
    right: .5rem;
    img{
        width: 1.8rem;
        height: 1.8rem;
        margin-top: .4rem;
    }
    p{
        position: relative;
        top: -.2rem;
    }
    a{
        color: #fff;
    }
}

</style>
