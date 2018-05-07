import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { Layout, Table, Tabs, Modal,Button,Select, Input, message  } from 'antd';
import popupModel from '../models/FlowInstanceModel';
import session from 'models/Session';
import StandardTable from 'components/StandardTable';
import './FlowMsg.scss';

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const PREFIX = 'flow-ins-msg'

@observer
class FlowMsg extends Component {
    constructor(props) {
        super(props);
        this.popupModel = popupModel;
        this.state={
            data:[],
            selectedRowKeys: [],
            selectedRows: []
        }
        this.columns = [
            {title:'消息重投',dataIndex:'operations',width: 100,render: (text, record) => {
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
            {title:'接口编码',dataIndex:'commandCode',width: 100},
            {title:'流程实例标识',dataIndex:'processInstanceId',width: 100},
            {title:'工作项',dataIndex:'workItemId',width: 100},
            {title:'创建时间',dataIndex:'createDate',width: 120},
            {title:'接口接收消息',dataIndex:'commandMsg',width: 120},
            {title:'接口反馈消息',dataIndex:'commandResultMsg',width: 120}];
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

    /**
     * 选中表格行数据
	 * @param row
	 */
	handleRowClick = row => {
        console.log(row);
        this.setState({
            selectedRowKeys: row.id,
            selectedRows: [row]
        });
    };

    renderMsg = () => {
        const { commandMsg, commandResultMsg } = this.state.selectedRows[0];
        return (
            <Tabs defaultActiveKey="commandMsg">
                <TabPane tab="消息请求" key="commandMsg"><TextArea style={{ margin: '5px', width: '98%', height: 'calc(100% - 20px)' }} value={`${commandMsg}`} /></TabPane>
                <TabPane tab="消息反馈" key="commandResultMsg"><TextArea style={{ margin: '5px', width: '98%', height: 'calc(100% - 20px)' }} value={`${commandResultMsg}`} /></TabPane>
            </Tabs>
        );
    }

    render(){
        //this.props.flowInstance为当前选择的流程实例
        return (
            <div className={`${PREFIX}`}>
                <div style={{ float: 'left', width: '60%', height: '100%', borderRight: '1px solid #EEEEEE', padding: '0 18px 0 0' }}>
                    <div style={{color: '#000000d9', fontSize: '16px', lineHeight: '22px', fontWeight: '500', height: '45px', padding: '10px 0' }}>
                        接口消息交互记录
                    </div>
                    
                    <StandardTable 
                        bordered={true}
                        rowKey="id"
                        columns={this.columns} 
                        data={{rows: this.state.data, pagination: false}} 
                        selectedRowKeys={this.state.selectedRowKeys}
                        loading={this.state.loading}
                        onRowClick={this.handleRowClick}
                        scroll={{ x: true, y: (document.querySelector('body').clientHeight - 350) }}
                        rowSelection={{ type: 'single' }}
                        clicktoSelect={true}
                    />

                </div>
                <div style={{ float: 'right', width: '40%', height: '100%', borderLeft: '1px solid #EEEEEE' }}>
                    { this.state.selectedRows.length > 0 ? this.renderMsg() : null }
                </div>
            </div>
        );
    }

}


export default FlowMsg;