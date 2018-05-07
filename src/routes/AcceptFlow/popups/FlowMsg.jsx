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
            data:[],
            selectedRow : {}
        }
        this.columns = [
            {title:'参数编码',dataIndex:'code',width:100},
            {title:'参数值',dataIndex:'value',width:100},
            {title:'类型',dataIndex:'type',width:100,
            filters: [
                { text: 'FLOW', value: '流程' },
                { text: 'TASK', value: '环节' },
            ],

            render: (text, record) => {
                return (<span> {text == undefined ? '' : text == 'FLOW' ? '流程' : '环节'} </span>);
            }
        
        },
            {title:'是否可变',dataIndex:'isVariable',width:100,
            filters: [
                { text: '0', value: '不可变' },
                { text: '1', value: '可变' },
            ],
            render: (text, record) => {
                return (<span> {text == undefined ? '' : text =='0' ? '不可变' : '可变'} </span>);
            }
        },
            {title:'系统编码',dataIndex:'systemCode',hidden:'true'}
        ];
    }
    loadData=()=>{
        
        let param = {
			funcCode: "Accept",
			packageDefineId: this.props.packageDefineId,
			tacheCode: "0",
			tacheDirection: "0",
			systemCode:session.currentTendant.tenantCode
		}

        this.setState({
            loading:true
        });
        http.post('/call/call.do', {
			bean: 'FormManagerServ',
			method: 'getPageTemplateRule',
			param: param
        },{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            const returnData = JSON.parse(res);
            if(returnData){
                 this.setState({
                 data:returnData
                });
                
                /**this.setState({
                    data: [{id: 1006, code: "1014", value:"accNbr", type :"FLOW",isVariable : "0",systemCode : "0"},{id: 1007, code: "1015", value:"accNbr", type :"TASK",isVariable : "1",systemCode : "1"}]
                });*/
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
            message.warn("所选流程模板没有激活状态的版本");
            console.log('failed!!',res);
        });
    }

    componentDidMount() {
        
        this.loadData();
    }

    handleOk = () => {
        console.log(this.state.data);
        if(this.state.data){
            var flowparams = [];

            for (let i = 0 ; i< this.state.data.length;i++) {
                var flowParamObject = {};
                flowParamObject.FLOW_PARAM_CODE = this.state.data[i].code;
                flowParamObject.FLOW_PARAM_VALUE = this.state.data[i].value;
                flowparams[i] = flowParamObject;
                
            }

            let flowParamMap = {processDefineId: this.props.packageDefineId,
			                    processDefineName:this.props.processDefineName,
                                areaId:1,flowParamList:flowparams,
                                systemCode:session.currentTendant.tenantCode,
                                staffId: '',
                                userName: ''}
            http.post('/call/call.do', {
                bean: 'FlowOperServ',
                method: 'startFlow',
                param: flowParamMap
            },{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);

                if(returnData == 'fail'){
                    message.warn("启动流程失败");
                }else{
                    message.warn("流程定义启动成功！流程实例id:"+returnData);
                }

            },res => {
                this.setState({
                    loading:false
                });
                message.warn("启动流程失败");
                console.log('failed!!',res);
            });
        }else{
            message.warn("启动流程失败");
        }
    }
    
    render(){
        //this.props.flowInstance为当前选择的流程实例
        return ( <Modal
            title="流程参数"
            mask={true}
            width={'60%'}
            loading={this.state.loading}
            maskClosable={true}
            onCancel={this.props.onCancel}
            visible={true}

            onOk={this.handleOk}
            cancelText = '取消'
            okText = '启动'
          >
            <div>
                <Table bordered rowKey={'id'} scroll={{ y: (document.querySelector('body').clientHeight-300) }} 
                 dataSource={this.state.data} pagination={false} 
                 columns={this.columns}
                 onRowClick={(record,index) => {
                    console.log(record,index);
                    this.setState({
                        selectedRow:record
                       })
                    }
                  }
                 />
            </div>


          </Modal>);
    }

}

export default FlowMsg;