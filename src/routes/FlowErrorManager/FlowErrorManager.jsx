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
import StandardList from 'components/StandardList';
import NonModalDialog from 'components/NonModalDialog';
import StandardTable from 'components/StandardTable';
import { columns, formConfig } from './StaticConfigs';
import './FlowErrorManager.scss';
import FlowErrorManagerHis from "../FlowErrorManagerHis/FlowErrorManagerHis";

const PREFIX = 'flow-instance-mgr';

const cx = utils.classnames(PREFIX);

@observer
class FlowErrorManager extends Component {

    state = {
        selectedRows: [],
        formValues: {},
        pagination: {
            "showSizeChanger": true,
            "showQuickJumper": true,
            "current": 1,
            "pageSize": 20,
            total: 0
        },
        sorter: {},
        filtersArg: {},
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

    dealExceptions = () => {
        if (this.state.selectedRows[0]) {
            const param = {
                errorIds: this.state.selectedRows[0].id
            };

            http.post('/call/call.do', {
                bean: 'ExceptionServ',
                method: 'dealExceptions',
                param: param


            }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (!returnData.isSuccess) {
                    message.error('流程异常处理失败');
                } else {
                    message.success('流程异常处理成功');

                    this.rerenderInstancesData();
                }
            }, res => {
                message.error('流程异常处理失败');
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
        param.sortColumn='create_date';
        param.sortOrder='desc';
        param.systemCode=session.currentTendant.tenantCode;
        if(param.processInstanceId==''){
            param.processInstanceId=undefined;
            delete param.processInstanceId;
        }
        if(param.state==''){
            param.state=undefined;
            delete param.state;
        }
        if(param.commandCode==''){
            param.commandCode=undefined;
            delete param.commandCode;
        }

        return http.post('/call/call.do', {
            bean: 'ExceptionServ',
            method: 'qryUosFlowErrorsByCond',
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

        }, res => res);

    }

    render() {
        const pagination = {
            pageSize: 20,
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
								  extra={<div key={'search'} style={{ width: '800px', margin: '-17.5px 10px -17.5px 0px', position: 'relative', height: '110px', display: 'inline-block' }}>
									  <DynamicSearchForm ref='instanceSearchForm'
														 style={{ position: 'absolute', width: '800px', top: '10px',height: '100%'}}
														 formConfig={formConfig}
														 hideFooter={true}
														 onSubmit={this.handleSearch}
									  />
								  </div>

                                  }
								  loadData={this.loadData}
								  title={'流程异常管理'} rowKey={'processInstanceId'}>
						<div style={{position:'sticky',top:'10px',backgroundColor:'#fff',zIndex: 199,opacity: '1',marginBottom:'10px', display: ((this.state.selectedRows != null && this.state.selectedRows.length > 0) ? 'inline-block' : 'none') }}>

                            <Button onClick={this.dealExceptions} type="primary" style={{float: 'right',display: ((this.state.selectedRows != null&&this.state.selectedRows.length > 0)? 'inline' : 'none')}}>处理异常</Button>
						</div>

					</StandardList>

				</div></div>
        );
    }
}

FlowErrorManager.propTypes = {};

FlowErrorManager.defaultProps = {};

export default FlowErrorManager;
