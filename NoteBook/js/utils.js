(function(){
    
    //设置获取和储存本地localstorage方法
    window.storageFN = {
        //设置本地储存函数
        setData: function (data) {
            localStorage.setItem('nbItem', JSON.stringify(data))
        },
        //获取本地储存函数
        getData: function () {
            let data = JSON.parse(localStorage.getItem('nbItem') || "[]");
            data.forEach((e, i) => {
                e.id = i
            });
            storageFN.id = data.length;
            return data
        },
        id: null
    };
    //筛选器
    window.filters = {
        //所有笔记本项
        all:function(values){
            return values;
        },
        //待激活筛选器函数
        active:function(values){
            return values.filter(e=>!e.checked)
        },
        //完成筛选器函数
        checked:function(values){
            return values.filter(e=>e.checked)
        }
    }
    
})()