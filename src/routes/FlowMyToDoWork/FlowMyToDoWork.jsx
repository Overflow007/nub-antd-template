import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Modal, Button, Popover, Icon, message } from 'antd';
import moment from 'moment';
import session from 'models/Session';
import popupModel from './models/FlowInstanceModel';
import FlowExhibition from './popups/FlowExhibition';
import ReturnOrder from './popups/ReturnOrder';
import FlowMsg from './popups/FlowMsg';
import WorkitemOperations from './popups/WorkitemOperations';
import FlowWorkItems from './popups/FlowWorkItems';
import DynamicSearchForm from 'components/DynamicSearchForm';
import StandardList from 'components/StandardList';
import NonModalDialog from 'components/NonModalDialog';
import StandardTable from 'components/StandardTable';
import { columns, workitemColumns, formConfig } from './StaticConfigs'
import './FlowMyToDoWork.scss';

const PREFIX = 'flow-instance-mgr';

const cx = utils.classnames(PREFIX);

@observer
class FlowMyToDoWork extends Component {

    state = {
        showOperations: false,
        expandWorkitem: false,
        selectedRows: [],
        formValues: {},
        pagination: {
            "showSizeChanger": true,
            "showQuickJumper": true,
            "current": 1,
            "pageSize": 10,
            total: 0
        },
        sorter: {},
        filtersArg: {},
        modalName: ''
    };

    constructor(props) {
        super(props);
        this.popupModel = popupModel;
    }

    componentDidMount() {
        this.popupModel.triggerReload = this.rerenderInstancesData;
        if (this.refs.instanceSearchForm) {
            this.refs.instanceSearchForm.getForm().validateFields(this.handleSearch);
        }

    }

    componentWillUnmount() {
        this.popupModel.clear();
    }

    handleSelectInstancesChange = (keys,rows) => {
        this.setState({

            selectedRows: rows,
        });
    };


    showModals=(modalName)=>{
        this.setState({
            modalName
        })
    }
    renderModal=()=>{
        if(this.state.modalName=='workitems'){
            console.log(this.state.selectedRows[0]);
            return <FlowWorkItems flowInstance={this.state.selectedRows[0]} onCancel={()=>{
                this.setState({
                    modalName:''
                })
            }} />
        }
        if(this.state.modalName=='flowmsg'){
            return (<FlowMsg processInstance={this.state.selectedRows[0]} onCancel={()=>{
                this.setState({
                    modalName:''
                })
            }} />)
        }

        if(this.state.modalName=='flowexhibition'){
            return (<FlowExhibition flowInstance={this.state.selectedRows[0]} onCancel={()=>{
                this.setState({
                    modalName:''
                })
            }} />)
        }
        
        return null;
    }

    handleSearch = (err, values) => {
        //console.log('submit',err, values);
        if (err) return;

        for (let k in values) {
            //moment(val).format('YYYY-MM-DD HH:mm:ss')
            //console.log(k,values[k] instanceof moment);
            if (values[k] instanceof moment) {
                values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
            }
        }

        this.setState({
            formValues: values,
        });

        this.state.formValues = values;
        if (this.refs.instanceList) {
            this.refs.instanceList.tryReloadDatatoPage(1);
        }
        //this.postGetInstancesData(values,this.state.pagination,{},this.state.sorter);
    }
    
   
    suspendProcessInstance = () => {
        if (this.state.selectedRows[0]) {
            const param = {
                processInstanceId: this.state.selectedRows[0].processInstanceId,
                areaId: this.state.selectedRows[0].areaId,
                systemCode: session.currentTendant.tenantCode
            };

            http.post('/call/call.do', {
                bean: 'FlowOperServ',
                method: 'suspendProcessInstance',//'qryWorkItemByCond',
                param: param
                

            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    if (res == '"fail"') {
                        message.error('流程挂起失败');
                    } else {
                        message.success('流程挂起成功');

                        this.rerenderInstancesData();
                    }
                    //console.log('success!!',res);
                }, res => {
                    message.error('流程挂起失败');
                    console.log('failed!!', res);
                });

        }

    }

    resumeProcessInstance = () => {
        if (this.state.selectedRows[0]) {
            const param = {
                processInstanceId: this.state.selectedRows[0].processInstanceId,
                areaId: this.state.selectedRows[0].areaId,
                systemCode: session.currentTendant.tenantCode
            };

            http.post('/call/call.do', {
                bean: 'FlowOperServ',
                method: 'resumeProcessInstance',//'qryWorkItemByCond',
                param: param
                

            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    if (res == '"fail"') {
                        message.error('流程解挂失败');
                    } else {
                        message.success('流程解挂成功');

                        this.rerenderInstancesData();
                    }
                    //console.log('success!!',res);
                }, res => {
                    message.error('流程解挂失败');
                    console.log('failed!!', res);
                });

        }
    }

    cancelProcessInstance = () => {
        if (this.state.selectedRows[0]) {
            const param = {
                processInstanceId: this.state.selectedRows[0].processInstanceId,
                areaId: this.state.selectedRows[0].areaId,
                systemCode: session.currentTendant.tenantCode
            };

            http.post('/call/call.do', {
                bean: 'FlowOperServ',
                method: 'cancelProcessInstance',//'qryWorkItemByCond',
                param: param
                

            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    if (res == '"fail"') {
                        message.error('流程撤单失败');
                    } else {
                        message.success('流程撤单成功');

                        this.rerenderInstancesData();
                    }
                    //console.log('success!!',res);
                }, res => {
                    message.error('流程撤单失败');
                    console.log('failed!!', res);
                });

        }
    }

    terminateProcessInstance = () => {
        if (this.state.selectedRows[0]) {
            const param = {
                processInstanceId: this.state.selectedRows[0].processInstanceId,
                areaId: this.state.selectedRows[0].areaId,
                systemCode: session.currentTendant.tenantCode
            };

            http.post('/call/call.do', {
                bean: 'FlowOperServ',
                method: 'terminateProcessInstance',//'qryWorkItemByCond',
                param: param
                

            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    if (res == '"fail"') {
                        message.error('流程终止失败');
                    } else {
                        message.success('流程终止成功');

                        this.rerenderInstancesData();
                    }
                    //console.log('success!!',res);
                }, res => {
                    message.error('流程终止失败');
                    console.log('failed!!', res);
                });

        }
    }

    loadData = (current, pageSize, pagination) => {

        const { formValues } = this.state;
        let param = Object.assign({}, formValues);
        //param = _.merge(param, pagination);

        param.pageSize = pagination.pageSize;
        param.pageIndex = current;
        param.sortColumn='createdDate';
        param.sortOrder='desc';
        param.systemCode=session.currentTendant.tenantCode;
        if(param.processInstanceId==''){
            param.processInstanceId=undefined;
            delete param.processInstanceId;
        }

        return http.post('/call/call.do', {
            bean: 'FlowInstServ',
            method: 'qryProcessInstanceByStaff',//'qryWorkItemByCond',//新的配置：qryProcessInstanceByStaff
            param: param
        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
                    console.log(returnData);
                    return {
                        data: {
                            rows: returnData.rows,
                            pagination: {
                                ...pagination,
                                total: returnData.total,
                                current,
                                pageSize
                            }
                        }
                    }
                }
                return { data: { rows: [], pagination } }

                //console.log('success!!',res);
            }, res => res);

    }

    render() {
        const pagination = {
            pageSize: 10,
            current: 1,
            total: 0,
            showQuickJumper: true,
            onChange: ((current, pageSize, pagination) => {
            })
        };  
        if(this.state.selectedRows != null && this.state.selectedRows.length > 0){
            console.log("state",this.state.selectedRows[0]);
            console.log("stateflag",(this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==2|this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==5));
        }
    
        return (
            <div style={{ 'padding': '15px' }}>
                <div className={PREFIX}>
                    <StandardList ref={'instanceList'} allowChangeSelectType={true} columns={columns}
                        data={{ rows: [], pagination }}
                        onSelectChange={this.handleSelectInstancesChange}
                        extra={<div key={'search'} style={{ width: '500px', margin: '-17.5px 10px -17.5px 0px', position: 'relative', height: '100%', display: 'inline-block' }}>
                            <DynamicSearchForm ref='instanceSearchForm'
                                style={{ position: 'absolute', width: '500px', top: '-15px' }}
                                formConfig={formConfig}
                                hideFooter={true}
                                
                                onSubmit={this.handleSearch}
                            />
                        </div>
                      
                        }
                        loadData={this.loadData}
                        title={'我的申请'} rowKey={'processInstanceId'}>
                        <div style={{position:'sticky',top:'10px',backgroundColor:'#fff',zIndex: 199,opacity: '1',marginBottom:'10px', display: ((this.state.selectedRows != null && this.state.selectedRows.length > 0) ? 'block' : 'none') }}>
                            <Button.Group style={{ 'marginRight': '15px' }}>
                                <Button type="primary" icon="search" onClick={() => {this.showModals('flowexhibition');}}>流程展示</Button>
                                <Button type="primary" >回填信息</Button>
                                <Button type="primary" onClick={() => {this.showModals('flowmsg');}}>流程信息</Button>
                            </Button.Group>

                         <Button.Group>
                                <Button onClick={this.suspendProcessInstance} style={{display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==2)? 'inline' : 'none')}}>挂起</Button>
                                <Button onClick={this.resumeProcessInstance} style={{display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==1)? 'inline' : 'none')}}>解挂</Button>
                                <Button onClick={this.cancelProcessInstance} style={{display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==2)? 'inline' : 'none')}}>撤单</Button>
                                <Button onClick={this.terminateProcessInstance} style={{display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==2)? 'inline' : 'none')}}>终止流程</Button>
                            </Button.Group>
                            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={() => {
                                this.showModals('workitems');
                            }}>
                                查看工作项
                            </a>
                        </div>

                    </StandardList>
                    {
                        this.renderModal()
                    }
                   
                </div></div>
        );
    }
}

FlowMyToDoWork.propTypes = {};

FlowMyToDoWork.defaultProps = {};

export default FlowMyToDoWork;
