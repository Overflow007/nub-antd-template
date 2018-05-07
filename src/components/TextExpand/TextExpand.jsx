import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { observable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';

import './TextExpand.scss';

const PREFIX = 'text-expand';
const cx = utils.classnames(PREFIX);

@observer
class TextExpand extends Component {
  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentDidUpdate() {
    if (this.hover) {
      if (this.domExpand) this.height = this.domExpand.clientHeight;
    } else if (this.domText) {
      this.height = this.domText.clientHeight;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp, false);
  }

  onMouseUp = () => {
    this.mousedown = false;
    this.checkHover();
  };

  hover = false;
  @observable realHover = false;
  @observable showExpand = false;
  mousedown = false;
  mouseover = false;

  checkHover = () => {
    this.hover = this.mousedown || this.mouseover;
    if (this.hoverTimer || this.expandTimer) {
      clearTimeout(this.hoverTimer);
      clearTimeout(this.expandTimer);
    }
    if (this.hover) this.realHover = this.hover;
    else {
      this.hoverTimer = setTimeout(() => {
        this.realHover = false;
        this.expandTimer = setTimeout(() => {
          this.showExpand = false;
        }, 300);
      }, this.props.delay);
    }
  };
  @observable height = 0;

  render() {
    return (
      <div
        onMouseDown={() => {
          this.mousedown = true;
          this.checkHover();
        }}
        onMouseEnter={() => {
          this.mouseover = true;
          this.checkHover();

          this.showExpand = true;
        }}
        onMouseLeave={() => {
          this.mouseover = false;
          this.checkHover();
        }}
        className={`${PREFIX} ${this.props.className || ''}`}
        style={_.assign(
          {
            height: this.height || '',
          },
          this.props.style,
        )}
      >
        <div
          ref={dom => {
            this.domText = dom;
          }}
          className={cx('text', { hover: this.realHover })}
        >
          {this.props.text}
        </div>
        {this.showExpand ? (
          <div
            ref={dom => {
              this.domExpand = dom;
            }}
            className={cx('expand', { hover: this.realHover, 'not-hover': !this.realHover })}
            style={{
              top: this.props.top,
              backgroundColor: this.props.backgroundColor,
              maxHeight: this.props.maxHeight,
            }}
          >
            {this.props.text}
          </div>
        ) : null}
      </div>
    );
  }
}

TextExpand.propTypes = {
  text: PropTypes.string,
  backgroundColor: PropTypes.string,
  top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  delay: PropTypes.number,
};

TextExpand.defaultProps = {
  text: '',
  backgroundColor: 'transparent',
  top: 0,
  maxHeight: 'auto',
  delay: 0,
};

export default TextExpand;
