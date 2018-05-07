/** global _ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
// import Cookie from 'common/cookie';
import { NavLink, Link } from 'react-router-dom';
import { Dropdown, Menu, message } from 'antd';
/* import { observable, action, toJS } from 'mobx';*/
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import http from 'common/http';
import history from 'common/history';
import routeConfig from 'config/routeConfig';
import ChangePassword from 'routes/ChangePassword/ChangePassword';
import styles from './TopBar.scss';

import logo from './logo.png';

const { Item } = Menu;

const PREFIX = 'top-bar';
const cx = utils.classnames(PREFIX, styles);
const { navTo } = utils;

class Model {
  @observable logoutVisible = false;

  @action
  setLogoutVisible = flag => {
    this.logoutVisible = flag;
  };

  logout = async () => {
    http.get('/login/getLogOut');
    window.location.href = routeConfig.home;
    // await http.get('/logout', {}, {}, { throwError: true });
    // history.push(`/login?recirectUrl=${location.href}`);
  };
}

@observer
class TopBar extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  };

  static defaultProps = {};

  constructor() {
    super();
    this.model = new Model();
  }

  componentDidMount() {
    http.get('/login/getCurrentUser').then(res => {
      if (res) {
        const { accountName, loginStatus } = res;
        this.username = accountName;
        if (loginStatus === 'X') {
          /* 需要修改密码 */
          this.showChangePassword = 'force';
          message.info('您好，首次登录请修改密码');
        }
      }
    });
  }

  @observable username = '加载中';
  @observable showChangePassword = '';

  renderNav() {
    const { pathname } = history.location;
    const controlMenu = (
      <Menu theme="dark" className={cx('nav-menu')}>
        <Item
          key="netControl"
          className={cx('nav-menu-item', {
            'item-selected': pathname === routeConfig.testPage,
          })}
        >
          <Link to={routeConfig.testPage}>模板管理</Link>
        </Item>
        <Item
          key="ruleControl"
          className={cx('nav-menu-item', {
            'item-selected': pathname === routeConfig.testPage,
          })}
        >
          <Link to={routeConfig.testPage}>关注人群管理</Link>
        </Item>
      </Menu>
    );
    return (
      <div className={cx('main-button')}>
        <NavLink to={routeConfig.home} activeClassName={cx('selected')}>
          <div className={cx('nav-item')}>在库人员</div>
        </NavLink>
        <NavLink to={routeConfig.testPage} activeClassName={cx('selected')}>
          <div className={cx('nav-item')}>我的关注</div>
        </NavLink>
        {/* 这是带下拉框的写法
        <Dropdown
          overlay={controlMenu}
          getPopupContainer={() => document.getElementById(cx('control-center-item'))}
        >
          <div
            id={cx('control-center-item')}
            className={cx('nav-item', {
              selected: pathname === routeConfig.home || pathname === routeConfig.home,
            })}
          >
            在库人员
          </div>
        </Dropdown> */}
        <NavLink
          to={routeConfig.testPage}
        //   activeClassName={cx('selected')}
        >
          <Dropdown
            overlay={controlMenu}
            getPopupContainer={() => document.getElementById(cx('control-center-item'))}
          >
            <div
              id={cx('control-center-item')}
              className={cx('nav-item', {
                selected:
                  pathname === routeConfig.testPage || pathname === routeConfig.testPage,
              })}
            >
              私人定制
            </div>
          </Dropdown>
        </NavLink>
      </div>
    );
  }

  renderSetting() {
    const logout = (
      <div className={cx('user-drop')}>
        <div
          role="button"
          className={cx('item', 'change-pwd')}
          onClick={() => {
            this.showChangePassword = 'show';
          }}
        >
          修改密码
        </div>
        <div role="button" className={cx('item', 'logout')} onClick={this.model.logout}>
          退出
        </div>
      </div>
    );
    return (
      <div className={cx('right-part')}>
        {/* <div role="button" className={cx('setting-item')}>
          <div className={cx('config-text')}>问题反馈</div>
        </div> */}
        <Dropdown
          overlay={logout}
          trigger={['click']}
          onVisibleChange={this.model.setLogoutVisible}
        >
          <div
            role="button"
            className={cx('setting-item', {
              hover: this.model.logoutVisible,
            })}
          >
            {/* <div className={cx('user-info-text')}>{Cookie.getCookie('userName')}</div> */}
            <div className={cx('user-info-text')}>{this.username ? this.username : '未登录'}</div>
            <div className={`${cx('user-info-icon')} BPO BPO-arrow-down`} />
          </div>
        </Dropdown>
      </div>
    );
  }

  render() {
    return (
      <div className={cx('container')}>
        <div className={cx('top-bar')}>
          <div className={cx('left-part')}>
            <Link to={routeConfig.home}>
              <div className={cx('logo')}>
                <img src={logo} alt="logo" />
                <span className={cx('logo-text')}>&nbsp;&nbsp;上海公安一人一档</span>
              </div>
            </Link>
            {this.renderNav()}
          </div>
          {this.renderSetting()}
        </div>
        <div className={cx('children')}>
          <div className={cx('background')}>{this.props.children}</div>
        </div>
        {this.showChangePassword !== '' ? (
          <ChangePassword
            visible={this.showChangePassword !== ''}
            force={this.showChangePassword === 'force'}
            onOk={() => {
              this.showChangePassword = '';
              message.warning('修改密码成功，请重新登录！');
              http.get('/login/getLogOut');
              setTimeout(() => {
                window.location.href = routeConfig.home;
              }, 2000);
            }}
            onCancel={() => {
              this.showChangePassword = '';
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default TopBar;
