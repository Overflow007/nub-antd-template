import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import {Icon} from 'antd';

const excecptionStatus = [{
    value: 'all',
    text: '全部'
},{
    value: '10A',
    text: '有效'
},{
    value: '10P',
    text: '失效'
}];

const excecptionClass = [{
    value: '1',
    text: '业务异常'
},{
    value: '2',
    text: '系统异常'
}];

const excecptionType = [{
    value: '10R',
    text: '退单'
},{
    value: '10W',
    text: '待装'
},{
    value: '10C',
    text: '撤单'
},{
    value: '10Q',
    text: '改单'
},{
    value: '10P',
    text: '缓装'
},{
    value: 'all',
    text: '全部'
}];

const formConfig={
    fields:[
        {
            rowId: 1,
            col: 5,
            orderNum:1,
            label: '异常状态',
            // showLabel: true,
            key:'state',
            type: 'select',
            props: {
                placeholder: '有效',
                defaultValue:'10A',
                style:{width: '150px'}
            },
            needExpend: false,
            options:excecptionStatus,
            formItemLayout: {
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 6 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 10 },
                }
              }
        },
        {
            rowId: 1,
            col: 5,
            orderNum:1,
            label: '异常类别',
            // showLabel: true,
            key:'reasonType',
            type: 'select',
            props: {
                placeholder: '全部',
                defaultValue:'all',
                style:{width: '150px'}
            },
            needExpend: false,
            options:excecptionType,
            formItemLayout: {
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 6 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 10 },
                }
              }
        },
        {
            rowId: 1,
            col: 5,
            orderNum:1,
            label: '异常原因编码',
            // showLabel: true,
            key:'reasonCode',
            type: 'input',
            props: {
                placeholder: '异常原因编码',
                defaultValue:'',
                style:{width: '150px'}
            },
            needExpend: false,
            formItemLayout: {
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 6 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 10 },
                }
            }
        },
        {
            rowId: 1,
            col: 5,
            orderNum:1,
            label: '异常原因名称',
            // showLabel: true,
            key:'returnReasonName',
            type: 'input',
            props: {
                placeholder: '异常原因名称',
                defaultValue:'',
                style:{width: '150px'},
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
                  sm: { span: 10 },
                }
            }
        }
    ]
}

const dynamicFormConfig={
    fields:[
        {
            rowId: 1,
            col: 24,
            orderNum:1,
            label: '异常原因编码',
            showLabel: true,
            key:'reasonCode',
            type: 'input',
            required: true,
            rules: [{ required: true, whitespace: true, message: '请输入异常原因编码' }],
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
        },
        {
            rowId: 2,
            col: 24,
            orderNum:1,
            label: '异常原因名称',
            showLabel: true,
            key:'returnReasonName',
            type: 'input',
            required: true,
            rules: [{ required: true, whitespace: true, message: '请输入异常原因名称' }],
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
        },
        {
            rowId: 3,
            col: 24,
            orderNum:1,
            label: '异常原因类型',
            showLabel: true,
            key:'reasonType',
            type: 'select',
            required: true,
            props: {
                placeholder: '退单',
                defaultValue:'10R',
                style:{width: '250px'}
            },
            needExpend: false,
            options:excecptionType,
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

const dynamicEditFormConfig={
    fields:[
        {
            rowId: 1,
            col: 24,
            orderNum:1,
            label: '异常原因编码',
            showLabel: true,
            key:'reasonCode',
            type: 'input',
            required: true,
            props: {
                placeholder: '',
                defaultValue:'',
                disabled:true,
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
              },
            // disabled: true
        },
        {
            rowId: 2,
            col: 24,
            orderNum:1,
            label: '异常原因名称',
            showLabel: true,
            key:'returnReasonName',
            type: 'input',
            required: true,
            rules: [{ required: true, whitespace: true, message: '请输入异常原因名称' }],
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
        },
        {
            rowId: 3,
            col: 24,
            orderNum:1,
            label: '所属目录',
            showLabel: true,
            key:'reasonCatalogId',
            type: 'select',
            required: true,
            props: {
                placeholder: '',
                defaultValue:'',
                style:{width: '250px'}
            },
            needExpend: false,
            options:[],
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
            rowId: 4,
            col: 24,
            orderNum:1,
            label: '异常原因类型',
            showLabel: true,
            key:'reasonType',
            type: 'select',
            required: true,
            props: {
                placeholder: '',
                defaultValue:'',
                disabled:true,
                style:{width: '250px'}
            },
            needExpend: false,
            options:excecptionType,
            formItemLayout: {
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 6 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 18 },
                }
            },
            // disabled: true
        }
    ]
}

const catalogFormConfig={
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

const exceptionReasonCols = [
    {title:'编码',dataIndex:'reasonCode',width:180},
    {title:'名称',dataIndex:'returnReasonName',width:200},
    {title:'类型',dataIndex:'reasonType',width:180,
        render:function(value){
            if(value=='10R'){
                return '退单';
            }else if(value=='10W'){
                return '待装';
            }else if(value=='10C'){
                return '撤单';
            }else if(value=='10Q'){
                return '改单';
            }else if(value=='10P'){
                return '缓装';
            }
        }}
];

const relationCols=[
    {title:'环节目录',dataIndex:'tacheCatalogName',width:100},
    {title:'区域',dataIndex:'areaName',width:80},
    {title:'环节名称',dataIndex:'tacheName',width:100},
    {title:'环节编码',dataIndex:'tacheCode',width:80},
    {title:'状态',dataIndex:'state',width:80,
        render:function(value,row,index){
            var value_=value;
            if(value=="10A"){
                value_="启用";
            }else{
                value_="停用";
            }
            return value_;
        }},
    {title:'是否需要审核',dataIndex:'auditFlag',width:80,
        render:function(value,row,index){
            if(value=="1"){
                return "是";
            }else{
                return "否";
            }
        }}
];

const relationFormConfig={
    fields:[
        {
            rowId: 1,
            col: 24,
            orderNum:1,
            label: '异常原因编码',
            showLabel: true,
            key:'reasonCode',
            type: 'input',
            required: true,
            rules: [{ required: true, whitespace: true, message: '请输入异常原因编码' }],
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
        },
        {
            rowId: 2,
            col: 24,
            orderNum:1,
            label: '异常原因名称',
            showLabel: true,
            key:'returnReasonName',
            type: 'input',
            required: true,
            rules: [{ required: true, whitespace: true, message: '请输入异常原因名称' }],
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
        },
        {
            rowId: 3,
            col: 24,
            orderNum:1,
            label: '异常原因类型',
            showLabel: true,
            key:'reasonType',
            type: 'select',
            required: true,
            props: {
                placeholder: '退单',
                defaultValue:'10R',
                style:{width: '250px'}
            },
            needExpend: false,
            options:excecptionType,
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

export {relationCols, exceptionReasonCols, formConfig, dynamicFormConfig, catalogFormConfig, dynamicEditFormConfig, catalogEditFormConfig, relationFormConfig }