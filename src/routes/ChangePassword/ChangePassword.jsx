import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import http from 'common/http';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, Form, Input, Button, Icon, message } from 'antd';

const PREFIX = 'change-password';
const cx = utils.classnames(PREFIX);
const FormItem = Form.Item;

@observer
class ChangePassword extends Component {
  @observable passwordError = false;
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error('您输入的信息有误');
        return;
      }
      http
        .get('/login/changePwd', {
          password: fieldsValue.oldPassword,
          newPwd: fieldsValue.newPassword,
        })
        .then(res => {
          if (res) {
            if (res.status === '3') {
              message.error(res.message || '');
              this.passwordError = true;
            } else if (res.status === '0') {
              message.info('修改成功');
              setTimeout(() => {
                this.props.onOk();
              }, 1000);
            }
          } else {
            message.error('修改密码出错');
          }
        });
    });
  };
  render() {
    const { getFieldDecorator, getFieldValue, validateFields } = this.props.form;
    return (
      <Modal
        width={this.props.width}
        title="修改密码"
        visible={this.props.visible}
        closable={!this.props.force}
        maskClosable={!this.props.force}
        onCancel={this.props.onCancel}
        onOk={this.props.onOk}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem validateStatus={this.passwordError ? 'error' : ''}>
            {getFieldDecorator('oldPassword', {
              rules: [{ required: true, message: '请输入原密码' }],
            })(
              <Input
                onChange={() => {
                  this.passwordError = false;
                }}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请输入原密码"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('newPassword', {
              rules: [{ required: true, message: '请输入新密码' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请输入新密码"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirmPassword', {
              rules: [
                { required: true, message: '请输入新密码' },
                {
                  validator: (rule, value, callback) => {
                    if (value !== '' && value !== getFieldValue('newPassword')) {
                      callback('两次输入的新密码不一致');
                    } else callback();
                  },
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请再次确认新密码"
              />,
            )}
          </FormItem>

          <Button type="primary" htmlType="submit">
            确认修改
          </Button>
        </Form>
      </Modal>
    );
  }
}

ChangePassword.propTypes = {
  force: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
};

ChangePassword.defaultProps = {
  force: false,
  visible: false,
  width: 450,
  onCancel: () => {},
  onOk: () => {},
};

export default Form.create({})(ChangePassword);
