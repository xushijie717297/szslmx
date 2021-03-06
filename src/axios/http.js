import axios from 'axios';
import Qs from 'qs';
import { MessageBox } from 'mint-ui'; // 消息提示框组件 这个你们可以不用

import router from './../router/index'
import Vue from 'vue'
import { Dialog } from 'vant';

let loadinginstance, loadCount = 0,loadingArray=[];

// 环境的切换
// if (process.env.NODE_ENV == 'development') {
//     axios.defaults.baseURL = 'http://172.23.1.110:8085/Service1.svc/Rest/';
//     // axios.defaults.baseURL = 'http://192.168.1.140:9898/HomePageService.svc/Rest';
// } else if (process.env.NODE_ENV == 'debug') {
//     axios.defaults.baseURL = 'http://172.23.1.110:8085/Service1.svc/Rest/';
// } else if (process.env.NODE_ENV == 'production') {
//     axios.defaults.baseURL = 'http://172.23.1.110:8085/Service1.svc/Rest/';
// };
axios.defaults.baseURL = 'http://10.200.6.71:8088/WaterService/Service1.svc/Rest/'
// if (process.env.NODE_ENV == 'development') {
//     axios.defaults.baseURL = 'http://112.64.170.158:8088/Service1.svc/Rest';
// } else if (process.env.NODE_ENV == 'debug') {
//     axios.defaults.baseURL = 'http://112.64.170.158:8088/Service1.svc/Rest';
// } else if (process.env.NODE_ENV == 'production') {
//     axios.defaults.baseURL = 'http://112.64.170.158:8088/Service1.svc/Rest';
// };

// 设置请求超时时间
// axios.defaults.timeout = 10000;

// 设置post请求头

// axios.defaults.headers.post['Content-Type'] = 'application/json;;charset=UTF-8';
axios.defaults.headers.common['Authorization'] = "YWRtaW4tenRkYXRhQDEyMw"

// 请求拦截
axios.interceptors.request.use(config => {
    /* loadCount++
    loadinginstance = Loading.service({
        text: '请稍等',                                       //内容
        background: 'rgba(28, 36, 51, 0.8)',                 //样式
        target: document.querySelector('#Zbcp>.table')       //绑定DOM
    })
    loadingArray.push(loadinginstance)
    //post请求需要使用qs参数序列化
    if(config.data.constructor==Object&&config.method=='post'){
        config.data=Qs.stringify(config.data)
    } */

   /*  //判断权限token
    if(router.history.current.name!='Login'&&localStorage.getItem('token2')!='123456'){
        //在新的实例上使用组件
        let v = new Vue();
        // console.log(v.axios)
        v.$alert('登录已超时', '提示', {
            confirmButtonText: '确定',
            callback: action => {
                router.push({name:'Login'})
            }
        });
        return
    } */
    // console.log(config.data.constructor==Object)
    // 在发送请求之前做些什么 验证token之类的
    // Loading.service(true);

    return config;
}, error => {
    // 对请求错误做些什么
    /* Message({
        //  饿了么的消息弹窗组件,类似toast
        showClose: true,
        message: error,
        type: "error.data.error.message"
    });
    return Promise.reject(error.data.error.message); */
    loadCount--
    if (!loadCount) {
        loadingArray.forEach(item=>item.close())
    }
    return Promise.error(error);
})

// 响应拦截
axios.interceptors.response.use(response => {
    console.log("response",response)
    // 对响应数据做点什么
    loadCount--
    if (!loadCount) {
        loadingArray.forEach(item=>item.close())
    }
    return response;
}, error => {
    loadCount--;
    if (!loadCount) {
        loadingArray.forEach(item => item.close())
    }
    // 对响应错误做点什么
    // console.log(error)
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '错误请求' ; Dialog.confirm({title: '提示',message: '错误请求'});
                break
            case 401:
                error.message = '未授权，请重新登录' ; Dialog.confirm({title: '提示',message: '未授权，请重新登录'});
                break
            case 403:
                error.message = '拒绝访问' ; Dialog.confirm({title: '提示',message: '拒绝访问'});
                break
            case 404:
                error.message = '请求错误,未找到该资源' ; Dialog.confirm({title: '提示',message: '请求错误,未找到该资源'});
                break
            case 405:
                error.message = '请求方法未允许' ; Dialog.confirm({title: '提示',message: '请求方法未允许'});
                break
            case 408:
                error.message = '请求超时' ; Dialog.confirm({title: '提示',message: '请求超时'});
                break
            case 500:
                error.message = '服务器端出错' ; Dialog.confirm({title: '提示',message: '服务器端出错'});
                break
            case 501:
                error.message = '网络未实现' ; Dialog.confirm({title: '提示',message: '网络未实现'});
                break
            case 502:
                error.message = '网络错误' ; Dialog.confirm({title: '提示',message: '网络错误'});
                break
            case 503:
                error.message = '服务不可用' ; Dialog.confirm({title: '提示',message: '服务不可用'});
                break
            case 504:
                error.message = '网络超时' ; Dialog.confirm({title: '提示',message: '网络超时'});
                break
            case 505:
                error.message = 'http版本不支持该请求' ; Dialog.confirm({title: '提示',message: 'http版本不支持该请求'});
                break
            default:
                error.message = `连接错误${error.response.status}`  ; Dialog.confirm({title: '提示',message: `'连接错误'${error.response.status}`});
        }
    } /* else {
        error.message = "连接到服务器失败";  MessageBox({message: '连接到服务器失败', type: 'warning'});
    } */
    return Promise.reject(error);
});


// 封装get方法和post方法

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        /* var Load=Loading.service(
            {
                text: '请稍等',
                background: 'rgba(28, 36, 51, 0.8)',
                target: document.querySelector('.table')
            }
        ) */
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
            // Load.close();
            //  Loading.service(true).close();
            //  Message({message: '请求成功', type: 'success'});
        }).catch(err => {
            reject(err.response.data)
            // Load.close();
            //Loading.service(true).close();
            // Message({ message: '加载失败', type: 'error' });
        })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
       /*  var Load=Loading.service(
            {
                text: '请稍等',
                background: 'rgba(28, 36, 51, 0.8)',
                target: document.querySelector('#Zbcp>.table')
            }
        ) */
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
                // Load.close();
                //  Message({message: '请求成功', type: 'success'});
            })
            .catch(err => {
                if(err.response){
                    reject(err.response.data)
                }
                // Load.close();
                // Loading.service(true).close();
                // Message({ message: '加载失败', type: 'error' });
            })
    });
}
