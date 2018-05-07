import React, { Component } from 'react';
import moment from 'moment';
import {Icon} from 'antd';
import _ from 'lodash';

const renderdate = (arr,val)=>{
    const found =  _.find(arr,x=>x.value==val);
    return found?found.text:'';
}

const renderText = (arr,val)=>{
    const found =  _.find(arr,x=>x.value==val);
    return found?found.text:'';
}
const instanceStatus = [{
    value: '',
    text: '全部'
},{
    value: '0',
    text: '未启动'
},{
    value: '1',
    text: '挂起'
},{
    value: '2',
    text: '正常执行中'
},{
    value: '3',
    text: '作废'
},{
    value: '4',
    text: '终止'
},{
    value: '5',
    text: '已完成'
},{
    value: '7',
    text: '调度异常'
},{
    value: '8',
    text: '归零，流程回退到开始节点'
},{
    value: '9',
    text: '流程回退中'
}];
const instanceSign = [{
    value: '0',
    text: '撤单流程'
},{
    value: '1',
    text: '正常流程'
}];

const instanceIsSyn = [{
    value: '0',
    text: '否'
},{
    value: '1',
    text: '是'
}];

const columns = [{
    title:'异常标识',
    dataIndex:'id',
    width:120,
    metaHeader:true
  },
    {title:'接口编码',dataIndex:'commandCode',width:150,metaContent:true},
    {title:'异常类型',dataIndex:'exceptionType',width:100,metaContent:true},
    {title:'异常级别',dataIndex:'reasonClass',width:80,metaContent:true},
    {title: '流程实例标识', dataIndex: 'processInstanceId', sorter: true, width:140, metaFooter:true},
    /* {title: '状态',dataIndex: 'state',
    //filters: instanceStatus,
    render(val) {
        return renderText(instanceStatus,val);
    },
    width:70,
    content:true
  }, */
    {title: '创建日期', dataIndex: 'createDate', sorter: true, render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>, width:150, footer:true},
    {title:'处理日期',dataIndex:'dealDate',render: val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,width:150},
    {title:'处理次数',dataIndex:'dealTimes',width:80},
    {title:'tacheId',dataIndex:'tacheId',width:80},
    {title: '异常描述', dataIndex: 'errorInfo', sorter: true, width:300},
    {title: '异常详情', dataIndex: 'msg', sorter: true, width:300}
  ];

const formConfig={
    layout:'inline-block',
    fields:[
        
        {
            rowId: 2,
            col: 8,
            orderNum:1,
            label: '开始时间',
            showLabel: true,
            key:'startDate',
            type: 'date',
            props: {
                placeholder: '开始时间',
                defaultValue: ()=>moment(new Date()).subtract(1, 'days')
            },
            needExpend: false,
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
            
        },
        {
            rowId: 2,
            col: 8,
            orderNum:2,
            label: '结束时间',
            showLabel: true,
            key:'endDate',
            type: 'date',
            props: {
                placeholder: '结束时间',
                defaultValue: ()=>moment(new Date())
            },
            needExpend: false,
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
            
        },
        {
            rowId: 1,
            col: 8,
            orderNum:1,
            label: '接口编码',
            showLabel: true,
            key:'commandCode',
            type: 'select',
            props: {
                placeholder: '全部',
                defaultValue:''
            },
            needExpend: false,
            options:[{
                value: '',
                text: '全部'
            },{
                value: 'createProcessInstance',
                text: 'createProcessInstance'
            },{
                value: 'startProcessInstance',
                text: 'startProcessInstance'
            },{
                value: 'createWorkOrder',
                text: 'createWorkOrder'
            },{
                value: 'completeWorkItem',
                text: 'completeWorkItem'
            },{
                value: 'disableWorkItem',
                text: 'disableWorkItem'
            },{
                value: 'reportProcessState',
                text: 'reportProcessState'
            },{
                value: 'suspendWorkItem',
                text: 'suspendWorkItem'
            },{
                value: 'abortProcessInstance',
                text: 'abortProcessInstance'
            },{
                value: 'rollbackProcessInstance',
                text: 'rollbackProcessInstance'
            },{
                value: 'createAndStartProcessInstance',
                text: 'createAndStartProcessInstance'
            },{
                value: 'terminateProcessInstance',
                text: 'terminateProcessInstance'
            },{
                value: 'suspendProcessInstance',
                text: 'suspendProcessInstance'
            },{
                value: 'resumeProcessInstance',
                text: 'resumeProcessInstance'
            },{
                value: 'setRuntimeInfo',
                text: 'setRuntimeInfo'
            },{
                value: 'addDispatch',
                text: 'addDispatch'
            }],
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
        },
        {
            rowId: 1,
            col: 8,
            orderNum:1,
            label: '流程状态',
            showLabel: true,
            key:'state',
            type: 'select',
            props: {
                placeholder: '全部',
                defaultValue:''
            },
            needExpend: false,
            options:[{
                value: '',
                text: '全部'
            },{
                value: '0',
                text: '未启动'
            },{
                value: '1',
                text: '挂起'
            },{
                value: '2',
                text: '正常执行中'
            },{
                value: '3',
                text: '作废'
            },{
                value: '4',
                text: '终止'
            },{
                value: '5',
                text: '已完成'
            },{
                value: '7',
                text: '调度异常'
            },{
                value: '8',
                text: '归零，流程回退到开始节点'
            },{
                value: '9',
                text: '流程回退中'
            }],
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
        },
        {
          rowId: 1,
          col: 6,
          orderNum:1,
          label: '流程实例',
          showLabel: false,
          key:'processInstanceId',
          type: 'input',
          props: {
              placeholder: '请输入流程实例ID',
              defaultValue:'',
              addonAfter:(<button type="submit"><Icon type="search" /></button>)
          },
          needExpend: false,
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
      },
    ],
    
   
    submitButtonProps: {
  
    }
  }
  
export {columns,formConfig}