import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import './TextExt.scss';

const PREFIX = 'text-ext';
const cx = utils.classnames(PREFIX);

let index = 0;
class TextExt extends Component {
  componentDidMount() {
    this._text.style.position = 'absolute';
    this.textWidth = this._text.offsetWidth;
    this._text.style.position = 'relative';
    this.onWindowResize();
    window.addEventListener('mouseup', this.onMouseUp, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);
    this.bind = index++;
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp, false);
    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener('resize', this.onWindowResize, false);
  }

  onWindowResize = e => {
    this.boxWidth = this._textContain.offsetWidth;
    if (this.textWidth <= this.boxWidth) {
      this._text.style.overflow = 'visible';
    } else {
      this._text.style.overflow = 'hidden';
    }
    this.collapseText();
  };

  onMouseEnter = e => {
    this._mouseon = true;
    this.boxWidth = this._textContain.offsetWidth;
    this._text.style.width = this.textWidth + 'px';
    this._boxX = this._textContain.getBoundingClientRect().left;
    if (this.textWidth > this.boxWidth) {
      this._text.style.overflow = 'visible';
    }
  };

  onMouseMove = e => {
    if ((this._mouseon || this._mousedown) && this.boxWidth < this.textWidth) {
      const mouseX = e.pageX - this._boxX;
      let left =
        mouseX / this.boxWidth * (this.boxWidth - 100 - this.textWidth) + 40;
      left = Math.min(40, Math.max(-40 - this.textWidth + this.boxWidth, left));
      this._text.style.left = left + 'px';
    }
  };
  onMouseLeave = e => {
    this._mouseon = false;
    this.collapseText();
  };

  onMouseDown = e => {
    this._mousedown = true;
  };

  onMouseUp = e => {
    this._mousedown = false;
    this.collapseText();
  };

  collapseText = () => {
    if (!this._mousedown && !this._mouseon) {
      this._text.style.width = this.boxWidth + 'px';
      this._text.style.left = '';

      if (this.textWidth > this.boxWidth) {
        this._text.style.overflow = '';
      }
    }
  };

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        ref={dom => {
          this._textContain = dom;
        }}
        className={PREFIX + ' ' + (this.props.className || '')}
        style={this.props.style}
      >
        <div
          className={cx('text')}
          ref={dom => {
            this._text = dom;
          }}
        >
          {this.props.text}
        </div>
      </div>
    );
  }
}

TextExt.propTypes = {};

TextExt.defaultProps = {};

export default TextExt;
