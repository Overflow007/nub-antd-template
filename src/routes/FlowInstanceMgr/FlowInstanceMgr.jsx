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
import FlowDetailTab from './popups/FlowDetailTab';
import FlowExhibition from './popups/FlowExhibition';
import ReturnOrder from './popups/ReturnOrder';
import FlowMsg from './popups/FlowMsg';
import WorkitemOperations from './popups/WorkitemOperations';
import DynamicSearchForm from 'components/DynamicSearchForm';
import StandardList from 'components/StandardList';
import NonModalDialog from 'components/NonModalDialog';
import StandardTable from 'components/StandardTable';
import { columns, workitemColumns, formConfig } from './StaticConfigs'
import './FlowInstanceMgr.scss';

const PREFIX = 'flow-instance-mgr';

const cx = utils.classnames(PREFIX);

@observer
class FlowInstanceMgr extends Component {

    state = {
        showOperations: false,
        expandWorkitem: false,
        selectedRows: [],
        formValues: {
        },
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
        
        this.setState({ inited: true }, () => {
            if (this.refs.instanceSearchForm) {
                this.refs.instanceSearchForm.getForm().validateFields(this.handleSearch);
            }
        });
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

        if(this.state.modalName == 'showDetail'){
            return <FlowDetailTab flowInstance={this.state.selectedRows[0]} onCancel={() => { this.setState({ modalName: ''}); }}/>;
        }

        return null;
    }

    handleSearch = (err, values) => {
        if (err) return;

        for (let k in values) {
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
                    if(res == '"success"'){
                        message.success('流程挂起成功');
                        this.rerenderInstancesData();
                    } else {
                        message.error('流程挂起失败');
                    }
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
                    if(res == '"success"'){
                        message.success('流程解挂成功');
                        this.rerenderInstancesData();
                    } else {
                        message.error('流程解挂失败');
                    }
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
                    if (res == '"success"') {
                        message.success('流程撤单成功');
                        this.rerenderInstancesData();
                    } else {
                        message.error('流程撤单失败');
                    }
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
                    if (res == '"success"') {
                        message.success('流程终止成功');
                        this.rerenderInstancesData();
                    } else {
                        message.error('流程终止失败');
                        console.error('failed!!', res);
                    }
                }, res => {
                    message.error('流程终止失败');
                    console.error('failed!!', res);
                });

        }
    }

    rerenderInstancesData = () => {
        if(this.refs.instanceList){
            this.refs.instanceList.tryReloadData();
        }
    }

    loadData = (current, pageSize, pagination) => {
        
        // 表格初始化时不加载数据，页面加载结束后再查询数据，在 componentDidMount 中调用
        if(!this.state.inited){
            return new Promise(function(resove, reject){
                resove({ data: { rows: [], pagination } });
            });
        }

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
            method: 'qryProcessInstanceByCond',//'qryWorkItemByCond',
            param: param
        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
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

            }, res => {
                message.error('查询流程实例列表失败');
                console.error('failed!!!', res);
            });

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
                        extra={<div key={'search'} style={{ width: '800px', margin: '-17.5px 10px -17.5px 0px', position: 'relative', height: '100%', display: 'inline-block' }}>
                            <DynamicSearchForm ref='instanceSearchForm'
                                style={{ position: 'absolute', width: '800px', top: '-15px' }}
                                formConfig={formConfig}
                                hideFooter={true}
                                onSubmit={this.handleSearch}
                            />
                        </div>
                      
                        }
                        loadData={this.loadData}
                        title={'流程实例监控'} rowKey={'processInstanceId'}>
                        <div style={{position:'sticky',top:'10px',backgroundColor:'#fff',zIndex: 199,opacity: '1',marginBottom:'10px', display: ((this.state.selectedRows != null && this.state.selectedRows.length > 0) ? 'block' : 'none') }}>
                            <Button.Group>
                                <Button onClick={this.suspendProcessInstance} style={{display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==2)? 'inline' : 'none')}}>挂起</Button>
                                <Button onClick={this.resumeProcessInstance} style={{display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==1)? 'inline' : 'none')}}>解挂</Button>
                                <Button onClick={this.cancelProcessInstance} style={{display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==2)? 'inline' : 'none')}}>撤单</Button>
                                <Button onClick={this.terminateProcessInstance} style={{display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0 &&this.state.selectedRows[0].state==2)? 'inline' : 'none')}}>终止流程</Button>
                            </Button.Group>
                            
                            <Button type="primary" onClick={() => {this.showModals('showDetail');}}>查看详情</Button>
                        </div>

                    </StandardList>
                    {
                        this.renderModal()
                    }
                   
                </div></div>
        );
    }
}

FlowInstanceMgr.propTypes = {};

FlowInstanceMgr.defaultProps = {};

export default FlowInstanceMgr;
