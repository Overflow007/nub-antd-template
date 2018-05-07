import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { Table, Modal, Button, Popover, Icon, message } from 'antd';
import StandardTable from 'components/StandardTable';
import ReturnOrder from './ReturnOrder';
import ReverseOrder from './ReverseOrder';
import ProcessJump from './ProcessJump';
import popupModel from '../models/FlowInstanceModel';
import session from 'models/Session';
import { workitemColumns} from '../StaticConfigs'

@observer
class FlowWorkItems extends Component {

    constructor(props) {
        super(props);
        this.state={
            loading:false,
            selectedRows:[]
        }
    }

    componentDidMount() {
        if (this.refs.workitemTable) {
            this.refs.workitemTable.tryReloadDatatoPage(1);
        }

    }

    showModals=(modalName)=>{
        this.setState({
            modalName
        })
    }

    loadData=(current,pageSize,pagination, filters, sorter)=>{
        if(this.props.flowInstance==null||this.props.flowInstance.length<=0){
            return new Promise(function(resolve, reject) {
                resolve({data:{rows:[],pagination: false}})
            });
        }

        this.setState({
            loading: true
        });
        
       return http.post('/call/call.do', {
            bean: 'FlowInstServ',
            method: 'qryWorkItemByCond',//'qryWorkItemByCond',
            param: {
                processInstanceId: this.props.flowInstance.processInstanceId,
                systemCode:session.currentTendant.tenantCode
            }
            

        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                this.setState({
                    loading: false
                });
                const returnData = JSON.parse(res);
                
                if (returnData) {
                    returnData.pagination=false;
                    return {data:returnData}
                }

                return {data:{rows:[],pagination: false}}
            }, res => {
                this.setState({
                    loading: false
                });
                console.error('failed!!', res);
            });
    }

     //消息重投
     msgRepost=()=>{ 
        //this.popupModel.workItem //
            if(this.state.selectedRows[0]){
                const param ={
                    workItemId:this.state.selectedRows[0].workItemId,
                    processInstanceId:this.state.selectedRows[0].processInstanceId,
                    systemCode:session.currentTendant.tenantCode
            };
            http.post('/call/call.do',{
                bean: 'FlowOperServ',
                method: 'reCreateWorkOrder',
                param: param
            },{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                if(res == '"fail"'){
                    message.error('生成工单消息重投失败');
                }else{
                    message.success('生成工单消息重投成功');
                
                    this.rerenderInstancesData();
                }
            },res => {
                message.error('生成工单消息重投失败');
                console.log('failed!!',res);
            });
        }
    }

    

    handleSelectInstancesChange = (keys,rows) => {
        this.setState({
            selectedRows: rows,
        });
    };

    renderButton=()=>{
        if(this.state.selectedRows!=null&&this.state.selectedRows.length>0){
            
            return (
            <div style={{marginBottom:'10px', display: ((this.state.selectedRows[0].state != null && this.state.selectedRows.length > 0&&this.state.selectedRows[0].state==1) ? 'block' : 'none')}}>
            <Button.Group>
                <Button onClick={() => {
                    this.showModals('returnorder');
                }}>回单</Button>
                <Button 
                    style={{display: ((this.props.flowInstance.state==2&&this.state.selectedRows[0].direction==1) ? 'inline' : 'none')}} 
                    onClick={() => {
                        this.showModals("reverseorder");
                }}>退单</Button>
                <Button onClick={() => {this.showModals('processJump');}}>流程跳转</Button>
                <Button onClick={this.msgRepost}>消息重投</Button>
                <Button >环节操作</Button>
                <Button >增派测试</Button>
            </Button.Group>
            <Button.Group> 
                <Button>转派</Button>
                <Button>前加签</Button>
                <Button>后加签</Button>
                <Button>并加签</Button>
            </Button.Group>
        </div>)
        }
        return null;
    }

    renderModal=()=>{
        const onCancel = () => {
            this.setState({
                modalName:''
            })
        }

        const onOk = () => {
            this.setState({
                modalName:'',
                selectedRows:[]
            });
            if (this.refs.workitemTable) {
                this.refs.workitemTable.tryReloadDatatoPage(1);
                this.refs.workitemTable.clearSelectedRows();
            }
        }
        if(this.state.modalName=='returnorder'){  
            // 回单         
            return <ReturnOrder workItem={this.state.selectedRows[0]} onCancel={onCancel} onOk={onOk} />

        } else if (this.state.modalName == 'reverseorder') {
            // 正向(direction=1)并且流程状态为正常执行中(state=2)：可退单
            return <ReverseOrder flowInstance={this.props.flowInstance} workItem={this.state.selectedRows[0]} onCancel={onCancel} onOk={onOk} />
            
        }else if(this.state.modalName=='processJump'){
            // 流程跳转
            let workItem = {...this.state.selectedRows[0], fromActivityInstanceId: '123'};
            return <ProcessJump workItem={workItem} onCancel={()=>{
                this.setState({
                    modalName:''
                })
            }} onOk={()=>{
                this.setState({
                    modalName:'',
                    selectedRows:[]
                });
                if (this.refs.workitemTable) {
                    this.refs.workitemTable.tryReloadDatatoPage(1);
                    this.refs.workitemTable.clearSelectedRows();
                }
            }} />
        }
        
        
        return null;
    }

    render(){
        return (
        
            <div>
                {this.renderButton()}
                {
                    this.renderModal()
                }
                <div >


                    <StandardTable ref={"workitemTable"} rowKey={'workItemId'} 
                        data={{ rows:[], pagination: false }}
                        onSelectChange={this.handleSelectInstancesChange}
                        columns={workitemColumns}
                        loadData={this.loadData}
                        clicktoSelect={true}
                        rowSelection={{ type: 'single' }}
                        scroll={{x:true, y: (document.querySelector('body').clientHeight-350) }}
                    />

                </div>
            </div>
               
        );
    }
}

export default FlowWorkItems;