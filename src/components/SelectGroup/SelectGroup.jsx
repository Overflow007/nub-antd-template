import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { observable, extendObservable, computed, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Select, AutoComplete } from 'antd';
import './SelectGroup.scss';

const PREFIX = 'select-group';
const cx = utils.classnames(PREFIX);
@observer
class SelectGroup extends Component {
  constructor(props) {
    super(props);
    this.data = this.data || {};
  }

  onChange(item, index, value) {
    if (item.code == null) return;
    this.data[item.code] = value;
    this.props.datas.forEach(it => {
      if (typeof this.data[it.code] !== 'undefined') {
        if (it.hide === true || (typeof it.hide === 'function' && it.hide(this.data) === true)) {
          if (it.keepValue !== true) {
            this.data[it.code] = null;
          }
        }
      }
    });
    this.props.onChange(this.data, item);
  }

  @observable dataSource = {};
  renderSelect = (item, index) => {
    const onSearch = value => {
      if (typeof item.onSearch === 'function') {
        item.onSearch(value, data => {
          this.dataSource[item.code] = data;
        });
      }
    };

    if (item.type === 'autoComplete') {
      if (this.dataSource[item.code] == null) {
        const obj = {};
        obj[item.code] = [];
        extendObservable(this.dataSource, obj);
        // onSearch('');
      }
      return (
        <AutoComplete
          defaultActiveFirstOption={false}
          getPopupContainer={this.props.getPopupContainer}
          dropdownMatchSelectWidth={false}
          allowClear
          key={item.code}
          style={item.style}
          value={item.value}
          placeholder={item.placeholder}
          dataSource={toJS(this.dataSource[item.code])}
          onSelect={value => {
            this.onChange(item, index, value);
          }}
          onSearch={onSearch}
        />
      );
    }
    return (
      <Select
        getPopupContainer={this.props.getPopupContainer}
        allowClear
        key={item.code}
        value={item.value ? item.value : undefined}
        placeholder={item.placeholder}
        style={item.style}
        onChange={value => {
          this.onChange(item, index, value);
        }}
      >
        {(item.data || []).map(d => (
          <Select.Option key={d.value} value={d.value}>
            {d.text}
          </Select.Option>
        ))}
      </Select>
    );
  };

  render() {
    return (
      <div className={`${PREFIX} ${this.props.className || ''}`} style={this.props.style}>
        {this.props.datas.map((item, index) => {
          this.data[item.code] = item.value;
          return item.hide === true ||
            (typeof item.hide === 'function' && item.hide(this.data) === true)
            ? null
            : this.renderSelect(item, index);
        })}
      </div>
    );
  }
}

SelectGroup.propTypes = {
  datas: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
  getPopupContainer: PropTypes.func,
};

SelectGroup.defaultProps = {
  datas: [],
  onChange: () => {},
};

export default SelectGroup;
