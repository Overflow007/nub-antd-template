import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Modal, Button, Popover, Icon, message } from 'antd';
import moment from 'moment';
import { extractPath } from 'common/path';
import styles from './UndoWorkItemManager.scss';
import { Layout, Menu } from 'antd';
import { observable } from 'mobx';
import ToApproveList from './ToApproveList';
import ApprovalList from './ApprovalList';
import session from 'models/Session';

const PREFIX = 'flow-undoworkitemmgr';
const cx = utils.classnames(PREFIX);
const { Sider, Content } = Layout;
const MenuItemGroup = Menu.ItemGroup;
/**
 * 待办工作项查询
 */

@observer
class UndoWorkItemManager extends React.Component {
  @observable navType = '1';

    state={
      optionValue:1
    }
  constructor(props) {
    super(props);

}



//处理完成
options=(e)=>{
  this.refs.toList.getStateShow(e.key);
      this.setState({
        optionValue: e.key
      });
    }
      
  render() {
    const navType = this.navType;
    return (
      <div className={`${cx('ctn')}`}>
        <Layout style={{ padding: '20px 30px' }}>
          <Sider width={160} style={{ background: 'none' }}>
            <Menu onClick={this.options}
              style={{ width: '160px', lineHeight: '40px', background: '#fff' }}
              defaultSelectedKeys={['1']}
            >
              <MenuItemGroup title="我的审批">
                <Menu.Item key="1">我的申请</Menu.Item>
				        <Menu.Item key="2">待我处理</Menu.Item>
                <Menu.Item key="4">处理完成</Menu.Item>
              </MenuItemGroup>
            </Menu> 
          </Sider>
          <Layout style={{ background: '#fff', marginLeft: '20px' }}>
            <Content>
              <div style={{ padding: '0 25px' }}>
                {(() => {
                  switch (navType) {
                    case '1':
                      // return <ToApproveList ref="toList" workState={this.state.optionValue}  navType={navType} />;
                      return <ToApproveList ref="toList" workState={this.state.optionValue}  navType={navType} />;
                    default:
                      return <ApprovalList navType={navType} />;
                  }
                })()}
              </div>
            </Content>
          </Layout>
        </Layout>

      </div>
    );
  }
}

UndoWorkItemManager.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    navType: PropTypes.string,
  }),
};

export default UndoWorkItemManager;