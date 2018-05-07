import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { Table, Modal,Button,Select,message  } from 'antd';
import popupModel from '../models/FlowInstanceModel';
import session from 'models/Session';

@observer
class FlowMsg extends Component {
    constructor(props) {
        super(props);
        this.popupModel = popupModel;
        this.state={
            data:[]
        }
        this.columns = [
            {title:'消息重投',dataIndex:'operations',width:100,render: (text, record) => {
                return (<a key={`${record.id}`} onClick={()=>{
                    const newP = {...record};
                    newP.systemCode=session.currentTendant.tenantCode;
                    http.post('/call/call.do',{
                        bean: 'FlowOperServ',
                        method: 'reExcuteMsg',//'qryWorkItemByCond',
                        param: newP
                        
                        
                    },{
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }).then(res => {
                        if(res == '"fail"'){
                            message.error('重投失败');
                        }else{
                            message.success('重投成功');
                           
                            this.loadData();
                        }
                        //console.log('success!!',res);
                    },res => {
                        message.error('重投失败');
                        console.log('failed!!',res);
                    });
                }}>消息重投</a>);
            }},
            {title:'接口编码',dataIndex:'commandCode',width:100},
        {title:'流程实例标识',dataIndex:'processInstanceId',width:100},
        {title:'工作项',dataIndex:'workItemId',width:100},
        {title:'创建时间',dataIndex:'createDate',width:120},
        {title:'接口接收消息',dataIndex:'commandMsg',width:120},
        {title:'接口反馈消息',dataIndex:'commandResultMsg',width:120}];
    }
    loadData=()=>{
        const param = {
            processInstanceId:this.props.processInstance.processInstanceId,
            'systemCode':session.currentTendant.tenantCode
        };
        this.setState({
            loading:true
        });
        http.post('/call/call.do',{
            bean: 'FlowInstServ',
            method: 'qryCommandMsgInfoByPid',//'qryWorkItemByCond',
            param: param
            
            
        },{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            const returnData = JSON.parse(res);
            if(returnData&&returnData.rows){
                
                this.setState({
                    data:returnData.rows
                });
            }else{
                this.setState({
                    data:[]
                });
            }

            this.setState({
                loading:false
            });
            
            //console.log('success!!',res);
        },res => {
            this.setState({
                loading:false
            });
            console.log('failed!!',res);
        });
    }

    componentDidMount() {
        
        this.loadData();
    }

    render(){
        //this.props.flowInstance为当前选择的流程实例
        return ( <Modal
            title="接口消息交互记录"
            mask={true}
            width={'90%'}
            loading={this.state.loading}
            maskClosable={true}
            footer={null}
            onCancel={this.props.onCancel}
            visible={true}
          >
            <div>
                
            <Table bordered rowKey={'id'} scroll={{ y: (document.querySelector('body').clientHeight-300) }}  dataSource={this.state.data} pagination={false} columns={this.columns} />
            
            </div>
          </Modal>);
    }

}

export default FlowMsg;