import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon, Checkbox } from 'antd';
import { observer } from 'mobx-react';
import utils from 'common/utils';
import session from 'models/Session';
import WrappedNormalLoginForm from './LoginForm';
import styles from './Login.scss';
import imgLogo from './logo.png';

const PREFIX = 'flow-login';
const cx = utils.classnames(PREFIX, styles);
const FormItem = Form.FormItem;

@observer
class Login extends Component {

  constructor(props) {
    super(props);
    this.session = session;
}

  render() {

    return (
      <div className={`${cx('container')}`} >
        <div className={`${cx('header')} ${ this.session.preLogin? cx('header_fadeOut'):''}`} >
            <img src={imgLogo} className={`logo`} alt="logo" />
        </div>
        <div className={`${cx('form')} ${cx('form_crystal')} ${ this.session.preLogin? cx('form_fadeOut'):''}`}>
           <WrappedNormalLoginForm /> 
        </div>
      </div>
    );
  }
}

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
