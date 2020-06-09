(function(Vue,axios){
    //axios.create创建实例方法
    const Axios = axios.create({
        baseURL: 'https://apimusic.linweiqin.com/',
        timeout:10000,
    })
    //interceptors 拦截器
    // 请求拦截
    Axios.interceptors.request.use(function(config){
        return config
    },function(error){
        return Promise.reject(error)
    })
    //拦截响应 可以做些什么 
    Axios.interceptors.response.use(function(res){
        //进行过滤
        return res.data;
    },function(error){
        return Promise.reject(error)
    })
    window.Axios = Axios
})(Vue,axios)