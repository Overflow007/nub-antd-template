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
    title: '流程实例标识',
    dataIndex: 'processInstanceId',
    sorter: true,
    width:140,
    metaFooter:true
  }, {
    title: '流程实例名称',
    dataIndex: 'name',
    width:120,
    metaHeader:true
  }, {
    title: '流程定义编码',
    dataIndex: 'processDefineCode',
    width:120,
    metaContent:true
  }, {
    title: '状态',
    dataIndex: 'state',
    render(val) {
        return renderText(instanceStatus,val);
    },
    width:70,
    content:true
  }, {
    title: '创建日期',
    dataIndex: 'createdDate',
    sorter: true,
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    width:150,
    footer:true
  }, {
    title: '开始日期',
    dataIndex: 'startedDate',
    render: val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    width:150,
    metaContent:true
  }, {
    title: '完成日期', 
    dataIndex: 'completedDate',
    render: val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    width:150,
    metaContent:true
  }, 
  {title:'模板版本',dataIndex:'version',width:150},
  {title:'区域',dataIndex:'areaName',width:100},
  {title:'优先级',dataIndex:'priority',width:80},
  {title:'流程启动者标识',dataIndex:'oldProcessInstanceId',width:140},
  {title:'受理人标志',dataIndex:'participantId',width:140},
  {title:'受理人名称',dataIndex:'participantName',width:160},
  {title:'受理人类型',dataIndex:'participantType',width:160,
    //filters:instanceIsSyn,
    render(val) {
        return renderText(instanceIsSyn,val);
    },
  },
  {title:'告警时间',dataIndex:'alertDate',width:120},
  {title:'超时时间',dataIndex:'limitDate',width:120},
  {title:'业务标识',dataIndex:'ordId',width:120}
  ];

  const workitemStatus = [{
        value: '0',
        text: '作废'
    },{
        value: '1',
        text: '正常执行中'
    },{
        value: '2',
        text: '作废'
    },{
        value: '3',
        text: '终止（工单作废）'
    },{
        value: '4',
        text: '已完成'
    },{
        value: '6',
        text: '作废'
    },];
const  workitemDirection = [{
    value: '0',
    text: '反向'
},{
    value: '1',
    text: '正向'
}];
const workitemIsAuto = [{
    value: '0',
    text: '否'
},{
    value: '1',
    text: '是'
}];
  const workitemColumns =[
    {title:'工作项标识',dataIndex:'workItemId',width:120,sorter:true},
    {title:'环节名称',dataIndex:'name',width:120},
    {title:'状态',dataIndex:'state',width:105,
        //filters: workitemStatus,
        render(val) {
            return renderText(workitemStatus,val);
        },
    },
    {title:'方向',dataIndex:'direction',width:85,
        //filters: workitemDirection,
        render(val) {
            return renderText(workitemDirection,val);
        }
    },
    {title:'开始时间',dataIndex:'startedDate',width:150},
    {title:'完成时间',dataIndex:'completedDate',width:150},
    {title:'区域',dataIndex:'areaName',width:80},
    {title:'是否自动回单',dataIndex:'isAuto',width:125,
        //filters: workitemIsAuto,
        render(val) {
            return renderText(workitemIsAuto,val);
        }
    },
    {title:'环节标识',dataIndex:'tacheId',width:100},
    {title:'环节编码',dataIndex:'tacheCode',width:100},
    {title:'活动定义标识',dataIndex:'activityDefinitionId',width:120},
    {title:'活动实例标识',dataIndex:'activityInstanceId',width:120},
    {title:'流程定义标识',dataIndex:'processDefineId',width:120},
    {title:'流程实例标识',dataIndex:'processInstanceId',width:120},
    {title:'流程实例名称',dataIndex:'processInstanceName',width:120},
    {title:'参与者标识',dataIndex:'participantId',width:100},
    {title:'参与者职位',dataIndex:'participantPositionId',width:100},
    {title:'分配到组织标识',dataIndex:'organizationId',width:120},
    {title:'分配时间',dataIndex:'assignedDate',width:150,sorter:true},
    {title:'持续时间',dataIndex:'dueDate',width:150},
    {title:'优先级',dataIndex:'priority',width:80},
    {title:'注释',dataIndex:'memo',width:200},
    {title:'批次',dataIndex:'batchid',width:80},
    {title:'创建来源',dataIndex:'createSource',width:80},
    {title:'参与人',dataIndex:'partyName',width:100},
    {title:'人工执行人',dataIndex:'manualPartyName',width:100},
    {title:'操作人',dataIndex:'operatePartyName',width:100},
    {title:'旧工作项标识',dataIndex:'oldWorkItemId',width:120}
];
const formConfig={
    fields:[
        
        {
            rowId: 1,
            col: 8,
            orderNum:1,
            label: '开始时间',
            showLabel: false,
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
                  sm: { span: 8 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 16 },
                }
              }
            
        },
        {
            rowId: 1,
            col: 8,
            orderNum:1,
            label: '结束时间',
            showLabel: false,
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
                  sm: { span: 8 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 16 },
                }
              }
            
        },
        {
          rowId: 1,
          col: 8,
          orderNum:1,
          label: '流程实例',
          showLabel: false,
          key:'processInstanceId',
          type: 'input',
          props: {
              placeholder: '请输入',
              defaultValue:'',
              addonAfter:(<button type="submit"><Icon type="search" /></button>)
          },
          needExpend: false,
          formItemLayout: {
              labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
              }
            }
      },
    ],
    
   
    submitButtonProps: {
  
    }
  }
  
export {columns,workitemColumns,formConfig}