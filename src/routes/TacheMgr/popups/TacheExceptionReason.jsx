import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import { Table, Card, Menu, Tree, Icon, Button  } from 'antd';
import moment from 'moment';
import DynamicSearchForm from 'components/DynamicSearchForm';
import StandardTable from 'components/StandardTable';
import http from 'common/http';
import { tacheCodeCols, formConfig } from './StaticConfigs'
import { observer } from 'mobx-react';


class TacheExceptionReason extends Component{

    render(){
        return (
			<div className={"ant-notification ant-notification-topRight"} 
				style={{
					right: '0px', top: '24px', bottom: 'auto',display:(this.state.expandWorkitem?'block':'none'),
					'maxWidth': '65vw',
					'width': 'auto',
					'minWidth': '384px',
					'zIndex': '999'
			}}>
				<span>
				   <div className={"ant-notification-notice ant-notification-notice-closable"}>
					   <div className={"ant-notification-notice-content"}>
						   <div >
							   <div className={"ant-notification-notice-message"}>{(this.state.selectedRows[0]?(this.state.selectedRows[0].name+'工作项'):'工作项')}</div>
							   <div className={"ant-notification-notice-description"}>
								   <div style={{display:(this.popupModel.showWorkitemOperations?'block':'none')}}>
											   <Button.Group>
												   <Button onClick={()=>{ 
													   this.popupModel.showReturnOrder=true;
												   }}>回单</Button>
												   <Button >退单</Button>
												   <Button >流程跳转</Button>
												   <Button >消息重投</Button>
												   <Button >环节操作</Button>
												   <Button >增派测试</Button>
											   </Button.Group>
								   </div>
								   
								   <div >
								   
								   
								   <StandardTable rowKey={'workItemId'} style={{maxHeight:'240px'}}
									   data={{...this.state.workItems,pagination:false}}
									   columns={workitemColumns}
									   
									   clicktoSelect = {true}
									   rowSelection ={{type:'radio'}}
									   scroll={{ y: 270}}
									   loading={this.state.workItemsLoading}
									   onRowClick = {(record,index,e) => {
												 this.popupModel.showWorkitemOperations=true;
												 this.popupModel.workitemOperationsTop=e.clientY+'px';
												 this.popupModel.workitemOperationsLeft=(e.clientX-106)+'px';
												 this.popupModel.workItem=record;
											   //console.log('onRow',e,e.clientX,e.clientY);
											
										 }}
									/>
									  
								   </div>
							   </div>
						   </div>
					   </div>
					   <a className={"ant-notification-notice-close"} onClick={()=>{
						   this.popupModel.showWorkitemOperations=false;
						   this.setState({
								   //showOperations:false
								   expandWorkitem:false
						   });
					   }}>
						   <span className={"ant-notification-notice-close-x"}></span>
					   </a>
					</div>
				</span>
			</div>);
    }
}


export default TacheExceptionReason;