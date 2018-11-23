<template>
    <div id="order">
        <div class="order_content">
			
			<div class="order_info">
				<div class="order_top">	
					<img src="../assets/images/timer.png" />
					<div class="order_info_right">
						<h2>118号桌待门店接单</h2>
						<p>请及时联系服务员确认以点菜品信息！</p>
					</div>
				</div>
				<h3>以点菜品{{list.total_num}}份，合计：<span class="price">{{list.total_price}}元</span></h3>
			</div>
			<!--菜品详情-->
			<div class="order_list">	
				<h3>菜品详情</h3>
				<ul class="list">
					<li v-for="item in list.items">
						<div class="title">{{item.title}}</div>
						<div class="num">{{item.num}}份</div>
						<div class="price">{{item.price}}元</div>
					</li>
				</ul>
			</div>
		</div>
        <v-navfooter></v-navfooter>
		
		<div id="footer_book" class="footer_book" style="left:auto;right:.5rem;">
            <router-link to="/home">
                <img src="../assets/images/menu.png" />
			    <p>菜单</p>
            </router-link>
		</div>
    </div>
</template>

<script>
import NavFooter from './public/NavFooter.vue'
import Config from '../model/config.js'
import storage from '../model/storage.js'
export default {
    data(){
        return{
            api:Config.api,
            list:[],
        }
    },
    components:{
        'v-navfooter':NavFooter
    },
    methods:{
        getOrder(){
            var uid = storage.get('roomid');
            var api = this.api+'api/getOrder?uid='+uid;
            this.$http.get(api).then((response)=>{
                console.log(response);
                this.list = response.body.result[0];
            },(er)=>{
                
            })
        }
    },
    mounted(){
        this.getOrder();
    }
}
</script>

<style lang="scss">
.order_content{
    padding: 1rem;
    .order_info{
        background: #fff;
        border-radius: .5rem;
        .order_top{
            display: flex;
            img{
                width: 5.6rem;
                height: 5.6rem;
            }
            .order_info_right{
                flex: 1;
                padding-top: .5rem;
                
            }
        }
        h3{
            line-height: 2rem;
            padding: .5rem;
            .price{
                color: red;
                font-size: 2rem;
            }
        }
        
    }
    //订单列表
    .order_list{
        background: #fff;
        border-radius: .5rem;
        margin-top: 1rem;
        padding: .5rem;
        h3{
            line-height: 2rem;
            
        }
        .list{
            li{
                display: flex;
                line-height: 2rem;
                padding: .5rem 0 ;
                .title{
                    flex: 2;
                }   
                .num{
                    flex: 1;
                    text-align: center;
                }
                .price{
                    flex: 1;
                    text-align: center;
                }
            }
        }
    }
    
    //支付页面
    
    .order_pay{
        background: #fff;
        border-radius: .5rem;
        //已经下单的菜
        h3{
            padding: .5rem;
            font-size: 2rem;
            text-align: center;
            padding: 2rem 0 0.5rem 0;
        }
        .order_pay_detail{
            display: flex;
            line-height: 2rem;
            border-bottom: 1px solid #eee;
            padding: .5rem;
            //桌号
            .d_num{
                flex: 1;
            }
            //人数
            .p_num{
                flex: 1;   
            }
            //下单时间
            .order_time{
                flex: 1;
            }
        }
        //价格与按钮付款
        .order_pay_info{
            line-height: 2rem;
            display: flex;
            margin: 1rem 0;
            padding: .5rem;
            .price_list{
                flex: 1;
                //价格
                .price{
                    font-size: 2rem;
                    color: red;
                }
                
            }
            //立即付款
            .pay_button{
                width: 10rem;
                border-radius:.5rem ;
                height: 2.6rem;
                background: red;
                color: #fff;
                text-align: center;
                line-height: 2.6rem;
                position: relative;
            }
            
        }
        
    }
    
}

</style>
