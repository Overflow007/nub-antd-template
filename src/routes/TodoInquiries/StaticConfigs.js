import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
const formConfig={
    fields:[
        {
            rowId: 1,
            col: 6,
            orderNum:1,
            label: '流程实例',
            showLabel: true,
            key:'processInstanceId',
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
            col: 6,
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
            rowId: 1,
            col: 6,
            orderNum:1,
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
            col: 6,
            orderNum:1,
            label: '状态',
            showLabel: true,
            key:'status',
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
            label: '状态',
            showLabel: true,
            key:'status',
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
        }
    ],
    
   
    submitButtonProps: {

    }
}
export {formConfig}