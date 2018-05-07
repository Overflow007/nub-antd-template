import React, { Component, Children } from 'react';
import history from 'common/history';
import http from 'common/http';
import {
  setCookie,
  getCookie,
} from 'common/cookie';
import session from 'models/Session';
import PropTypes from 'prop-types';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import Login from 'routes/Login';
import { extractPath } from 'common/path';

//Provider模式
@observer
class Router extends Component {

  static defaultProps = {};

  constructor() {
    super();
    session.syncSession();
    if (session.hasBasicAppName == null) {

      session.hasBasicAppName = location.pathname.startsWith('/' + extractPath);
    }
  }

  componentWillMount() {


  }

  componentDidMount() {
    if (!session.hasQrySession) {
      http.get('/user/getSession.qry').then(res => {
        session.hasQrySession = true;

        const JSESSIONID = getCookie('JSESSIONID');
        const SESSIONID = getCookie('SESSIONID');
        let profile = {};
        try {
          profile = JSON.parse(res);
        }
        catch (e) {

        }
        if (profile == null) profile = {}
        let { staff, token } = profile;

        let userId = null, staffId = null;
        if (staff) {
          userId = staff.userId;
          staffId = staff.staffId;
        }
        token = token ? token : JSESSIONID ? JSESSIONID : SESSIONID ? SESSIONID : userId ? userId : staffId ? staffId : '8888';
        console.log('login',token,profile);
        session.login(token,profile,[]);
        
        //this.getMenus();
      }, res => {
        session.hasQrySession = true;
        
      });
    }
  }

  getMenus() {
    http.get('/user/qryMenus.qry').then(res => {

      let ret = [];
      try {
        ret = JSON.parse(res);
      }
      catch (e) {

      }
      console.log('qryMenus.qry', ret);
      if (ret == null) ret = [];
      ret.push({
        id: 2,
        parentId: 0,
        menuName: "主页",
        "pathname": "/home",
        "entry": "routes/Home/index",
        show: false,
        icon: 'mail'
      });
      session.setMenus(ret);


    }, ret => {
      console.log('查询菜单失败');
      session.setMenus([{
        id: 2,
        parentId: 0,
        menuName: "主页",
        "pathname": "/home",
        "entry": "routes/Home/index",
        show: false,
        icon: 'mail'
      }]);

    });

  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    console.log("捕获到错误", error, errorInfo);
    /* this.setState({
      'error': error,
      'errorInfo': errorInfo
    }); */
    // You can also log error messages to an error reporting service here
  }

  render() {

    if (!session.hasQrySession) {
      return (<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} ><Spin tip="查询是否已登录中" /></div>);
    }

    if (!session.hasLogin) {

      return (<Login />);
    }

    if (!session.hasMenus) {
      return (<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} ><Spin tip="加载菜单中" /></div>);
    }
    //这里iebug了没办法这样写
    /* if (toString.call(this.props.children) === '[object Array]') {
      return React.Children.map(this.props.children, (child) =>
        React.cloneElement(child, {
          ...this.props
        })
      );

    } else if (toString.call(this.props.children) === '[object Object]') {
      return React.cloneElement(this.props.children, {
        ...this.props
      });
      // Children.only使我们不需要为空的组件再添加一个<div />
      //return Children.only(this.props.children);
    } */
    return this.props.children;

  }
}

export default Router;