import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { Modal, Icon, Button, Select, message } from 'antd';
import http from 'common/http';
import {
  setCookie,
  getCookie,
} from 'common/cookie';
import session from 'models/Session';
import themeConfig from 'models/ThemeConfig';
import DynamicForm from 'components/DynamicForm';

class ChangeTenant extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  handleChangeTenant = () => {
    this.refs.changeTenantForm.validateFields((err, values) => {
      if (err) return;
      console.log(values);
      http.post('/user/setTenant.do', values).then(res => {
        //session.hasQrySession = false;

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
        console.log('login', token, profile);
        session.logout();
        setTimeout(()=>{
          session.login(token,profile,this.props.tendants);
        },100)
      }, res => res);
    });
  }

  renderTendantOpts() {
    return this.props.tendants.map(t => {
      return (<Select.Option key={`${t.tenantCode}`} value={`${t.tenantCode}`}>{`${t.tenantName}`}</Select.Option>)
    });
  }

  render() {
    return (<Modal
      visible={true}
      title="变更租户"
      onOk={this.handleChangeTenant}
      onCancel={this.props.onCancel}
      footer={[
        <Button key="submit" type="primary" onClick={this.handleChangeTenant}>
          变更
              </Button>,
        <Button key="back" onClick={this.props.onCancel}>返回</Button>
      ]}
    >

      <DynamicForm ref='changeTenantForm'
        formConfig={{
          layout: 'inline',
          fields: [{

            label: '租户',
            showLabel: false,
            key: 'tenantCode',
            type: 'select',
            props: {
              defaultValue: session.currentTendant.tenantCode,
              style: { width: 200 }
            },
            rules: [{
              required: true,
              message: "请选择租户"
            }],
            needExpend: false,
            options: this.props.tendants.map(x => {
              return {
                value: x.tenantCode,
                text: x.tenantName
              }
            }),
          }
          ],

          submitButtonProps: {

          }
        }}
        hideFooter={true}
        onSubmit={this.handleSearch}
      />

    </Modal>)
  }
}

export default ChangeTenant;