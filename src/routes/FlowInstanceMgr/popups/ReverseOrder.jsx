import React, { Component } from 'react';
import { Modal, Button, message } from 'antd';
import PropTypes from 'prop-types';
import http from 'common/http'

/**
 * 退单
 */
class ReverseOrder extends Component {

    constructor(props){
        super(props);

        this.state = {
            loading: false
        }
    }

    componentDidMount = () => {
        const param = {
            packageDefineCode: this.props.flowInstance.processDefineCode
        }

        this.setState({ loading: true });
        http.post('/call/call.do', {
            bean: 'ReturnReasonServ',
            method: 'qryReturnReasonConfigs',
            param
        }, {
            'Content-Type': 'application/x-www-form-urlencoded'
        }).then(res => {
            this.setState({ loading: false });
            const resData = JSON.parse(res);
            const datas = []; // 有效异常原因
            
            if(resData.rows.length > 0){
                const resDataRows = resData.rows;
                resDataRows.map(resItem => {
                    if(resItem.tacheId != this.props.workItem.tacheId) return;
                    
                    if (resItem.targetTacheId==0) {
                        datas.push(resItem);
                    } else if(this.refs.workitemTable) {
                        const tableDataRows = this.refs.workitemTable.state.data.rows;
                        const _data = _.find(tableDataRows, o => o.tacheId == resItem.targetTacheId);
                        if(_data) datas.push(resItem);
                    }

                });
            }

            console.log('异常原因列表数据', datas);

        }, err => {
            this.setState({ loading: false });
            message.error('查询异常原因失败');
            console.error('failed!!!', err);
        });
    }

    /**
     * 处理退单
     */
    handleReverseOrder = () => {
       
    }

    render = () => {
        return (
            <Modal 
                title="选择异常原因"
                mask={true}
                loading={this.state.loading}
                maskClosable={true}
                footer={[<Button key="back" type="primary" loading={this.state.loading} onClick={this.handleReverseOrder}>退单</Button>]}
                onOk={this.props.onOk}
                onCancel={this.props.onCancel}
                visible={true}
            />
        );
    }
}

/**
 * onOk: 确认回调
 * onCancel: 取消回调
 * workItem: 工作项
 */
ReverseOrder.propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    workItem: PropTypes.object.isRequired,
    flowInstance: PropTypes.object.isRequired
}

/**
 * 参数默认值
 */
ReverseOrder.defaultProps = {
    onOk: () => {},
    onCancel: () => {},
}

export default ReverseOrder;