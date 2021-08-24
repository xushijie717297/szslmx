<template>
    <div class="other">
        <div class="out">
                <swiper ref="mySwiper" :options="swiperOptions">
                    <swiper-slide v-for="(item,index) in arr" :key="index">
                       <div class="item">
                          <div class="left">
                            <h1>{{item.name}}</h1>
                            <p>{{item.time}}&nbsp;&nbsp;&nbsp;{{item.timer}}</p>
                            <div class="left-l">
                              <span>水量</span>
                              <p :class="{'colorRed' : item.num == 3,'colorGreen' : item.num == 2,'colorBlue' : item.num == 1,}">{{item.water}}<span>{{symbol}}</span></p>
                            </div>
                            <div class="left-w">
                              <span>超限值</span>
                              <p :class="{'colorRed' : item.num == 3,'colorGreen' : item.num == 2,'colorBlue' : item.num == 1,}">{{item.max}}<span>{{symbol}}</span></p>

                            </div>
                          </div>
                          <div class="right-r" style="position: relative;">
                            <div class="bj_2" style="position: absolute;">
                              <img :class="[item.icon>0?'bottom':'top']" v-for="(m,n) in 3" :key="n+'a'" src="../../static/image/button_arrow_07.png" />
                            </div>
                            <div class="bj" style="z-index: 2;">
                              <div class="three" v-for="(count,b) in 3" :key="b" v-show="Math.abs(item.num)>=count">
                                <img :src="item.indexNum" />
                              </div>
                            </div>
                            <div class="two-t" @click="transmit()">
                              <img src="../../static/image/button_quxian_01.png" />
                            </div>
                            <div class="two-b" @click="positionXy()">
                              <img src="../../static/image/button_dingwei_01.png" />
                            </div>
                          </div>
                            <div class="s"></div>
                        </div>
                    </swiper-slide>
                </swiper>
        </div>
    </div>
</template>
<script>
export default {
    name:'vartical',
    props:[
      'tabIndex'
    ],
    data() {
        return {
          symbol:'',//符号
          just:false,
          index:0,
          i:'',
          aaa:null,
            num:false,
            swiperOptions: {
              observer:true,//修改swiper自己或子元素时，自动初始化swiper
              observeParents:true,//修改swiper的父元素时，自动初始化swiper
                direction:'vertical',
                // loop:"true",
                loopAdditionalSlides:3,
                effect : 'coverflow',
                slidesPerView:1,
                slideToClickedSlide: true,//可点击
                centeredSlides: true,
                coverflowEffect:{
                  rotate:20,//滑动做3d旋转时Y轴的旋转角度
                  stretch:0,//每个滑动之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
                  depth:50,//滑动的位置深度。值越大z轴距离越远，看起来越小。
                  modifier: 2.3,//depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显
                  slideShadows : false,//是否开启slide阴影
                },
                on:{
                  slideChange: function(){
                    var index = this.activeIndex
                    sessionStorage.setItem("index", index);
                    console.log('改变了，activeIndex为'+this.activeIndex);

                  },
                },
            },
            point : [
              {X:107303.4191779612, Y:22481.5931350055, TYPE:"blue",ISUP:true},
              {X:117378.77266200152, Y:18078.91766298789, TYPE:"blue",ISUP:false},
              {X:123220.78434602488, Y:24936.93137901532, TYPE:"green",ISUP:true},
              {X:126226.4570240369, Y:22396.92629900516, TYPE:"green",ISUP:false},
              {X:105610.08245795443, Y:27476.936459025485, TYPE:"red",ISUP:false},
              {X:107938.42044796374, Y:29297.273433032766, TYPE:"red",ISUP:false}
            ],
            list:[
              {"name":"1航鹭桥氨基酸的疤痕v断货v吧","time":"2017.11.08","timer":"09:28","water":"0.304888","max":"888888","icon":"1","num":"1"},
              {"name":"湾头江1","time":"2018.10.06","timer":"09:28","water":"0.304","max":"0.004","icon":"2","num":"2"},
              {"name":"吴淞大桥","time":"2017.11.08","timer":"09:28","water":"0.9","max":"0.1","icon":"3","num":"3"},
              {"name":"武汉长江大桥","time":"2017.11.08","timer":"09:28","water":"0.304","max":"0.004","icon":"-1","num":"1"},
              {"name":"南浦大桥","time":"2017.11.08","timer":"09:28","water":"0.304","max":"0.004","icon":"-2","num":"2"},
              {"name":"黄河大桥","time":"2017.11.08","timer":"09:28","water":"0.304","max":"0.004","icon":"-3","num":"3"},
              ],
              arr:[]
        }
    },
    methods:{
      transmit(){
        this.$emit("childByValue",this.num)
      },
      positionXy(){
        var index = sessionStorage.getItem("index");
        // console.log(index)
        if(index == null){
          index =0
        }else{
          index = sessionStorage.getItem("index");
        }
        // console.log(this.point[index])
        var dataXy = this.point[index]
        this.$emit("childByXy",dataXy)
        // console.log(this.$emit("childByXy",dataXy))
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.$swiper;
        // console.log(this.$refs.mySwiper.swiper.activeIndex)
      },
    },
    watch:{
    },
    created() {
      this.aaa = this.tabIndex;
      // console.log(this.aaa)
    },
    mounted() {
		console.log(this.$route.path)
		if(this.$route.path == '/pressure'){
		  this.symbol = 'MPa'
		}else{
      this.symbol = 'm³/h'
    }
      // debugger
      var arr = [];//用来承接符合条件的数组
      var j = 0;//计数
      for(var i = 0;i<this.list.length;i++){
        if(this.tabIndex==undefined||this.tabIndex==0){
          this.arr = this.list
        }
        if(this.tabIndex==1){
          if(this.list[i].icon==3 || this.list[i].icon==-3){
            this.$forceUpdate();
            this.arr[j++] = this.list[i]
          }
        }if(this.tabIndex==3){
          if(this.list[i].icon==1 || this.list[i].icon==-1){
            this.$forceUpdate();
            this.arr[j++] = this.list[i]
            // console.log(this.arr)
          }
        }
        if(this.tabIndex==2){
          if(this.list[i].icon==2 || this.list[i].icon==-2){
            this.$forceUpdate();
            this.arr[j++] = this.list[i]
            // console.log(this.arr)
          }
        }
        // console.log(this.list)
          var array =[];
          var that = this;
        this.arr.map((item,index)=>{
          array.push(
             Object.assign({},item,{indexNum:'str'})
            )
             that.arr = array;
             // console.log(array)
            that.arr[index].indexNum =require( '../../static/image/button_arrow_0'+that.arr[index].icon+".png");
            // that.arr[index].indexNum ='@/static/image/button_arrow_0'+that.arr[index].icon+".png";

            // console.log(that.list[index].indexNum)
             // console.log(that.list);
           });
          }
        }
      }
</script>

<style scoped>
  .bottom{
    transform: rotate(180deg);
  }
  .colorRed{
    color: red !important;
  }
  .colorGreen{
    color: green !important;
  }
  .colorBlue{
    color: #3092F3 !important;
  }
.other{
    height: 100%;
    /* background: #081D39; */
}
    .out{
      height: 100%;
      width: 100%;
      position: relative;
      top: 5px;
      /* background: #000000; */
    }
    .swiper-container{
        width: 310px;
        height: 100px;
        padding: 30px 0;
        margin-left: 0px;
    }
    .swiper-slide{
        /* padding: 5px 0; */
        box-sizing: border-box;
        background-color: #081D39;
        /* background-color: #1B314E; */
        /* background: linear-gradient(left,0.9) 0%,0.9; */
    }
    .item{
        width: calc(100% - 30px);
        height: 100%;
        margin-left: 20px;
        padding-left: 10px;
        box-sizing: border-box;
        background: #1B314E;
        position: relative;
        display: flex;
        justify-content: space-between;
    }
    /* 三角形 */
    .s{
        position: absolute;
        left: -20px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom:10px solid transparent;
        border-right:20px solid #1B314E;
    }
    .left{
      width: 180px;
      height: 100%;
      /* padding-left: calc(10px); */
      display: flex;
      flex-direction: column;
      }
     .left p{
        height: 18px;
        font-size: 12px;
        line-height: 18px;
        color: #7992AA;
      }
      .left h1{
        height: 30px;
        width: 80%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-size: 20px;
        line-height: 30px;
        color: #EAF1F8;
      }
    .left-l,.left-w{
        height: 30px;
        width: 100%;
        display: flex;
        align-items: center;
        /* justify-content: space-between; */
        }
    .left-l p,.left-w p{
          font-size: 20px;
          height: 20px;
          width: 130px;
          margin-left: 10px;
          color: #3092F3;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: space-between;
          }
       .left-l span,.left-w span{
           display: block;
           font-size: 12px;
           width: 36px;
           height: 16px;
           color: #7992AA;
           font-weight: 600;
           text-align: justify;
           text-align-last: justify;
         }
        .right-r{
          height: 100%;
          width: 90px;
          /* background-color: red; */
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .bj_2,.bj{
          height: 36px;
          width: 60px;
          display: flex;
          background-color: transparent;
          /* justify-content: center; */
          align-items: center;
          /* background-color: pink; */
        }
        .three img,.bj_2 img{
          width: 12px;
          height: 14px;
          margin-left: 2px;
        }
        .two-t img,.two-b img{
          height: 25px;
          width: 90px;
          margin-top: 4px;
        }

</style>
