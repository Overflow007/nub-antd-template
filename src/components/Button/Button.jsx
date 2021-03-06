import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button as ButtonAntd } from 'antd';
import utils from 'common/utils';
import styles from './Button.scss';

const PREFIX = 'button';
const cx = utils.classnames(PREFIX, styles);

class Button extends Component {
  renderIcon() {
    const { iconType, icon, loading } = this.props;

    if (loading) {
      return null;
    } else if (icon) {
      return icon;
    }

    switch (iconType) {
      case 'download':
        return <i className="iconfont icon-xiazai" />;
      case 'upload':
        return <i className="iconfont icon-daochu" />;
      default:
        return null;
    }
  }

  render() {
    return (
      <ButtonAntd
        type={this.props.type}
        style={this.props.style}
        className={`${cx('button', {
          primary: this.props.type === 'primary',
          default: this.props.type === 'default',
          text: this.props.type === 'text',
        })} ${this.props.className}`}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        loading={this.props.loading}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
      >
        {this.props.children || (
          <div className={cx('content')}>
            <span className={cx('render-icon')}>{this.renderIcon()}</span>
            <span className={cx('content-text')}>{this.props.text}</span>
          </div>
        )}
      </ButtonAntd>
    );
  }
}

Button.propTypes = {
  icon: PropTypes.element,
  iconType: PropTypes.oneOf(['download', 'upload', undefined]),
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  style: PropTypes.object /* eslint react/forbid-prop-types:0 */,
  className: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'default', 'text']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
};

Button.defaultProps = {
  text: '',
  disabled: false,
  type: 'default',
  loading: false,
};

export default Button;
