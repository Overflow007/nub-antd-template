import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { Icon } from 'antd';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import './FullScreen.scss';

const PREFIX = 'full-screen';
const cx = utils.classnames(PREFIX);

@observer
class FullScreen extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.onResize, false);
    this.onResize();
  }

  componentDidUpdate() {
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);
  }

  onResize = () => {
    const width = this.dom.clientWidth;
    const height = this.dom.clientHeight;
    if (this.width !== width || this.height !== height) {
      this.width = width;
      this.height = height;
      this.props.onResize(width, height);
    }
  };

  @observable fullScreen = false;
  render() {
    return (
      <div
        ref={dom => {
          this.dom = dom;
        }}
        className={`${PREFIX} ${this.props.className || ''} ${cx({ full: this.fullScreen })}`}
        style={this.props.style}
      >
        {this.props.children}
        <Icon
          className={cx('btn-full-screen')}
          onClick={() => {
            this.fullScreen = !this.fullScreen;
          }}
          type={this.fullScreen ? 'shrink' : 'arrows-alt'}
        />
      </div>
    );
  }
}

FullScreen.propTypes = {
  onResize: PropTypes.func,
};

FullScreen.defaultProps = {
  onResize: () => {},
};

export default FullScreen;
