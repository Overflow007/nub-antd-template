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
    //filters: instanceStatus,
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
    // render: val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    width:150,
    metaContent:true
  }, 
  {title:'模板版本',dataIndex:'version',width:150},
  {title:'区域',dataIndex:'areaName',width:100},
  {title:'优先级',dataIndex:'priority',width:80},
  {title:'流程启动者标识',dataIndex:'participantId',width:140},
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
            {title:'环节路径',dataIndex:'tachePathName',width:100,sorter:true},
			{title:'环节名称',dataIndex:'tacheName',width:100},
            {title:'流程定义',dataIndex:'packageDefineName',width:100},
            {title:'方向',dataIndex:'directionName',width:80,
            //filters: workitemDirection,
                render(val) {
                    return renderText(workitemDirection,val);
                }
            },
			{title:'匹配方式',dataIndex:'matchTypeName',width:150},
			{title:'派单因素',dataIndex:'elementName',width:100},
			{title:'执行人类型',dataIndex:'participantTypeName',width:120},
			{title:'执行人名称',dataIndex:'participantName',width:120},
			{title:'自动执行组件类',dataIndex:'exeClass',width:120},
			{title:'自动执行组件方法',dataIndex:'exeMethod',width:130},
			{title:'自动执行人名称',dataIndex:'exeName',width:120},
            {title:'是否自动回单',dataIndex:'exeAutoFinishName',width:100,
                 //filters: workitemIsAuto,
                render(val) {
                    return renderText(workitemIsAuto,val);
                }
            },
			{title:'失败是否转人工',dataIndex:'exeToManualName',width:120},
			{title:'转人工执行人类型',dataIndex:'manualTypeName',width:130},
			{title:'转人工执行人名称',dataIndex:'manualName',width:130},
			{title:'特定环节',dataIndex:'someTacheName',width:100},
			{title:'自定义规则组件类',dataIndex:'ruleClass',width:130},
			{title:'自定义规则组件方法',dataIndex:'ruleMethod',width:150}
];
const formConfig={
    fields:[
        
        {
            rowId: 1,
            col: 6,
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
            label: '状态',
            showLabel: false,
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
              placeholder: '请输入',
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
  
export {columns,workitemColumns,formConfig}