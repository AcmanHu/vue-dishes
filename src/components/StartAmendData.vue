<template>
    <div id="start">
        <div class="start_content">
			<header class="start_header">
				<img src="../assets/images/canju.png" />修改用餐人数
			</header>
			<p class="notice">请选择正确的用餐人数</p>
			
			<div class="content">
				<ul class="user_list">
					<li v-for="(item,key) in 12" @click="changeColor1(key)" :class="{active:key==nowIndex1}"><span>{{item}}人</span></li>
				</ul>
				 
			</div>

			<div class="mark_input">
                <input type="text" v-model="msg" placeholder="请输入您的口味要求，忌口等（可不填）"/>
            </div>
            <ul class="mark_list">
                <li v-for="(item,key) in list1" @click="changeColor2(key)" :class="{active:key==nowIndex2}"><span>{{item.title}}</span></li>
            </ul>
            
		</div>
      
        <div id="start" class="start"  @click="startFood()">
            <span>取消</span>
        </div>
        
        <div id="second" class="second"  @click="startFood()">
            <span>确认修改</span>
        </div>
		
    </div>
</template>

<script>
import Config from '../model/config.js'
import storage from '../model/storage.js'
export default {
    data(){
        return{
            nowIndex1:0,//人数当前下标
            nowIndex2:-1,//备注当前下标
            p_num:'1人',//默认的人数0
            api:Config.api,//url
            msg:'',//备注的输入框信息
            peopleData:[],//人数与备注信息的数组
            list1:[//备注信息的数组
                {
                    title:'打包带走'
                },
                {
                    title:'不要放辣椒'
                },
                {
                    title:'微辣'
                }
            ]
        }
    },
    methods:{
        // addChange(){
        //     var lis = document.querySelectorAll('.user_list li');

        //     for(var i=0;i<lis.length;i++){
        //         lis[i].onclick = function(){
        //             //让所有的li的class 让当前点击的li的class等于active;
        //             for(var j=0;j<lis.length;j++){
        //                 lis[j].className='';
        //             }    
        //             this.className= 'active';

        //         }
        //     }
        // }

        changeColor1(key){
            this.nowIndex1 = key;
            var key = key+1;
            this.p_num = key+'人';
            console.log(this.p_num);
        },
        changeColor2(key){
            this.nowIndex2 = key;
            this.msg = this.msg +' '+ this.list1[key].title;
            // alert(this.list1[key].title)
        },
        startFood(){
            var uid = storage.get('roomid');
            var api = this.api+'api/addPeopleInfo';
            if(this.msg==''){
                this.msg = '无';
            }
            this.$http.post(api,{
                uid:uid,
                p_num:this.p_num,
                p_mark:this.msg
            }).then((response)=>{
                if(response.body.success){
                    this.$router.push({path:'/cart'});
                }
                console.log(response);
            },(err)=>{
                console.log('请求数据失败');
            })

           
        },
        //修改数据是人数与备注默认选中
        changePeopleData(){
            var uid = storage.get('roomid');
            var api = this.api+'api/peopleInfoList?uid='+uid;
            this.$http.get(api).then((response)=>{
                // console.log(response);
                if(response.body.success){
                    this.peopleData = response.body.result[0];
                    //人数信息
                    this.nowIndex1 = parseInt(this.peopleData.p_num)-1;
                    //备注信息
                    this.msg = this.peopleData.p_mark;
                }
            },(err)=>{
                alert('请求数据失败了');
            })
        }
    },
    mounted(){
        // this.addChange();
        // this.nowIndex1=5;
        this.changePeopleData();
    }
}
</script>

<style lang="scss">
.start_content{
       .start_header{
           height: 3.2rem;
           line-height: 3.2rem;
           background: #000;
           color: #fff;
           width: 10rem;
           margin: 5rem auto 0 auto;
           border-radius: .5rem;
           img{
               height: 2.2rem;
               line-height: 2.2rem;
               position: relative;
               top: .5rem;
               margin-left: 1rem;
           }
       }
       .notice{
           color: red;
           text-align: center;
           margin: 1rem 0;
       }
       .mark_input{
           padding: 1rem;
           input{
                height: 3rem;
                width: 100%;
                line-height: 3rem;
                border: 1px solid #eee;
           }
       }
       .user_list,.mark_list{
           display: flex;
           flex-wrap: wrap;
            padding: .5rem;

           li{
               width: 25%;
               padding: .5rem;
               box-sizing: border-box;//盒子的宽度=盒子本身的宽度   默认盒子的宽度=盒子的宽度+padding+margin
               span{
                   display: block;
                   height: 3.2rem;
                   line-height: 3.2rem;
                   text-align: center;
                   background: #fff;
                   border-radius: .5rem;
                   border: 1px solid #ccc;
               }
           }
           li.active{
               span{
                   background: red;
                   border: 1px solid red;
                   color: #fff;
               }
           }
       } 
}
.start{
   position: fixed;
   bottom: 5rem;
   left: 20%;
   height: 6rem;
   width: 6rem;
   margin-left: -3rem;
   border-radius: 50%;
   background: #000;
   color: #fff;
   span{
       display: block;
       width: 2rem;
       margin: 0 auto;
       position: relative;
       top: 2rem;
   }       
}
.second{
   position: fixed;
   bottom: 5rem;
   right: 20%;
   height: 6rem;
   width: 6rem;
   margin-right: -3rem;
   border-radius: 50%;
   background: red;
   color: #fff;
   span{
       display: block;
       width: 2rem;
       margin: 0 auto;
       position: relative;
       top: 1.5rem;
   }       
}
</style>
