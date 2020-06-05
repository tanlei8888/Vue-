(function(Vue){
    Vue.component('notebook',{
        data: function(){
            return {
                //v-model双向绑定input输入内容
                inputValue: '',
                //把数据和storage绑定
                values: storageFN.getData(),
                //可见的那个数据 用于下面的filters过滤器
                // visibility:'all',
                //用于储存修改内容项前的数据
                content_cache:"",
                //tips 提示框是否显示开关
                inputing:false
            }
        },
        //自定义指令 聚焦
        directives:{
            'focus':function(el,binding,vnode){
                el.focus()
            }
        },
       
        watch: {
            //监听全局values变化 每次变化传递最新数据给storage
            values: {
                handler: function (newValues,oldValues) {
                    storageFN.setData(newValues)
                },
                deep:true//允许监听绑定数据变化
            },
        },
        computed: {
            visibility:function(){
                return this.$root.visibility
            },
            tips:function(){
                let tips = [];
                this.values.forEach(e=>{
                    if(e.content.indexOf(this.inputValue) !== -1){
                        tips.push(e.content)
                    }
                })
                return tips
            },
            //每次更新hash 得到新visibility 调用筛选器改变数据计算filtersValues
            filtersValues:function(){
                return filters[this.visibility](this.values)
            },
            //待激活的数据的长度
            dataLength:function(){
                // console.log(this.values);
                // console.log(filters.active(this.values).length);
                return filters.active(this.values).length
            },
            //监听所有checked变化
            allDone:{
                //做get 获取 只读 等同于 allDone : function (){} 不包含set
                get:function(){
                    //判断是否全部都是checked 
                    // return this.dataLength === 0
                   return this.values.every(e => e.checked === true)
                },
                // 自定义添加set 做set 每次设置values每项的checked属性
                set:function(value){
                    this.values.forEach(e=>{
                        e.checked = value
                    })
                        console.log(value);
                }
            }
        },
        methods: {
            //顶部输入框失去焦点离开事件
            cancel:function(){
                this.inputing = false
            },
            //顶部输入框input事件
            inputChange:function(){
                this.inputing = true
            },
            //添加数据事件
            add: function () {
                if (!this.inputValue.trim()) {
                    alert('不能输入空内容')
                } else {
                    this.values.push({
                        id: storageFN.id++,
                        content: this.inputValue,
                        checked: false,
                        flag:false
                    })
                    this.inputValue = ""

                }
            },
            //删除单条数据事件
            removeNb: function (index) {
                this.values.splice(index, 1)
            },
            //双击内容 可修改内容  渲染input标签
            editNb:function(index){
               
                this.content_cache = this.values[index].content;
                this.values[index].flag = true
            },
          
            //esc键盘事件 取消修改 内容不变
            cancelEdit:function(index){
               
                    this.values[index].content = this.content_cache;
                    this.content_cache = "";
                    this.values[index].flag = false

                
            },
            //input框失去焦点事件
            doneEdit:function(index){
                if(this.values[index].content === ""){
                    this.values.splice(index,1)
                }else{
                    this.values[index].flag = false
                }
            },
            //删除已完成的项
            removeChecked:function(){
                this.values =  this.values.filter((e,i)=>{
                    return !e.checked
                })
            },
        },
        template:`
            <div>
                <header>
                <h1>待办事项</h1>
                <input autofocus autocomplete="off" type="text" placeholder="What needs to be done?" v-model='inputValue'
                    @keyup.enter.stop='add' @input='inputChange' @blur='cancel'>
                <ul :class='["tips","hidden",{show:inputing && inputValue!=""}]'>
                    <li v-for='tip,index in tips'
                    @click.stop='addNewbook'
                    >{{tip}}</li>
                </ul>
                <input 
                id="allToggle"
                class="allToggle"
                type="checkbox" 
                v-model="allDone"
                v-show='values.length != 0'
                >
                </header>
                <div class="content">
                    <!-- <label for="allToggle"></label> -->
                    <ul class="noteBool-list">
                        <li class="list-item" v-for='item,index in filtersValues' :key='item.id' 
                        :class='{completed:item.checked}'>
                            <div class="view">
                                <input 
                                type="checkbox" 
                                class="toggle"
                                v-model='item.checked'
                                >
                                <label
                                :class="{hidden:item.flag}"
                                @dblclick='editNb(index)'
                                >
                                    {{item.content}}
                                </label>
                                <input
                                :class="['edit',{hidden:!item.flag},{show:item.flag}]"
                                type="text"
                                v-model="item.content"
                                v-focus='item == content_cache'
                                @blur="doneEdit(index)"
                                @keyup.enter.stop="doneEdit(index)"
                                @keyup.esc="cancelEdit(index)"
                                />
                                <div class="del" @click='removeNb(index)'>
                                    x
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <footer class="footer" v-cloak v-show='values.length != 0'>
                    <span class="todo-count">
                        剩下<strong>{{dataLength}}</strong>项
                    </span>
                    <ul class="filters">
                        <li>
                            <a href="#/all" 
                            :class="{ selected: visibility == 'all' }">All</a>
                        </li>
                        <li>
                            <a href="#/active"
                            :class="{ selected: visibility == 'active' }" 
                            >激活</a>
                        </li>
                        <li>
                            <a href="#/checked" 
                            :class="{ selected: visibility == 'checked' }">完成</a>
                        </li>
                    </ul>
                    <div 
                    class="clear-completed"  
                    v-show='values.length > dataLength'
                    @click='removeChecked'
                    >
                        清除已完成
                    </div>
                </footer>
            </div>
        `
    })
})(Vue)