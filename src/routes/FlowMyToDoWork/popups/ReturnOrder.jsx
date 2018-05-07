import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { Table, Modal,Button,Select,message  } from 'antd';
import popupModel from '../models/FlowInstanceModel'
import session from 'models/Session';

/**
 * 回单
 */
@observer
class ReturnOrder extends Component {
    constructor(props) {
        super(props);
        this.popupModel = popupModel;
        this.state={
            data:[]
        }
        this.columns = [{title:'参数编码',dataIndex:'code',width:100},
        {title:'参数值',dataIndex:'value',width:100,render: (text, record) => this.renderColumns(text, record, 'value')},
        {title:'类型',dataIndex:'type',width:100,
        render:(val)=> {
            if(val=='FLOW'){
                return '流程';
            }else{
                return '环节';
            }
        }},
        {title:'是否可变',dataIndex:'isVariable',width:100}];
    }

    renderColumns=(text, record, column) =>{
        const onChange=(value)=>{
            record[column].value=value?value:'';
            this.setState({
                data:this.state.data,
                editable:false
            })
        };

        return (
            <div>
            {this.state.editable
              ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
              : <Span onClick={()=>{
                  this.setState({
                    editable:true
                    })
                }}>value</Span>
            }
          </div>
        );
      }

    componentDidMount() {
        const param = {
            packageDefineId:this.props.workItem.processDefineId,
            tacheCode:this.props.workItem.tacheCode,
            type:'TACHE',
            systemCode:session.currentTendant.tenantCode
        };
        this.setState({
            loading:true
        });
        http.post('/call/call.do',{
            bean: 'FlowServ',
            method: 'qryFlowParamDefRels',//'qryWorkItemByCond',
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

    handleReturnOrder=()=>{
        
        const flowParamMap ={};
        this.state.data.map(x=>{
            flowParamMap[x.code]=x.value;
        });

        this.setState({
            loading:true
        });

        var param ={
			workItemId: this.props.workItem.workItemId,
			areaId:  this.props.workItem.areaId,
			flowParamMap:flowParamMap,
			operatePartyType:'STA',
			operatePartyId:'1',
			operatePartyName:'admin',
			processInstanceId:this.props.workItem.processInstanceId,
			systemCode:session.currentTendant.tenantCode
        };
        
        http.post('/call/call.do',{
            bean: 'FlowOperServ',
            method: 'completeWorkItem',//'qryWorkItemByCond',
            param: param
        },{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            this.setState({
                loading:false
            });
            this.popupModel.showReturnOrder=false;
            if(this.props.onOk){
                this.props.onOk();
            }
            message.success('回单成功');
            //console.log('success!!',res);
        },res => {
            this.setState({
                loading:false
            });
            console.log('failed!!',res);
            this.popupModel.showReturnOrder=false;
            message.error('回单失败');
        });
    }

    render(){
        //this.props.flowInstance为当前选择的流程实例
        return ( <Modal
            title="回单"
            mask={true}
            loading={this.state.loading}
            maskClosable={true}
            footer={[<Button key="back" type="primary" loading={this.state.loading} onClick={this.handleReturnOrder}>回单</Button>]}
            onOk={this.props.onOk}
            onCancel={this.props.onCancel}
            visible={true}
          >
            <div>
            <Table bordered dataSource={this.state.data} pagination={false} columns={this.columns} />
            </div>
          </Modal>);
    }

}

export default ReturnOrder;