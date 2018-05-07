import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import {Icon} from 'antd';

const catalogEditFormConfig={
    fields:[
        {
            rowId: 1,
            col: 24,
            orderNum:1,
            label: '目录名称',
            showLabel: true,
            key:'reasonCatalogName',
            type: 'input',
            required: true,
            rules: [{ required: true, whitespace: true, message: '请输入目录名称' }],
            props: {
                placeholder: '',
                defaultValue:'',
                style:{width: '250px'}
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

const searchFormConfig={
    fields:[
        {
            rowId: 1,
            col: 6,
            orderNum:1,
            label: '流程名称',
            // showLabel: true,
            key:'packageDefineName',
            type: 'input',
            props: {
                placeholder: '流程名称',
                defaultValue:'',
                style:{width: '200px'},
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
        }
    ]
}

const flowLimitCols=[
    {title:'流程名称',dataIndex:'processName',width:150},
    {title:'区域',dataIndex:'areaName',width:150},
    {title:'完成时限值',dataIndex:'limitValue',width:150},
    {title:'告警时限值',dataIndex:'alertValue',width:150},
    {title:'时间单位',dataIndex:'timeUnit',width:150,
        render:function(value,row,index){
            var value_=value;
            if(value=="MIN"){
                value_="分钟";
            }else if(value=='HOR'){
                value_="小时";
            }else if(value=='DAY'){
                value_="天";
            }else{
                value_="未定义";
            }
            return value_;
        }},
    {title:'只计算工作日',dataIndex:'isWorkTime',width:150,
        render:function(value,row,index){
            if(value=="1"){
                return "是";
            }else{
                return "否";
            }
        }}
];

export {flowLimitCols,searchFormConfig}