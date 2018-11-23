<template>
    <div id="cart">
        <div class="cart_content">
			<!--头部信息-->
			<div class="cart_info" v-if="allPrice">
				<h2>购物车</h2>
				<div class="p_number">
					<div class="p_number_left">
						<p>用餐人数:{{list1.p_num}}</p>
						<p>备注:{{list1.p_mark}}</p>
					</div>
					<div class="p_number_right">
                        <router-link to="/startamenddata">
                            <img src="../assets/images/edit.png" />
					    	<p>修改</p>
                        </router-link>
					</div>
				</div>
				<div class="cart_num">
					<p>购物车中总共有{{allFoodNum}}个菜</p>
					<p>合计:<span class="price">￥{{allPrice}}</span></p>
				</div>
			</div>
			
			<div class="cart_list" v-if="allPrice">
				<ul>
					<li class="item" v-for="(item,key) in list">
						<div class="left_food">
							<img :src="api+item.img_url" />
							<div class="food_info">
								<p>{{item.title}}</p>
								<p class="price">￥{{item.price}}</p>
							</div>
						</div>
						
						<div class="right_cart">
							<div class="cart_num">
					          <div class="input_left" @click="decNum(item,key)">-</div>
					          <div class="input_center">
					              <input type="text"  readonly="readonly" v-model="item.num" name="num" id="num" />
					          </div>
					          <div class="input_right" @click="addNum(item)">+</div>				      
					        </div>			
						</div>
					</li>
					
				</ul>
			</div>
			<!--顾客最常点的菜  -->
			<div class="hot_food">
				<h3>本店顾客最常点的菜</h3>
				
				<div class="item_list_outer">
					<ul class="item_list">
						<li>
							<div class="inner">
								<img src="../assets/images/1.jpg" />
								<p class="title">大蒜腊肉</p>
								<p class="price">￥26</p>
							</div>
						</li>
						
						<li>
							<div class="inner">
								<img src="../assets/images/2.jpg" />
								<p class="title">大蒜腊肉</p>
								<p class="price">￥26</p>
							</div>
						</li>
						
						<li>
							<div class="inner">
								<img src="../assets/images/3.jpg" />
								<p class="title">大蒜腊肉</p>
								<p class="price">￥26</p>
							</div>
						</li>
						
						<li>
							<div class="inner">
								<img src="../assets/images/4.jpg" />
								<p class="title">大蒜腊肉</p>
								<p class="price">￥26</p>
							</div>
						</li>
					</ul>
				</div>
			</div>	
            
		</div>
		<!-- 购物车空空的 -->
        <div class="cart_empty" v-if="!allPrice"><h3>您的购物车空空的，请点击开始点菜</h3></div>
		
		
		<!--底部导航-->
		<v-navfooter></v-navfooter>
		
		<div id="footer_book" class="footer_book">
            <router-link to="/home">
                <img src="../assets/images/menu.png" />
			    <p>菜单</p>
            </router-link>
		</div>
		
		<div @click="addOrder()" id="footer_cart" class="footer_cart">
			<img src="../assets/images/cart.png" />
			<p>下单</p>
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
            list1:[],
            allPrice:0,
            allFoodNum:0,
        }
    },
    sockets:{//接收服务器广播过来的addcart
        addcart:function(){
            //重新获取购物车的数据
            this.requestData();
        }
    },
    methods:{
        //请求菜品信息
        requestData(){
            var uid = storage.get('roomid');
            var api = this.api+'api/cartlist?uid='+uid;
            this.$http.get(api).then((response)=>{
                // console.log(response);
                this.list=response.body.result;
                this.imputedPrice();
            },(err)=>{
                alert('请求失败了');
            })
        },
        //减少人数
        decNum(item,key){
            var uid = storage.get('roomid');
            var api = this.api+'api/decCart?uid='+uid+'&product_id='+item.product_id+'&num='+item.num;
            this.$http.get(api).then((response)=>{
                    // console.log(response);
                    //修改购物车数据的时候给服务器发消息 
                    this.$socket.emit('addcart','addcart');
                    this.imputedPrice();
                },(err)=>{
                    alert('请求数据失败');
            })
            if(item.num>1){
                --item.num;
            }else{
                this.list.splice(key,1);
            }
        },
        //增加人数
        addNum(item){
            var uid = storage.get('roomid');
            var api = this.api+'api/incCart?uid='+uid+'&product_id='+item.product_id+'&num='+item.num;
            this.$http.get(api).then((response)=>{
                    // console.log(response);
                     //修改购物车数据的时候给服务器发消息 
                    this.$socket.emit('addcart','addcart');
                    this.imputedPrice();
                },(err)=>{
                    alert('请求数据失败');
            })  
            ++item.num;
        },
        //获取用餐信息
        getPeopleNum(){
            var uid = storage.get('roomid');
            var api = this.api+'api/peopleInfoList?uid='+uid;
            this.$http.get(api).then((response)=>{
                // console.log(response);
                this.list1 = response.body.result[0];
                this.p_mark = this.list1.p_mark;
            },(err)=>{
                alert('请求数据失败了');
            })
        },
        //计算总价格
        imputedPrice(){
            var allPrice=0;
            var allFoodNum=0;
            for(var i=0;i<this.list.length;i++){
                allPrice+=parseFloat(this.list[i].price*this.list[i].num);
                allFoodNum+=parseInt(this.list[i].num);
            }
            this.allPrice = allPrice;
            this.allFoodNum = allFoodNum;
        },
        //提交订单
        addOrder(){
            var uid = storage.get('roomid');
            var p_num = this.list1.p_num;
            var p_mark =  this.list1.p_mark;
            var total_price = this.allPrice;
            var total_num = this.allFoodNum;
            var order = JSON.stringify(this.list); //数组 把json对象 转化成json字符串
        //   console.log({
        //         uid,
        //         p_num,
        //         p_mark,
        //         total_price,
        //         total_num,
        //         order
        //   });
            var api = this.api+'api/addOrder';
            this.$http.post(api,{
                uid,
                p_num,
                p_mark,
                total_price,
                total_num,
                order
            }).then((response)=>{
                // console.log(response);
                if(response.body.success){
                    this.$router.push({path:'/order'});
                }else{
                    alert('提交数据有误');
                }
            },(err)=>{

            })


        }
    },
    mounted(){
        this.requestData();
        this.getPeopleNum();
        this.imputedPrice();
    },
    components:{
        'v-navfooter':NavFooter
    }
    
}
</script>

<style lang="scss">
.cart_content {
    padding: 1rem;
    //头部信息
    .cart_info {
        background: #fff;
        border-radius: .5rem;
        padding: .5rem;
        h2 {
            text-align: center;
            font-size: 1.8rem;
            padding: .8rem 0;
            border-bottom: 1px solid #eee;
        }
        .p_number {
            display: flex;
            padding: .5rem 0;
            border-bottom: 1px solid #eee;
            .p_number_left {
                flex: 1;
                p {
                    line-height: 2rem;
                    &:first-child {
                        color: red;
                    }
                }
            }
            .p_number_right {
                width: 4rem;
                height: 4rem;
                text-align: center;
                img {
                    height: 1.8rem;
                    width: 1.8rem;
                    margin: 0 auto;
                }
                a{
                    color: #666;
                }
            }
        }
        //购物车数量
        .cart_num {
            border-bottom: 1px solid #eee;
            p {
                line-height: 2rem;
                .price {
                    font-size: 2.4rem;
                    color: red;
                }
            }
        }
    }
    //购物车列表
    .cart_list {
        padding: .5rem;
        background: #fff;
        border-radius: .5rem;
        margin-top: 1rem;
        .item {
            display: flex;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
            //左侧商品信息
            .left_food {
                flex: 1;
                display: flex;
                img{
                    width: 4rem;
                    height: 4rem;
                    border-radius: 10%;
                    margin-right: .8rem;
                }
                .food_info{
                    flex: 1;
                 }
            }
            //右侧商品加减数量
            .right_cart {
                width: 10rem;
                
                //数量加减
                .cart_num {
                    width: 10rem;
                    display: flex;
                    margin-top: .8rem;
                    .input_left,
                    .input_right {
                        flex: 1;
                        width: 2.8rem;
                        height: 2.8rem;
                        line-height: 2.8rem;
                        text-align: center;
                        color: red;
                        border: 1px solid #eee;
                        font-size: 2.4rem;
                    }
                    .input_center {
                        flex: 1;
                        input {
                            width: 100%;
                            height: 2.8rem;
                            border: none;
                            text-align: center;
                            border-top: 1px solid #eee;
                            border-bottom: 1px solid #eee;
                            float: left;
                        }
                    }
                }
            }
        }
    }
    
    //最常点的菜
    
    .hot_food{
        background: #fff;
        margin-top: 1rem;
        border-radius: .5rem;
        margin-bottom: 4rem;
        h3{
            font-size: 1.4rem;
            padding: .5rem 0;
        }
        .item_list_outer{
            width: 100%;
            overflow-x: auto;
            .item_list{
                padding: 0 .5rem;
                width: 100rem;
                li{
                    width: 8rem;
                    padding: .5rem;
                    box-sizing: border-box;
                    float: left;
                    .inner{
                        background: #fff;
                        width: 100%;
                        border-radius: .5rem;
                        overflow: hidden;
                        img{
                            width: 100%;
                        }
                    }
                }
            }
        }
        
    }
}

//购物车空空的
.cart_empty{
    text-align: center;
    line-height: 3rem;
    h3{
        font-size: 2rem;
    }
}

</style>
