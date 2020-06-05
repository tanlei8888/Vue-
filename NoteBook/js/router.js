(function(){
    
    function onHashChange () {
        console.log(window);
        //过滤 替换掉 /#
        let visibility = window.location.hash.replace(/#\/?/, "");
        //如果a标签传入的hash与过滤器匹配 那么传给vm实例的visibility
        if(filters[visibility]){
            vm.visibility = visibility
        }else{
            //如果没有默认为‘all’
            window.location.hash = "";
            vm.visibility = 'all';
        }
    }
    onHashChange();
    //监听页面hash变化 onhashchange
    window.addEventListener('hashchange',onHashChange)
})()