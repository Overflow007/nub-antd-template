import React, { Component } from 'react';
import http from 'common/http';
import history from 'common/history';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import _ from 'lodash';
import { Dropdown, Menu, message, Icon } from 'antd';
import { observable, computed, action, toJS } from 'mobx';
import session from 'models/Session';
import themeConfig from 'models/ThemeConfig';
import { observer } from 'mobx-react';
import { extractPath } from 'common/path';
import styles from './Aside.scss';

const PREFIX = 'site-aside';

const cx = utils.classnames(PREFIX, styles);

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


@observer
class Aside extends Component {

  constructor(props) {
    super(props);
    this.session = session;
    this.themeConfig = themeConfig;
    this.tabComponentsCache = {};
    this.state={
      openKeys:[]
    }
  }

  componentDidMount() {
  }

  handleClick = (e) => {
    e.domEvent.stopPropagation();
    if(e.key!=null&&e.key.toString().startsWith('sub'))return;
    const items = this.session.menus.filter(x => e.key == x.id);
    if (items.length > 0) {
      if (this.session.hasBasicAppName) {
        history.push({ pathname: '/' + extractPath + items[0].pathname });
      } else {
        history.push({ pathname: items[0].pathname });
      }

    }
  }

  renderMenuNav(parentMenu) {
    const menus = this.session.menus;
    let parentId = 0;
    if (parentMenu != null) {
      parentId = parentMenu.id;
    }
    return menus.filter(x => (x.show !== false && x.parentId == parentId)).map(item => {
      const subs = menus.filter(x => item.id == x.parentId);
      if (subs.length > 0) {
        return (<SubMenu key={`${item.id}`} title={<span><Icon type={`${item.icon}`} style={item.iconColor ? { color: item.iconColor } : {}} /><span>{`${item.menuName}`}</span></span>}>
          {this.renderMenuNav(item)}
        </SubMenu>);
      }
      return (<Menu.Item key={`${item.id}`}><Icon type={`${item.icon}`} style={item.iconColor ? { color: item.iconColor } : {}} /><span>{`${item.menuName}`}</span></Menu.Item>);


    });
  }
  renderSecLevalMenu(parentMenu){
    const menus = this.session.menus;
    let parentId = 0;
    if (parentMenu != null) {
      parentId = parentMenu.id;
    }
    return menus.filter(x => (x.show !== false && x.parentId == parentId)).map(item => {
      const subs = menus.filter(x => item.id == x.parentId);
      if (subs.length > 0) {
        return (
          <Menu.Item key={`${item.id}`} className={`${cx('menuitem_subcontainer')}`} >
          <span>
            <Menu key={`Menu_${item.id}`}
              className={`${cx('menu_sub')}`}
              onClick={this.handleClick}
              forceSubMenuRender={true}
              inlineIndent={0}
        
              mode="vertical"
            >
            <SubMenu key={`sub_${item.id}`}  className={`${cx('menuitem_firstlv')}`} 
            title={
            <span>
              <Icon type={`${item.icon}`} style={item.iconColor ? { color: item.iconColor } : {}} />
              <span>{`${item.menuName}`}
              </span>
            </span>}>
              {this.renderMenuNav(item)}
            </SubMenu>
            </Menu></span>
          </Menu.Item>);
      }
      
      return (<Menu.Item className={`${cx('menuitem_firstlv')}`} key={`${item.id}`}><Icon type={`${item.icon}`} style={item.iconColor ? { color: item.iconColor } : {}} /><span>{`${item.menuName}`}</span></Menu.Item>);


    });
  }

  renderFirstLevalMenu(){
    const menus = this.session.menus;
    return menus.filter(x => {

      return (x.show !== false && x.parentId == 0);
    }).map(item => {
      const subs = menus.filter(x => item.id == x.parentId);
      if (subs.length > 0) {
          return (<SubMenu key={`${item.id}`} className={`${cx('menuitem_firstlv')}`} title={<span><Icon type={`${item.icon}`} style={item.iconColor ? { color: item.iconColor } : {}} /><span>{`${item.menuName}`}</span></span>}>
          {this.themeConfig.collapsed?this.renderMenuNav(item):this.renderSecLevalMenu(item)}
        </SubMenu>);
      }
        
      return (<Menu.Item key={`${item.id}`} className={`${cx('menuitem_firstlv')}`} ><Icon type={`${item.icon}`} style={item.iconColor ? { color: item.iconColor } : {}} /><span>{`${item.menuName}`}</span></Menu.Item>);


    });
  }

  onOpenChange=(openKeys)=>{
    //console.log('menu',openKeys);
    
    if(openKeys&&openKeys.length>0){
      const lastOpenKey = openKeys.pop();
      if(lastOpenKey!=null&&lastOpenKey!='0'){
        const menus = this.session.menus;
        const findingMenu = _.find(menus,x => x.id==lastOpenKey);
        if(findingMenu!=null&&findingMenu.menuPath!=null){
          const newOpenKeys = findingMenu.menuPath.split('.');
          console.log('menu',findingMenu);
          newOpenKeys&&this.setState({
            openKeys:newOpenKeys
          });
        }
        
      }else{
        this.setState({
          openKeys:[]
        });
      }
      
    }else{
      this.setState({
        openKeys:[]
      });
    }
  }

  render() {
    const menuLength = this.session.menus.filter(x => {

      return (x.show !== false && x.parentId == 0);
    });

    return (<aside className={`${cx('left')} ${cx('dark')} ${menuLength==0?cx('hidden'):cx('normal')} ${this.themeConfig.collapsed ? cx('left_collapsed') : cx('left_expand')}`}>
      <Menu className={`${cx('menu')}`}
        onClick={this.handleClick}
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        mode="inline"
        inlineIndent={0}
        inlineCollapsed={this.themeConfig.collapsed}
      >
        {this.renderFirstLevalMenu()}
      </Menu>
    </aside>);
  }
}

export default Aside;