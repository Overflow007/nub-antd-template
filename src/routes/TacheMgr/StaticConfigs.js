import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

/* 目录 BEGIN */

const tacheCatalogSaveFormConfig = {
    fields: [
        {
            rowId: 1,
            label: '目录名称',
            showLabel: true,
            key: 'tacheCatalogName',
            type: 'input',
            props: { placeholder: '目录名称' },
            required: true,
            rules: [{ required: true, whitespace: true, message: '请输入目录名称' }],
            col: 24,
            formItemLayout: {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 20 },
                }
            },
	        needExpend: false,
        }
    ]
}
/* 目录 END */

const tacheStatus = [{
    value: 'all',
    text: '全部'
},{
    value: '10A',
    text: '有效'
},{
    value: '10P',
    text: '失效'
}];

const formConfig={
    fields:[
        {
            rowId: 1,
            col: 8,
            orderNum:1,
            label: '环节状态',
            showLabel: true,
            key:'status',
            type: 'select',
            props: {
                placeholder: '全部',
                defaultValue:'all'
            },
            needExpend: false,
            options:tacheStatus,
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
            label: '环节编码',
            showLabel: true,
            key:'tacheCode',
            type: 'input',
            props: {
                placeholder: '请输入',
                defaultValue:''
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
            label: '环节名称',
            showLabel: true,
            key:'tacheName',
            type: 'input',
            props: {
                placeholder: '请输入',
                defaultValue:''
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
        }
        
    ]
}

const tacheCodeCols = [
    { title: '编码', dataIndex: 'tacheCode', width: 150 },
    { title: '名称', dataIndex: 'tacheName', width: 200 },
    {
        title: '类型',
        dataIndex: 'tacheType',
        width: 180,
        render: (value) => {
            if (value == 'DUMMY'){
                return '数据驱动环节';
            } else if (value == 'FLOW'){
                return '子流程环节';
            }
            return '普通环节';
        }
    },
    {
        title: '是否自动回单',
        dataIndex: 'isAuto',
        width: 180,
        render: (value) => {
            if (value == '1'){
                return '是';
            }
            return '否';

        }
    },
    { title: '子流程编码', dataIndex: 'packageDefineCodes', width: 150 },
    { title: '生效时间', dataIndex: 'effDate', width: 200 },
    { title: '失效时间', dataIndex: 'expDate', width: 200 },
    /*{ title: '目录', dataIndex: 'expDate', width: 200 }*/
];

const exceptionReasonCols=[
    { title: '名称', dataIndex: 'returnReasonName', width: 100 },
    { title: '区域', dataIndex: 'areaName', width: 80 },
    {
        title: '异常原因类别',
        dataIndex: 'reasonType',
        width: 100,
        render: (value, row, index) => {
            let value_=value;
            if (value == "10R"){
                value_="退单";
            }else if(value=="10W"){
                value_="待装";
            }else if(value=="10C"){
                value_="撤单";
            }else if(value=="10Q"){
                value_="改单";
            }else if(value=="10P"){
                value_="缓装";
            }
            return value_;
        }},
    {title:'状态',dataIndex:'state',width:80,
        render:function(value,row,index){
            if(value=="10A"){
                return "启用";
            }else{
                return "停用";
            }
        }},// add for 882104
    {title:'是否需要审核',dataIndex:'auditFlag',width:80,
        render:function(value,row,index){
            if(value=="1"){
                return "是";
            }else{
                return "否";
            }
        }}
];

export { tacheCodeCols, exceptionReasonCols, formConfig, tacheCatalogSaveFormConfig };