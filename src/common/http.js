import _ from 'lodash';
import reqwest from 'reqwest';
import fetch from 'isomorphic-fetch';
import { message } from 'antd';
import session from 'models/Session';
import {extractPath} from './path';
import {isIE} from './jugement'

export class Http {
  _config = {
    csrf: {
      isCsrfClose: true,
      api: '/csrf/getCsrfToken',
      timeout: 11 * 60 * 10000,
      getToken: response => response.token,
    },
    errorHook: error => {
      throw error;
    },
  };

  csrf = null;

  checkStatus(response) {
    console.log('==============')
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    if(response.status == 301 || response.status == 302){
      window.location=response.headers.get('Location');
    }


    const error = new Error(response.statusText);
    error.data = response;
    throw error;
  }



  

  async parseResult(response) {
    const contentType = response.headers.get('Content-Type');
    if(contentType!=null){
      if(contentType.indexOf('text')>-1){
        return await response.text();
      }

      if(contentType.indexOf('form')>-1){
        return await response.formData();
      }

      if(contentType.indexOf('video')>-1){
        return await response.blob();
      }
      
      if(contentType.indexOf('json')>-1){
        return await response.json();
      }
    }

    return await response.text();
  }

  async processResult(response) {
    const { url } = response;
    if(response.redirected){
      window.location=url;
    }
    let _response = this.checkStatus(response);
    _response = await this.parseResult(_response);
    
    
    return _response;
  }

  async _reqwest(options){
    let _response = await reqwest(options);
    return _response;
  }

  async _request(url, init, headers = {}, config = { throwError: false }) {
    try {
      if(url.startsWith('http://')||url.startsWith('https://')){

      }else if(url.startsWith('/')){
        if(location.hostname=='localhost'||location.hostname=='127.0.0.1'||location.hostname==''){
          if(location.pathname.startsWith('/'+extractPath)){
            url='/'+extractPath + url;
          }else{
            //url='http://101.132.66.16:9079/uos-manager' + url;
            // url='http://127.0.0.1:8080/uos-manager' + url;
          }
          
        }else{
          url='/'+extractPath + url;
        }
      }
      

      let options = _.assign(
        {
          credentials: 'include',
        },
        init,
      );
      options.headers = Object.assign(
        {
          //'x-requested-with': 'XMLHttpRequest',
        },
        options.headers || {},
        headers || {},
      );
      

      let response = await fetch(url, options);
      response = await this.processResult(response);
      return response;
    } catch (error) {
      this._config.errorHook(error);
      if (config.throwError) throw error;
      return null;
    }
  }

  /**
   * headers
   * csrf
   * host
   * cqrs
   **/
  set config(config) {
    this._config = {
      ...this._config,
      ...config,
    };
  }

  token = null;
  async getCsrfToken() {
    if (this._config.csrf.isCsrfClose) {
      return '';
    }

    if (!this.token) {
      let response = await this.get(this._config.csrf.api);
      if (this._config.csrf.getToken) {
        response = this._config.csrf.getToken(response);
      }
      if (!response) {
        throw new Error('CSRF Not EXIST!');
      }
      this.token = response;
      setTimeout(() => {
        this.token = undefined;
      }, this._config.csrf.timeout || 11 * 60 * 1000);
    }
    return this.token;
  }

  async get(api, data = {}, headers = {}, config = {}) {
    const query = _.isEmpty(data) ? '' : `json=${encodeURIComponent(JSON.stringify(data))}`;
    return await this._request(`${api}?${query}`, headers, {}, config);
  }

  async post(api, data = {}, headers = {}, config = {}) {
    const token = await this.getCsrfToken();
    const _headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      //'X-CSRF-TOKEN': token.token,
      ...headers,
    };

    if(isIE){
      let opt = {
        url:api,
        method: 'post',
        data:data, 
        withCredentials: true
      }
      if(_headers['Content-Type']){
        
        opt.contentType=_headers['Content-Type'];
        if(opt.contentType.indexOf('form')>-1){
          Object.keys(data).forEach(key=>{
            const val = data[key];
            if(typeof(val)!=='string'){
              data[key]=JSON.stringify(val);
            }
          });
        }
      }

      return this._reqwest(opt).then(res=>res.response,res=>res)
    } 

    let formBody = null;

    if(_headers['Content-Type']&&_headers['Content-Type'].indexOf('application/x-www-form-urlencoded')>-1){
      
      formBody =  new URLSearchParams();
      for(let k in data){
        if(typeof(data[k])==='object'){
          formBody.append(k,JSON.stringify(data[k]));
        }else{
          formBody.append(k,data[k]);
        }
        
      }
    }else{
      formBody = JSON.stringify(data);
    }
    
    return await this._request(
      api,
      {
        method: 'POST',
        headers: _headers,
        body: formBody,
      },
      {},
      config,
    );
  }

}

const http = new Http();

export default http;
