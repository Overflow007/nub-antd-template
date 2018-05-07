import React, { Component } from 'react';
import _ from 'lodash';

const formConfig={
    fields:[
        {
            rowId: 1,
            col: 8,
            orderNum:1,
            label: '业务名称',
            showLabel: true,
            key:'serviceName',
            type: 'input',
            props: {
                placeholder: '请输入业务关键字',
                defaultValue: ''
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

export {formConfig}