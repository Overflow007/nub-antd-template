import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { Table, Modal,Button,Select,message  } from 'antd';
import popupModel from '../models/FlowInstanceModel';
import DynamicSearchForm from 'components/DynamicSearchForm';
import session from 'models/Session';


@observer
class ProcessJump extends Component {
    
    constructor(props) {
        super(props);
        this.popupModel = popupModel;
        this.state={
            data:[],
            processMsg:[],
            targetActivityId: '',
        }
        
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
            processInstanceId:this.props.workItem.processInstanceId,
            areaId:this.props.workItem.areaId,
           // type:'TACHE'

        };
      
        this.setState({
            loading:true
        });
        http.post('/call/call.do',{
            bean: 'FlowInstServ',
            method: 'qryUndoActivityByCond',//'qryWorkItemByCond',
            param: param
        },{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            const returnData = JSON.parse(res);
            console.log("returnData",returnData.rows);
            let Elements = [] // 保存渲染以后 JSX 的数组
             for (let msg of returnData.rows) {
                  Elements.push( // 循环，构建 JSX，push 到数组中
                    {
                        value: ''+msg.id+'',
                        text: ''+msg.text+''
                    },
                  )
                }
            console.log("Elements",Elements);    
            if(returnData&&returnData.rows){
                this.setState({
                    date:returnData.rows,
                    processMsg:Elements,
                    msgAcquire:'processJump',
                });
                
            }else{
                this.setState({
                    data:[]
                });
            }
            this.setState({
                loading:false
            });
        },res => {
            this.setState({
                loading:false
            });
            console.log('failed!!',res);
        });
    }
    
    handleProcessJump=()=>{
        // 获取选中的数据，然后从选中的数据中获取id，即targetActivityId
        const flowParamMap ={};
        this.state.data.map(x=>{
            flowParamMap[x.code]=x.value;
        });

        this.setState({
            loading:true,
        });
        var param ={
            processInstanceId:this.props.workItem.processInstanceId,
            areaId:this.props.workItem.areaId,
            targetActivityId:this.state.targetActivityId,//9978551-55
            fromActivityInstanceId:this.props.workItem.activityInstanceId,//活动实例标识
            systemCode:session.currentTendant.tenantCode
        };
        console.log('param',param);
       // alert(param);
        http.post('/call/call.do',{
            bean: 'FlowOperServ',
            method: 'processInstanceJump',
            param: param
        },{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            
            this.setState({
                loading:false
            });
            this.popupModel.showProcessJump=false;
            if(this.props.onOk){
                this.props.onOk();
            }
            message.success('流程跳转成功');
            //console.log('success!!',res);
        },res => {
            this.setState({
                loading:false
            });
            console.log('failed!!',res);
            this.popupModel.showProcessJump=false;
            message.error('流程跳转失败');
        });
    }

    renderModal=()=>{
        if(this.state.msgAcquire=='processJump'){
            return  <DynamicSearchForm ref='instanceSearchForm'
            style={{ width: '800px', top: '-15px',textAlign: "center"}}
            formConfig={{
                fields:[
                    {
                        rowId: 1,
                        col: 12,
                        orderNum:1,
                        label: ' 跳转目标环节：',
                        showLabel: true,
                        key:'status',
                        type: 'select',
                        props: {
                            placeholder: '全部',
                            defaultValue:'',
                            onChange: (key, option) => {
                               this.setState({
                                    targetActivityId: key
                               });
                            }
                        },
                        needExpend: false,
                        options:this.state.processMsg,
                       
                        formItemLayout: {
                            labelCol: {
                              xs: { span: 24 },
                              sm: { span: 6 },
                            },
                            wrapperCol: {
                              xs: { span: 24 },
                              sm: { span: 18 },
                            }
                          }
                    }
                ],
                submitButtonProps: {
                }
              }}
            hideFooter={true}
            onSubmit={this.handleSearch}
        />
        }
        return null;
    }
    render(){
        return ( <Modal
            title="流程跳转"
            mask={true}
            loading={this.state.loading}
            maskClosable={true}
            readonly="true"
            footer={[<Button key="back"   type="primary" loading={this.state.loading} onClick={this.handleProcessJump}>确定</Button>]}
            onOk={this.props.onOk}
            onCancel={this.props.onCancel}
            visible={true}
          >
            <div>
            {
                        this.renderModal()
                    }
            </div>
          </Modal>);
    }

}

export default ProcessJump; 