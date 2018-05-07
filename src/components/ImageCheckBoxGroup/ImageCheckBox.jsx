import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import './ImageCheckBox.scss';
import imgDefault from './images/img-default.png';

const PREFIX = 'image-check-box';
const cx = utils.classnames(PREFIX);

class ImageCheckBox extends Component {
  render() {
    return (
      <div
        role="button"
        className={`${PREFIX} ${this.props.className || ''} ${cx({
          'hide-image': this.props.hideImage,
          disabled: this.props.disabled,
        })}`}
        onClick={this.props.onClick}
      >
        <div
          role="button"
          onClick={() => {
            if (this.props.disabled) return;
            if (this.props.type === 'checkbox' && this.props.checked) this.props.onCheck(false);
            else this.props.onCheck(true);
          }}
          className={cx('check-btn', {
            radio: this.props.type !== 'checkbox',
            checked: this.props.checked,
          })}
        />
        <div className={cx('info')}>
          {this.props.hideImage ? null : (
            <div
              role="button"
              className={cx('image')}
              onClick={(...args) => {
                if (this.props.disabled) return;
                this.props.onImgClick.apply(this, args);
              }}
            >
              <img src={this.props.img} alt="" />
            </div>
          )}
          <div
            role="button"
            className={cx('text')}
            onClick={(...args) => {
              if (this.props.disabled) return;
              this.props.onTextClick.apply(this, args);
            }}
          >
            {this.props.text}
          </div>
        </div>
      </div>
    );
  }
}

ImageCheckBox.propTypes = {
  type: PropTypes.oneOf(['checkbox', 'radio']),
  img: PropTypes.string,
  text: PropTypes.string,
  hideImage: PropTypes.bool,
  checked: PropTypes.bool,
  onCheck: PropTypes.func,
  onImgClick: PropTypes.func,
  onTextClick: PropTypes.func,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

ImageCheckBox.defaultProps = {
  type: 'radio',
  text: 'text',
  img: imgDefault,
  hideImage: false,
  checked: false,
  onCheck: () => {},
  onClick: () => {},
  onImgClick: () => {},
  onTextClick: () => {},
  disabled: false,
};

export default ImageCheckBox;
