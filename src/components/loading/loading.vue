<template>
    <div v-show="visible" class="loading">
        <div class="loading-wrapper">
            <span class="loading-spin">
                <div class="spinner-snake" style=""></div>
            </span> 
            <span class="loading-text"></span>
        </div> 
        <div class="loading-mask" @touchmove.stop.prevent></div>
    </div>


</template>
<script>
    export default{
        name:"loading",
        data(){
            return {
               visible: false
            }
        },
        // mounted(){
        // },
        // methods:{
        //     open(){
        //         this.visible = true;
        //         console.log('open')
        //     },
        //     close(){
        //         console.log('close')
        //     }
        // }
    }
</script>
<style>
.loading{-webkit-transition: opacity .2s linear;transition: opacity .2s linear;}
.loading-wrapper{top: 50%;left: 50%;position: fixed;-webkit-transform: translate(-50%,-50%);transform: translate(-50%,-50%);border-radius: 2px;background: rgba(0,0,0,.7);color: #fff;box-sizing: border-box;text-align: center;padding: 15px;line-height: 18px;}
.loading-mask {top: 0;left: 0;position: fixed;width: 100%;height: 100%;opacity: 0;background: transparent;}
.loading-spin {text-align: center;display: inline-block;}
.spinner-snake {-webkit-animation: spinner-rotate .8s infinite linear;animation: spinner-rotate .8s infinite linear;border: 4px solid transparent;border-radius: 50%;width: 32px;height: 32px;border-top-color: #ccc; border-left-color: #ccc; border-bottom-color: #ccc;}
.loading-text {display: none;color: #fff;text-align: center;margin-top: 10px;font-size: 14px;}
@keyframes spinner-rotate{
  0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}
  to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}
}

</style>

