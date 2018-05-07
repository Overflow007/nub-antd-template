import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { Table, Modal,Button,Select,message  } from 'antd';

class ReasonDelete extends Component {

    constructor(props) {
        super(props);
        this.state={
            data:[],
            visible: true
        }
    }

    handleOk() {
        this.setState({
          visible: false
        });
    }

    handleCancel() {
        this.setState({
          visible: false
        });
    }

    componentDidMount() {
        
    }

    render(){
        //this.props.flowInstance为当前选择的流程实例
        return ( 
        <Modal title="确认删除此记录" visible = {this.state.visible} closable = 'true'
          onOk={this.handleOk} onCancel={this.handleCancel}>
        </Modal>);
    }
}

export default ReasonDelete;