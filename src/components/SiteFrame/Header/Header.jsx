/** global _ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
// import Cookie from 'common/cookie';
import { NavLink, Link } from 'react-router-dom';
import { Dropdown, Menu, Modal, Icon, Avatar, Button, Select } from 'antd';
import { message } from 'antd';
import DataSelect from 'components/DataSelect';
/* import { observable, action, toJS } from 'mobx';*/
import { observable, toJS, computed } from 'mobx';
import { observer } from 'mobx-react';
import http from 'common/http';
import history from 'common/history';
import ChangeTenant from './popups/ChangeTenant'
import session from 'models/Session';
import themeConfig from 'models/ThemeConfig';

import {extractPath} from 'common/path';
import styles from './Header.scss';
import logo from './images/logo.png';


const PREFIX = 'site-nav';

const cx = utils.classnames(PREFIX, styles);

@observer
class Header extends Component {

    constructor(props) {
        super(props);
        this.session = session;
        this.themeConfig = themeConfig;
        this.state={
          modalName:'',
          tendants:[]
        };
      }

    componentDidMount() {
        http.get('/user/getTenants.qry').then(res=>{
          let retData = [];
          try{
            retData = JSON.parse(res);
          }
          catch(e){

          }
          this.setState({
            tendants:retData
          });
          session.tendants = retData;
        },res=>res);
    }

    onMenuClick = ({ item, key, keyPath }) => {
      //console.log("menuclick",item, key, keyPath)
      if (key === 'changeTenant'){
        this.setState({
          modalName:'showChangeTenant'
        });
      } else if (key == 'logout'){
        http.get('/user/logout.do').then(
          (res) => {
            const relocation = JSON.parse(res);
            if(relocation&&relocation!=null){
              message.success('登出成功');
              this.session.logout();
              window.location = relocation;
            }
          },
          () => { 
            message.success('登出失败');
          }
        );
        //this.session.logout();
        
      }
    }


    toggleCollapsed = () => {
        this.themeConfig.setCollapsed(!this.themeConfig.collapsed);
        console.log(this.themeConfig.collapsed);
      }

    
    renderModal=()=>{

      if(this.state.modalName == 'showChangeTenant'){
          return <ChangeTenant tendants={this.state.tendants} onCancel={() => { this.setState({ modalName: ''}); }}/>;
      }

      return null;
  }

    render() {
      
        const menu = (
            <Menu className={`${cx('usermenu_dropdown')}`} selectedKeys={[]} onClick={this.onMenuClick}>
              <Menu.Item key="user">
                <Icon type="user" />个人中心
              </Menu.Item>
              <Menu.Item key="setting">
                <Icon type="setting" />设置
              </Menu.Item>
              <Menu.Item key="changeTenant" disabled={this.state.tendants==null||this.state.tendants.length<1}>
                <Icon type="setting" />变更租户
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="logout">
                <Icon type="logout" />退出登录
              </Menu.Item>
            </Menu>
          );


        return (<header className={`${cx('header')} ${cx('header_dark')} ${this.themeConfig.collapsed?cx('header_collapsed') :'' }`}>
            <div className={`${cx('brand')} ${this.themeConfig.collapsed?cx('brand_collapsed') :'' }`} onClick={()=>{
              let h = '/home';
              if(session.hasBasicAppName){
                  h='/'+extractPath+'/home'
              }
              history.push(h);
            }}>
                <a>
                    <img className={`site-logo`} src={logo} alt="logo" />
                    <span className={`site-name`} >流程平台</span>
                </a>
            </div>
            <Icon onClick={this.toggleCollapsed} className={`${cx('slider')}`} type={this.themeConfig.collapsed ? 'menu-unfold' : 'menu-fold'} />
            <Dropdown overlay={menu}>
              <span className={`${cx('usermenu_trigger')}`}>
                <Avatar size="small" className={`${cx('avatar')}`} style={{ marginRight: '8px', backgroundColor: '#fff' }} src={'https://g.alicdn.com/aliyun/console/1.4.98/styles/images/favicon.ico'} />
                <span className={`${cx('username')}`}>{`${(this.session.profile!=null&&this.session.profile.staff!=null)?this.session.profile.staff.userName:'未知4A用户'}`}</span>
              </span>
            </Dropdown>
            {
                        this.renderModal()
                    }
            
        </header>);
    }
}


export default Header;