import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { Icon } from 'antd';
import './Number.scss';

const PREFIX = 'number';
const cx = utils.classnames(PREFIX);

class Number extends Component {
  render() {
    return (
      <span
        className={`${cx('content', { 'type-primary': this.props.type === 'primary' })} ${this.props
          .className || ''}`}
        style={this.props.style}
      >
        {this.props.loading ? '···' : this.props.children}
      </span>
    );
  }
}

Number.propTypes = {
  loading: PropTypes.bool,
  type: PropTypes.string,
};

Number.defaultProps = {
  loading: false,
};

export default Number;
