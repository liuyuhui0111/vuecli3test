<template>
    <div v-show="visible" class="toast">
        <span>{{ message }}</span>
    </div>
</template>
<script>
    export default{
        name:"toast",
        props: {
            message: String
        },
        data(){
            return {
               visible: false
            }
        }
    }
</script>
<style>
.toast{padding: 5px 5%;left: 50%;top: 50%;transition: opacity .3s linear;
  -webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);background: rgba(0, 0, 0, 0.6);position: fixed;max-width: 80%;border-radius: 2px;color: #fff;box-sizing: border-box;text-align: center;z-index: 1000;line-height: 17px;word-wrap:break-word;}
.toast span{font-size: 12px;display:block;text-align: center;}
</style>

