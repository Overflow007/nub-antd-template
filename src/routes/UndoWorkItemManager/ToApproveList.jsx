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
import DynamicSearchForm from 'components/DynamicSearchForm';
import ToDoTheWorkList from 'components/ToDoTheWorkList';
import NonModalDialog from 'components/NonModalDialog';
import StandardTable from 'components/StandardTable';
import { columns, workitemColumns, formConfig } from './StaticConfigs';
import FlowMyToDoWork from '../FlowMyToDoWork/FlowMyToDoWork';
import './ToApproveList.scss';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


const PREFIX = 'flow-instance-mgr';

const cx = utils.classnames(PREFIX);

@observer
class ToApproveList extends Component {

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
        modalName: '',
        showStateTitle:"我的申请",
        showState:1,
        //下面是参数的初始化
        endDate:"",
        pageIndex:1,
        pageSize:10,
        processInstanceId:"",
        sortColumn:"assignedDate",
        sortOrder:"desc",
        startDate:"",
        state:"4",
        systemCode:"ITS",
        tacheId:"",
        pagination:{pageSize:10,
                    total:0}
        //上面是参数的初始化
    };

    constructor(props) {
        super(props);
        this.popupModel = popupModel;
    }
    // componentWillReceiveProps(props){
    //     //alert("componentWillReceiveProps");
    //     //console.log('this.state.showState',this.state.showState);
    //     alert('componentWillReceiveProps(props)'+this.state.showState)
    //     this.loadData(this.state.pageIndex,this.state.pageSize,this.state.pagination,this.state.showState);
    // }
    componentDidMount() {
        this.popupModel.triggerReload = this.rerenderInstancesData;
        if (this.refs.instanceSearchForm) {
            this.refs.instanceSearchForm.getForm().validateFields(this.handleSearch);
        }
    }

    componentWillUnmount() {
        this.popupModel.clear();
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
    }
    
    //这个是一登录进来就获取数据
    loadData = (current, pageSize, pagination,workState) => {
        //alert("ToApproveList.jsx"+workState);
        //alert("loadData");
        // if(workState==undefined){
        //     workState=1;
        // }
       //alert(workState+"=workState");
        const { formValues } = this.state;
        let param = Object.assign({}, formValues);
        let newDate=moment(new Date()).format('YYYY-MM-DD');
        if(param.startDate){
           if(param.startDate>newDate){
                alert('开始时间不能早于当前时间');
           }
        }else{
            param.startDate="";
        }
        if(param.endDate){
            if(param.endDate<newDate){
                alert('结束时间不能晚于当前时间');
           }
        }else{
            param.endDate="";
        }
        param.pageSize = pagination.pageSize;
        param.pageIndex = current;
        param.sortColumn='assignedDate';
        param.sortOrder='desc';
        param.tacheId="";
        param.state=workState;
        param.systemCode=session.currentTendant.tenantCode;
        
        this.setState({//这里可以为父级点击的时候提供参数
            pageIndex:param.pageIndex,
            pageSize: param.pageSize,
            pagination:pagination
        });
        // console.log('param',param);
        // console.log('pagination',pagination);
        return http.post('/call/call.do', {
            bean: 'FlowInstServ',
            method: 'qryWorkItemByCond',//'qryWorkItemByCond',
            param: param
        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
                //    console.log('returnData',returnData);
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
            }, res => res);
    }
    getStateShow=(e)=>{
        if(e){
            if(e==1){
                this.setState({
                   showState:e,
                   showStateTitle:'我的申请',
                });
            }else if(e==2){
                this.setState({
                    showState:e,
                    showStateTitle:'待我处理',
                 });
            }else if(e==4){
                this.setState({
                    showState:e,
                    showStateTitle:'处理完成',
                 });
            }else{
                this.setState({
                    showState:e,
                    showStateTitle:'我的申请',
                 });
            }
          }
          if (e!=1) {
            this.setState({
                showState:e
              }, ()=> {
                this.refs.instanceList.getStateShow(e);
              });
          }
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
        if(this.state.showState==1){
            return (
                <div style={{ 'padding': '15px' }}>
                    <div className={PREFIX}>
                        <FlowMyToDoWork></FlowMyToDoWork>
                    </div></div>
            );
        }else{
            return (
                <div style={{ 'padding': '15px' }}>
                    <div className={PREFIX}>
                        <ToDoTheWorkList  ref={'instanceList'} allowChangeSelectType={true} columns={columns}
                            data={{ rows: [], pagination }}
                            extra={<div key={'search'} style={{ width: '500px', margin: '-17.5px 10px -17.5px 0px', position: 'relative', height: '100%', display: 'inline-block' }}>
                                <DynamicSearchForm ref='instanceSearchForm'
                                    style={{ position: 'absolute', width: '500px', top: '-15px'}}
                                    formConfig={formConfig}
                                    hideFooter={true}
                                    onSubmit={this.handleSearch}
                                />  
                            </div>
                            }
                            loadData={this.loadData}
                            title={this.state.showStateTitle} rowKey={'workItemId'}>
                        </ToDoTheWorkList>
                    </div></div>
            );
        }
    }
}

ToApproveList.propTypes = {};

ToApproveList.defaultProps = {};

export default ToApproveList;
