import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import ImageCheckBox from './ImageCheckBox';
import './ImageCheckBoxGroup.scss';

const PREFIX = 'image-check-box-group';
const cx = utils.classnames(PREFIX);

class ImageCheckBoxGroup extends Component {
  isChecked = code => {
    if (this.props.checked) {
      if (
        typeof this.props.checked === 'object' &&
        this.props.type === 'radio' &&
        code === this.props.checked.checkedValue
      )
        return true;
      if (
        typeof this.props.checked === 'object' &&
        this.props.type === 'checkbox' &&
        this.props.checked[code] == true
      )
        return true;
    }
    return false;
  };

  checkValue = (code, v) => {
    if (this.props.type === 'radio') {
      this.props.onChange({ checkedValue: code });
    } else {
      const checked = this.props.checked || {};
      checked[code] = v;
      this.props.onChange(checked);
    }
  };

  checkChange = code => {
    if (this.props.type === 'radio') {
      return true;
    } else {
      return !this.isChecked(code);
    }
  };

  render() {
    return (
      <div
        className={
          PREFIX +
          ' ' +
          (this.props.className || '') +
          ' ' +
          cx({ vertical: this.props.orientation == 'vertical' })
        }
        style={this.props.style}
      >
        {this.props.data.map(row => {
          return (
            <ImageCheckBox
              key={row.value}
              disabled={row.disabled || false}
              hideImage={this.props.hideImage}
              onCheck={v => {
                this.checkValue(row.value, v);
              }}
              onTextClick={() => {
                this.checkValue(row.value, this.checkChange(row.value));
              }}
              onImgClick={() => {
                this.checkValue(row.value, this.checkChange(row.value));
              }}
              type={this.props.type}
              checked={this.isChecked(row.value)}
              text={row.text}
              img={row.img}
            />
          );
        })}
      </div>
    );
  }
}

ImageCheckBoxGroup.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      code: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ),
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  type: PropTypes.oneOf(['radio', 'checkbox']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  hideImage: PropTypes.bool,
  onChange: PropTypes.func,
};

ImageCheckBoxGroup.defaultProps = {
  data: [],
  type: 'radio',
  orientation: 'horizontal',
  hideImage: false,
  onChange: () => {},
};

export default ImageCheckBoxGroup;
