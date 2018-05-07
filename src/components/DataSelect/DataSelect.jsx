import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';

const { Option } = Select;

class DataSelect extends Component {
    static propTypes = {
        //dataSource: PropTypes.arrayOf(PropTypes.object),
        dataValueField: PropTypes.string,
        dataKeyField: PropTypes.string,
      };

    constructor(props) {
        super(props);
        this.state = {
            'dataSource': props.dataSource,
            'dataValueField': props.dataValueField,
            'dataKeyField': props.dataKeyField,
            'selectedKey': props.selectedKey,
            'cachedSelectedKey': props.selectedKey,
            'async': props.async,
            'onChange': props.onChange
        }
        
    }

    componentWillReceiveProps(nextProps) {
        const newState = {
            dataSource: nextProps.dataSource,
            dataKeyField: nextProps.dataKeyField,
            dataValueField: nextProps.dataValueField,
            
            'async': nextProps.async,
            'onChange': nextProps.onChange
        };

        if (nextProps.async === true && nextProps.forceChange === true && nextProps.onChange) {
            nextProps.onChange(this.state.cachedSelectedKey);
            newState.selectedKey = this.state.cachedSelectedKey;
            this.setState(newState);
            return;
        }

        if (nextProps.selectedKey != this.state.selectedKey) {
            console.log('放弃了缓存里面的key', this.state.cachedSelectedKey);
            newState.selectedKey = nextProps.selectedKey;
            newState.cachedSelectedKey = nextProps.selectedKey;
        }

        this.setState(newState);
    }

    onChange = (key, option) => {
        const newState = {
            cachedSelectedKey: key
        };
        this.setState(newState);
        if (this.state.async !== true && this.state.onChange) {
            this.state.onChange(key, option);
        }
    }

    renderOptions = () => {
        
        return this.state.dataSource.map(x => {
            return (<Option key={`${x[this.state.dataKeyField]}`}>{`${x[this.state.dataValueField]}`}</Option>);
        });
    }

    render() {
          return (<Select {...this.props} value={this.state.cachedSelectedKey} onChange={this.onChange}>
                    {this.renderOptions()}
                </Select>);
    }
 }

 export default DataSelect;