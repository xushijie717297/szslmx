<template>
  <div class="Skeleton">
                    <div class="lister" v-for="(item,index) in userData" :key="index">
                <!-- <div class="lister" v-else v-for="(item,index) in userData" :key="index" @click="popupDetail(item)"> -->
                    <div ></div>
                    <div class="center">
                        <h4></h4>
                        <div class="programmeType">
                            <span></span>
                            <p></p>
                        </div>
                        <div class="evaluate">
                            <p></p>
                        </div>
                        <div class="ellipseT"></div>
                        <div class="ellipseB"></div>
                    </div>
                    <div class="right">
                        <div class="ellipseT"></div>
                        <div class="ellipseB"></div>
                        <h4></h4>
                        <div class="TimeC">
                            <div class="TimeCL">
                                <p :class=" '准确' == '准确' ? 'green1' : 'red1'" v-for="(item1,index) in 5" :key="index "></p>
                            </div>
                            <div class="TimeCR">
                                <h5></h5>
                                <h5></h5>
                            </div>                            
                        </div>
                        <div class="brief">
                            <p class="briefText"></p>
                            <p class="briefText"></p>
                        </div>
                    </div>
                </div>
  </div>
</template>

<script>
import aa from "./gjp.json"
   export default {
      name: 'Skeleton',
      data () {
         return {
             userData:[]
         }
      },
      methods:{

      },
      mounted () {
          for (let i = 0; i < 3; i++) {
              this.userData.push(aa)  
          }
      }
   }
</script>
<style scoped lang="less">
 @r : 1rem/37.5;
 @bj: #242838;
.Skeleton{
    width: 100%;
    height: 100%;
    // background: #fff;
}
h4,h5,p,span{
    background: linear-gradient(
        100deg,
        rgba(255, 255, 255, 0) 40%,
        rgba(36, 40, 56, .5) 50%,
        rgba(255, 255, 255, 0) 60%
    ) @bj;
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 2s loading ease-in-out infinite;  
}
@keyframes loading {
  to {
    background-position-x: -20%;
  }}
        .lister{
            height: 172*@r;
            display: flex;
            background: #1C1F2F;
            border-radius: 5*@r;
            margin-top: 15*@r;
            position: relative;
            &:nth-last-child(1){
                &::after{
                    content: "没有更多数据了";
                    display: block;
                    position: absolute;
                    width: 100%;
                    height: 80px;
                    line-height: 50px;
                    text-align: center;
                    bottom: -80px;
                }
            }
            .red{
                background: #BB3C39 !important;
            };
            .green{
                background: #679F46 !important;
            };
            .green1{
                &:nth-child(1){
                    width: 6px;
                    height: 6px;
                    background: @bj;
                    border-radius: 50%;
                };
                &:nth-child(2){
                    width: 3px;
                    height: 3px;
                    background: @bj;
                    border-radius: 50%;
                };
                &:nth-child(3){
                    width: 3px;
                    height: 3px;
                    background:@bj;
                    border-radius: 50%;
                };
                &:nth-child(4){
                    width: 3px;
                    height: 3px;
                    background:@bj;
                    border-radius: 50%;
                };
                &:nth-child(5){
                    width: 6*@r;
                    height: 6*@r;
                    background: @bj;
                    border-radius: 50%;
                };  
            };
            .left{
                width: 3*@r;
                height: 100%;
                background: red;
            };
            .center{
                width: 92*@r;
                padding-left: 10*@r;
                box-sizing: border-box;
                font-size: 12px;
                color: #fff;
                position: relative;
                // border-right: 1px dashed #262a3b;
                box-sizing: border-box;
                h4{
                    width: 100%;
                    height: 18*@r;
                    margin: 12*@r 0;
                    // background: @bj
                };
                .programmeType{
                    width: 100%;
                    span{
                        width: 32*@r;
                        margin-left: 3*@r;
                        height: 42*@r;
                        display: block;
                        // background: @bj;
                    }
                    p{
                        width: 49*@r;
                        height: 18*@r;
                        margin-top: 10*@r;
                        // background: @bj
                    }
                };
                .evaluate{
                    width: 100%;
                    margin-top: 24*@r;
                    height: 36*@r;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    p{
                        height: 20*@r;
                        width: 50*@r;
                        // background: @bj
                    }
                };
                .ellipseT{
                    // background: #171a2a;
                    width: 6*@r; 
                    height: 6*@r;
                    border-radius: 100% 0 0 0;
                    transform:rotate(-90deg);
                    position: absolute;
                    right: -1px;
                    top: 0;
                };
                .ellipseB{
                    // background: #171a2a;
                    width: 6*@r; 
                    height: 6*@r;
                    border-radius: 100% 0 0 0;
                    transform:rotate(0deg);
                    position: absolute;
                    right: -1px;
                    bottom: 0;
                }
            };
            .right{
                flex: 1;
                // background: red;
                position: relative;
                padding-left: 16*@r;
                box-sizing: border-box;
                .ellipseT{
                    // background: #171a2a;
                    width: 6*@r; 
                    height: 6*@r;
                    border-radius: 100% 0 0 0;
                    transform:rotate(-180deg);
                    position: absolute;
                    left: 0px;
                    top: 0;
                };
                .ellipseB{
                    // background: #171a2a;
                    width: 6*@r; 
                    height: 6*@r;
                    border-radius: 100% 0 0 0;
                    transform:rotate(90deg);
                    position: absolute;
                    left: 0px;
                    bottom: 0;
                };
                h4{
                    width: 200*@r;
                    height: 20*@r;
                    // background: @bj;
                    margin: 12*@r 0;
                };
                .TimeC{
                    height: 40*@r;
                    display: flex;
                    .TimeCL{
                        width: 6px;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        padding: 3px 0;
                        box-sizing: border-box;
                    };
                    .TimeCR{
                        width: 208*@r;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding-left: 10*@r;
                        box-sizing: border-box;
                        h5{
                            height: 16*@r;
                            display: flex;
                            width: 100%;
                            font-size: 12px;
                            // background: @bj
                        }
                    }
                };
                .miaoshu{
                    font-size: 12px;
                    color: #fff;
                    padding: 15*@r 0;
                };
                .brief{
                    width: 224*@r;
                    position: relative;
                    margin-top: 30*@r;
                    p{
                        width: 200*@r;
                        height: 12*@r;
                        // background: @bj;
                        margin-bottom: 5*@r
                    };
                    span{
                        color: #4664E3;
                        position: absolute;
                        right: -10*@r;
                        top: -10*@r;
                        display: block;
                        line-height: 22*@r;
                        padding: 10*@r;
                    }
                }
            }
        }
</style>
