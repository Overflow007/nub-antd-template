import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import _ from 'lodash';
import utils from 'common/utils';
import './Timeline.scss';

const PREFIX = 'timeline';
const cx = utils.classnames(PREFIX);

class Timeline extends Component {
  getItems() {
    if (this.props.reverse) {
      return _.clone(this.props.items).reverse();
    }
    return _.clone(this.props.items);
  }

  render() {
    return (
      <div className={PREFIX} style={this.props.style}>
        {this.getItems().map((item, index) => (
          <div key={index} className={cx('item-with-tail')}>
            {index > 0 ? <div className={cx('tail')} /> : null}
            <div
              role="button"
              className={cx('item')}
              onClick={() => {
                this.props.onItemClick(item, index);
              }}
            >
              <Tooltip title={item.tooltipLeft} placement="topRight">
                <div className={cx('left-text')}>{item.textLeft}</div>
              </Tooltip>
              <div className={cx('index', item.className)}>{item.index}</div>
              <div className={cx('right-text')}>{item.textRight}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Timeline.propTypes = {
  reverse: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      textLeft: PropTypes.string,
      index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      textRight: PropTypes.string,
      className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
    })
  ),
  onItemClick: PropTypes.func,
};

Timeline.defaultProps = {
  reverse: false,
  items: [],
  onItemClick: () => {},
};

export default Timeline;
