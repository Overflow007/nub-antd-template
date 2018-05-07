import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import {Modal,Tabs} from 'antd';
import http from 'common/http';
import utils from 'common/utils';
import modalStyle from './FlowModal.scss'
import DispatchRule from './tabList/DispatchRule'
import FlowParameter from './tabList/FlowParameter'
import AbnormalCause from './tabList/AbnormalCause'
const TabPane = Tabs.TabPane;

const PREFIX = 'flow-flowDefModal';
const cx = utils.classnames(PREFIX, modalStyle);



class FlowModal extends Component {
    constructor(props) {
        super(props);
        // this.popupModel = popupModel;
        this.state={
            loading:true,
            data:[]
        }
        // this.columns = [
        //     {title:'消息重投',dataIndex:'operations',width:100,render: (text, record) => {
        //         return (<a key={`${record.id}`} onClick={()=>{
        //             const newP = {...record};
        //             newP.systemCode=session.currentTendant.tenantCode;
        //             http.post('/call/call.do',{
        //                 bean: 'FlowOperServ',
        //                 method: 'reExcuteMsg',//'qryWorkItemByCond',
        //                 param: newP
                        
                        
        //             },{
        //                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //             }).then(res => {
        //                 if(res == '"fail"'){
        //                     message.error('重投失败');
        //                 }else{
        //                     message.success('重投成功');
                           
        //                     this.loadData();
        //                 }
        //                 //console.log('success!!',res);
        //             },res => {
        //                 message.error('重投失败');
        //                 console.log('failed!!',res);
        //             });
        //         }}>消息重投</a>);
        //     }},
        //     {title:'接口编码',dataIndex:'commandCode',width:100},
        // {title:'流程实例标识',dataIndex:'processInstanceId',width:100},
        // {title:'工作项',dataIndex:'workItemId',width:100},
        // {title:'创建时间',dataIndex:'createDate',width:120},
        // {title:'接口接收消息',dataIndex:'commandMsg',width:120},
        // {title:'接口反馈消息',dataIndex:'commandResultMsg',width:120}];
    }



    
    loadData=()=>{
        // const param = {
        //     processInstanceId:this.props.processInstance.processInstanceId,
        //     'systemCode':session.currentTendant.tenantCode
        // };
        // this.setState({
        //     loading:true
        // });
        // http.post('/call/call.do',{
        //     bean: 'FlowInstServ',
        //     method: 'qryCommandMsgInfoByPid',//'qryWorkItemByCond',
        //     param: param
            
            
        // },{
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        // }).then(res => {
        //     const returnData = JSON.parse(res);
        //     if(returnData&&returnData.rows){
                
        //         this.setState({
        //             data:returnData.rows
        //         });
        //     }else{
        //         this.setState({
        //             data:[]
        //         });
        //     }

        //     this.setState({
        //         loading:false
        //     });
            
        //     //console.log('success!!',res);
        // },res => {
        //     this.setState({
        //         loading:false
        //     });
        //     console.log('failed!!',res);
        // });
    }
    callback=(key)=>{
        console.log(key)
    }

    componentDidMount() {
        
        this.loadData();
    }

    render(){
        //this.props.flowInstance为当前选择的流程实例
        return ( <Modal
            title="节点配置"
            mask={true}
            width={'90%'}
            loading={this.state.loading}
            maskClosable={true}
            footer={false}
            onCancel={this.props.onCancel}
            visible={true}
            className={`${cx('modalCtn')}`}
          >
                    <Tabs onChange={this.callback} type="card" className={`${cx('modalTabs')}`} defaultActiveKey={this.props.modalIframeData.name}>
                        <TabPane tab="配置流程参数" key="editFlowParams">
                            <FlowParameter></FlowParameter>
                        </TabPane>
                        <TabPane tab="配置派发规则" key="editDispatchRules">
                            <DispatchRule modalIframeData={this.props.modalIframeData}></DispatchRule>
                        </TabPane>
                        <TabPane tab="配置异常原因" key="editFlowException">
                            <AbnormalCause/>
                        </TabPane>
                        <TabPane tab="配置节点事件" key="editFlowEvent">配置节点事件</TabPane>
                    </Tabs>


          </Modal>);
    }

}

export default FlowModal;