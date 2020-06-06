# Vue 学习笔记

### `computed`

- 计算属性 当需要数据改变页面跟着改变时 变量应该放在computed里

- 例子：

- ```js
  一般情况计算属性只读 getter
  computed: {
              visibility:function(){
                  return this.$root.visibility
              },
  }
  ```

  ```js
  需要时也可以 setter
   computed: {
      allDone:{
                  //做get 获取 只读 等同于 allDone : function (){} 不包含set
                  get:function(){
                      //判断是否全部都是checked 返回true or false
                      // return this.dataLength === 0
                     return this.values.every(e => e.checked === true)
                  },
                  // 自定义添加set 做set 每次计算属性都会修改values里每项的checked属性
                  set:function(value){
                    //set 可以得到 allDone通过了v-model绑定了checkbox得到值(value) 										true or false 然后让子属性的那些checked属性随着自己变化实现全选反选
                      this.values.forEach(e=>{
                          e.checked = value
                      })
                          console.log(value);
                  }
              }
          },
  
  ```

  

### ` watch`

- 侦听器 可以监听变量属性 每次变量变化就会调用watch里的函数，实现数据更新 

例如：

```js
let storageFN = {
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
------------------------------------------------------------------------------
 data: function(){
            return {
                //把数据和storage绑定
                values: storageFN.getData(),
        },
watch: {
  					//与computed不同的是可以通过参数得到改变后的值newValues对它进行操作(储存)
            //监听全局values变化 每次变化传递最新数据给storage储存
            values: {
                handler: function (newValues,oldValues) {
                    storageFN.setData(newValues)
                },
                deep:true//允许监听绑定改变数据 默认false
            },
        },
```

### `利用computed 做到百度搜索框输入有提示效果`

html

```html
<ul :class='["tips","hidden",{show:inputing && inputValue!=""}]'>
      <li v-for='tip,index in tips'@click.stop='addNewbook'>{{tip}}</li>
</ul>
```

js

```js
computed: {
  //与上面标签里的tips绑定 通过计算此属性每次更新插值数据
  tips:function(){
    //用一个空数组储存筛选符合条件的内容
                  let tips = [];
    //遍历仓库数据
                  this.values.forEach(e=>{
                    //每条e.content进行查找关键字this.inputValue
                      if(e.content.indexOf(this.inputValue) !== -1){
                        //如果找到了就push进空组数 这样就得到了所有符合关键字的内容
                          tips.push(e.content)
                      }
                  })
    //最后return tips
                  return tips
              },
}
```

### `通过<a>标签自定义路由方法`

- html

```html
 <ul class="noteBool-list">
             <li class="list-item" v-for='item,index in filtersValues' 													:key='item.id' :class='{completed:item.checked}'>
   </li>
</ul>
<ul class="filters">
                        <li>
                          //改变hash值
                            <a href="#/all" 
                            :class="{ selected: visibility == 'all' }">All</a>
                        </li>
                        <li>
                           //改变hash值
                            <a href="#/active"
                            :class="{ selected: visibility == 'active' }" 
                            >激活</a>
                        </li>
                        <li>
                           //改变hash值
                            <a href="#/checked" 
                            :class="{ selected: visibility == 'checked' }">完成</a>
                        </li>
                    </ul>
```

- js

```js
 //筛选器
    let filters = {
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
    
computed: { 
  //调用filters方法来改变渲染视图的filtersValues计算属性
	filtersValues:function(){
                return filters[this.visibility](this.values)
            },
}
function onHashChange () {
        //过滤 替换掉 /#通过a标签herf属性改变location.hash来切换visibility的值 
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
    //监听页面hash变化  onhashchange 每次变化赋值给visibility
    window.addEventListener('hashchange',onHashChange)
```

