import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import _ from 'lodash';
import './StretchImg.scss';

const PREFIX = 'stretch-img';
const cx = utils.classnames(PREFIX);

class StretchImg extends Component {
  render() {
    return (
      <div
        className={`${PREFIX} ${this.props.className || ''}`}
        style={_.assign({}, this.props.style, {
          height: this.props.height,
          width: this.props.width,
          backgroundImage: `url(${this.props.src})`,
          backgroundSize: this.props.backgroundSize,
        })}
      />
    );
  }
}

StretchImg.propTypes = {
  src: PropTypes.string,
  backgroundSize: PropTypes.oneOf(['cover', 'contain']),
  onError: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

StretchImg.defaultProps = {
  backgroundSize: 'cover',
};

export default StretchImg;
