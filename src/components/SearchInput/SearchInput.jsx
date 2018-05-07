import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import utils from 'common/utils';
import styles from './SearchInput.scss';

const { Search } = Input;
const PREFIX = 'search-input';
const cx = utils.classnames(PREFIX, styles);

class SearchInput extends Component {
  render() {
    const attrObj = {};
    if (this.props.value !== undefined) {
      attrObj.value = this.props.value;
    }
    if (this.props.onChange !== undefined) {
      attrObj.onChange = this.props.onChange;
    }
    return (
      <Search
        className={`${cx('search')} ${this.props.className}`}
        placeholder={this.props.placeholder}
        style={this.props.style}
        onSearch={this.props.onSearch}
        defaultValue={this.props.defaultValue}
        {...attrObj}
      />
    );
  }
}
SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  defaultValue: PropTypes.string,
};

SearchInput.defaultProps = {
  placeholder: '请输入要搜索的内容',
  className: '',
};

export default SearchInput;
