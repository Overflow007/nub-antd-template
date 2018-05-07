/** global _ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import _ from 'lodash';
// import Cookie from 'common/cookie';
import { NavLink, Link } from 'react-router-dom';
import { Tabs } from 'antd';
/* import { observable, action, toJS } from 'mobx';*/
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import http from 'common/http';
import session from 'models/Session';
import themeConfig from 'models/ThemeConfig';
import asyncComp from 'HOC/AsyncComponent';
import importPageComponent from 'routes/export';
import history from 'common/history';
import styles from './Container.scss';
import {extractPath} from 'common/path';

const PREFIX = 'site-content';

const cx = utils.classnames(PREFIX, styles);

const TabPane = Tabs.TabPane;

@observer
class Container extends Component {

    constructor(props) {
        super(props);
        this.session = session;
        this.themeConfig = themeConfig;
        this.tabComponentsCache = {};
      }
      

    componentDidMount() {
        history.listen(this.doRoute);
        this.firsttoDoRoute();
        //this.doRoute(global.location.pathname);
    }

    componentWillUnmount(){
        this.tabComponentsCache = {};

        history.off(this.doRoute);
        themeConfig.clear();
    }

    onChange = (activeKey) => {
        const nextTab = this.themeConfig.getTab(activeKey);
        history.push({ pathname: nextTab.pathname });
        //this.themeConfig.setActiveTabIndex(activeKey);
    }

    onEdit = (targetKey, act) => { //act===remove
        if (this.themeConfig.getTab(targetKey)){
            if (this.tabComponentsCache[targetKey]){
                this.themeConfig.removeTab(targetKey);
            }
        }
        console.log(targetKey, act);
    }

    firsttoDoRoute = ()=>{
        const {location} = global;
        if(this.session.menus==null)return;
        const matchs = this.session.menus.filter(x => { 
            if(x.pathname==null||x.pathname=='')return false;
            const r = new RegExp(`^${x.pathname}$`);
            let p = location.pathname;
            
            if(this.session.hasBasicAppName){
                if(p.startsWith('/'+extractPath)){
                    p = p.replace('/'+extractPath,'');
                }
                
            }
            if (r.test(p)){
              return true;
            }
            return false;
            
          });
          if (matchs.length > 0) {
              const existIdx = this.themeConfig.containTab(location.pathname);
              if (existIdx === false) {

                  this.themeConfig.addTab({
                      pathname: location.pathname,
                      title: matchs[0].menuName,
                      entry: matchs[0].entry,
                      id: matchs[0].id
                  });
                  this.themeConfig.setActiveTabIndex(matchs[0].id);
                  
              } else {
                  if (this.themeConfig.activeTabIndex != existIdx){
                      this.themeConfig.setActiveTabIndex(existIdx);
                  }
                  console.log('existIdx', existIdx);
              }
              
          }else{
            let h = '/home';
            if(this.session.hasBasicAppName){
                h='/'+extractPath+'/home'
            }
            history.push(h);
          }
          console.log(matchs);    
    }

    doRoute = location => {
        console.log('中央区域正在路由', location.pathname);
        if(this.session.menus==null)return;
        const matchs = this.session.menus.filter(x => { 
            if(x.pathname==null||x.pathname=='')return false;
            const r = new RegExp(`^${x.pathname}$`);
            let p = location.pathname;
            if(this.session.hasBasicAppName){
                if(p.startsWith('/'+extractPath)){
                    p = p.replace('/'+extractPath,'');
                }
                
            }

            if (r.test(p)){
              return true;
            }
            return false;
            
          });
          if (matchs.length > 0) {
              const existIdx = this.themeConfig.containTab(location.pathname);
              if (existIdx === false) {

                  this.themeConfig.addTab({
                      pathname: location.pathname,
                      title: matchs[0].menuName,
                      entry: matchs[0].entry,
                      id: matchs[0].id
                  });
                  this.themeConfig.setActiveTabIndex(matchs[0].id);
              } else {
                  if (this.themeConfig.activeTabIndex != existIdx){
                      this.themeConfig.setActiveTabIndex(existIdx);
                  }
                  
                  console.log('existIdx', existIdx);
              }

          }
          console.log(matchs);    
    }

    renderAsyncComp = (path, tabKey) => {
        console.log('rendering AsyncComp...', path);
        if (this.tabComponentsCache[tabKey] == null){
            const AsyncComponent = asyncComp(importPageComponent(path));
            this.tabComponentsCache[tabKey] = (<div><AsyncComponent {...this.props} /></div>);
        }
        return this.tabComponentsCache[tabKey];
    }
    renderTabPanes = () => {
        return this.themeConfig.tabs.map((pane, index) => {
            return (<TabPane className={`${cx('container-tabitem')}`} tab={pane.title} key={pane.id} closable="true" forceRender={true} >
            {this.renderAsyncComp(pane.entry, pane.id)}
            </TabPane>);
        });
    }

    render() {
        const menuLength = session.menus.filter(x => {

            return (x.show !== false && x.parentId == 0);
          });

        return (<div className={`${cx('container')}  ${this.themeConfig.collapsed?cx('container_collapsed') :'' } ${menuLength==0?cx('container_full'):cx('container_normal')}`}>
            <Tabs 
            animated={true} 
            hideAdd
        onChange={this.onChange}
        onEdit={this.onEdit}
        activeKey={this.themeConfig.activeIndex}
        style={{ height: '100%' }}
        type="editable-card"
      >
        {this.renderTabPanes()}
      </Tabs>
        </div>);
    }
}

export default Container;

