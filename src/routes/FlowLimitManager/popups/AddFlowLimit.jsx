import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Form, Modal, Button, Popover, Icon, message, Tree, Card} from 'antd';
import moment from 'moment';
import DynamicSearchForm from 'components/DynamicSearchForm';

/**
 * 添加流程时限
 */
@observer
class AddFlowLimit extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }

    
    handleFlowLimitAddOk = () => {

    }

    render = ()=>{
        console.log("??????",this.props);
        const { flowTree, areaTree, onCancel } = this.props;
        return (
            <Modal 
                title="增加流程时限" 
                visible = {true} 
                closable = {true}
                onOk={this.handleFlowLimitAddOk} 
                onCancel={onCancel}
                okText="确定" 
                cancelText="取消"  
                width="30%">
                <DynamicSearchForm 
                    wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
                    formConfig={addFormConfig}
                    hideFooter='true'
                >
                </DynamicSearchForm>
            </Modal>);
    }
}

const addFormConfig={
    fields:[
        {
            rowId: 1,
            col: 24,
            orderNum:1,
            label: '流程名称',
            showLabel: true,
            key:'packageId',
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
            label: '区域',
            showLabel: true,
            key:'areaId',
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
            label: '完成时限值',
            showLabel: true,
            key:'limitValue',
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
            rowId: 3,
            col: 24,
            orderNum:1,
            label: '告警时限值',
            showLabel: true,
            key:'alertValue',
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
            rowId: 3,
            col: 24,
            orderNum:1,
            label: '时间单位',
            showLabel: true,
            key:'alertValue',
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
            rowId: 3,
            col: 24,
            orderNum:1,
            label: '是否只计算工作日',
            showLabel: true,
            key:'alertValue',
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
        }
    ]
}

AddFlowLimit.propTypes = {
    flowTree: PropTypes.array.isRequired,
    areaTree: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddFlowLimit;