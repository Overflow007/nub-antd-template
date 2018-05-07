import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import { observer } from 'mobx-react';
import session from 'models/Session';
import http from 'common/http';
import base64 from 'common/base64';
import {
  setCookie,
  getCookie,
} from 'common/cookie';

const FormItem = Form.Item;
@observer
class NormalLoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      
      if (!err) {
        http.post('/login.do',values,{
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }).then(res => {
          message.success('登录成功');
          
          setTimeout(()=>{
            session.login({
              'token':'888888',
              profile:{
                "areaId":1,
                "systemCode":"FLOWPLAT",
                "staffName":"uosflow",
                "staffId":1,
                "tenant":"FLOWPLAT",
                "username":"uosflow"
              },
              tendants:[{
                "tenantId":"FLOWPLAT",
                "tenantName":"流程平台"
              },{
                "tenantId":"IOM",
                "tenantName":"开通系统"
              }]
            });
          },300);

          session.setPreLogin(true);
          if(values.remember){
            const usr = base64.encode(JSON.stringify(values));

            setCookie('u_c_r',usr);
            
          }else{
            setCookie('u_c_r',null);
          }
          

        },res => {
          message.error('登录失败');

          setTimeout(()=>{
            session.login({
              'token':'888888',
              profile:{
                "areaId":1,
                "systemCode":"FLOWPLAT",
                "staffName":"uosflow",
                "staffId":1,
                "tenant":"FLOWPLAT",
                "username":"uosflow"
              },
              tendants:[{
                "tenantId":"FLOWPLAT",
                "tenantName":"流程平台"
              },{
                "tenantId":"IOM",
                "tenantName":"开通系统"
              }]
            });
          },300);

          session.setPreLogin(true);
          if(values.remember){
            const usr = base64.encode(JSON.stringify(values));

            setCookie('u_c_r',usr);
            
          }else{
            setCookie('u_c_r',null);
          }
        });
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let u_c_r = getCookie('u_c_r');
    if(u_c_r){
      u_c_r = JSON.parse( base64.decode(getCookie('u_c_r')));
    }
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入您的用户名。' }],
            initialValue:(u_c_r?u_c_r.username:null)
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码。' }],
            initialValue:(u_c_r?u_c_r.password:null)
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住我</Checkbox>
          )}
          <a className="login-form-forgot">忘记密码</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;