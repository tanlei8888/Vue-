<template>
    <div class="box">
        
        <div class="box1">
            你好 深圳
            <div class="box2">
                hello 💯 👍
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
    *{
        padding: 0;
        margin: 0;
    }
    .box{
        margin:100px auto;
        width: 500px;
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: blue;
        color: yellow;
    }
    .box1{
        margin:auto;
        width: 300px;
        height: 300px;
        background-color: yellow;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: left;
    }
    .box2{
        width: 100px;
        height: 100px;
        background-color: pink;
        text-align: center;
        line-height: 100px;
    }
</style>