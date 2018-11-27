<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
*{
    margin: 0;
    padding: 0;
  }
html, body{ height:100%; padding:0; margin: 0;}
.page{
  position: relative;
  min-height: 100%;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
#app {
  font-family: 'PingFangSC-Regular','Microsoft YaHei', Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  text-align: center; color: #888; height: 100%; background:#f5f5f5;
  min-height:100%; margin:0 auto; padding:0;
}

input{
  font-family: 'PingFangSC-Regular','Microsoft YaHei', Helvetica, Arial, sans-serif;
  border-style:none;
}
input:focus,button:focus{outline:none;}
input::-webkit-input-placeholder,
input:-ms-input-placeholder,
input:-moz-placeholder,
input::-moz-placeholder{ color: #979797; }
.toast{
  padding: 10px 20px;
  max-width: 90%;
  font-size: 14px;
  text-align: left;
}
</style>
