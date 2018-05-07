import React, { Component } from 'react';
import { Form, InputNumber, Input, DatePicker, TimePicker, Button, Select, Row, Col, Icon, Rate, TreeSelect  } from 'antd';
import DataSelect from 'components/DataSelect';
import utils from 'common/utils';
import moment from 'moment';
import _ from 'lodash';
import styles from './DynamicSearchForm.scss';
import AsynchronousLinkSelectTree from 'components/AsynchronousLinkSelectTree';


const PREFIX = 'flow-dynamic';
const cx = utils.classnames(PREFIX,styles);

const defalutFormItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    }
  }

const formConfig = {
    fields:[
        {
            rowId: 1,
            col: 12,
            orderNum:1,
            label: '环节状态',
            showLabel: true,
            key:'tacheStatus',
            type: 'input',
            required: true,
            rules: [{
                required: true,
                whitespace: true,
                message: "Please input passenger's name or delete this field."
            }],
            validateTrigger: ['onChange', 'onBlur'],
            props: {
                placeholder: ''
            },
            needExpend: false,
            formItemLayout: {
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 6 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 14 },
                }
              }
        }
    ],
    
    onSubmit: () => {
        //console.log('submit');
    },
    submitButtonProps: {

    }
};
const FormItem = Form.Item;
class DynamicSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'formConfig': props.formConfig,
            'expand':false
        }
        
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            formConfig: nextProps.formConfig
        });
    }

    
    renderOptions=(x)=>{

    }

    renderActualComp=(child)=>{
        let defaultValue = null; 
        if(child.props.defaultValue!=null){
            if(typeof(child.props.defaultValue)==='function'){
                defaultValue=child.props.defaultValue();
            }else{
                defaultValue=child.props.defaultValue;
            }
        }

        let cprops = Object.assign({},child.props);
        delete cprops.defaultValue;
        //console.log()
        if(child.type.toLowerCase()=='date'){
            return (<DatePicker {...cprops} />);
        }

        if(child.type.toLowerCase()=='dataselect'){
            return (<DataSelect {...cprops}/>);
        }
        if(child.type.toLowerCase()=='datetime'){
            return (<DatePicker  {...cprops} showTime format="YYYY-MM-DD HH:mm:ss"/>);
        }
        
        if(child.type.toLowerCase()=='select'){
            //console.log('dynamic select',child.options)
            return (<Select {...cprops} >
                {
            child.options.map((option, index) => {
              return (<Select.Option key={option.value} value={option.value}>{option.text}</Select.Option>)
            })
          }
            </Select>);
        }

        if(child.type.toLowerCase()=='rate'){
            return (<Rate {...cprops}  />);
        }

        if(child.type.toLowerCase()=='switch' ){
            return (<Switch {...cprops} />);
            
        }
        if(child.type.toLowerCase()=='AsynchronousLinkSelectTree'){
            return (<AsynchronousLinkSelectTree {...cprops}  />);
        }

        // 树选择
        if (child.type.toLowerCase()=='treeselect'){
            return (<TreeSelect {...cprops} />);

        }
        //大文本框
        if (child.type.toLowerCase()=='textarea'){
            return (<Input.TextArea {...cprops} />);
        }

        return (<Input {...cprops} />);
    }

    getNeedExpand=()=>{
        const fields = this.state.formConfig.fields;
        let needExpend = false;
        for(let k in fields){
            needExpend = needExpend || fields[k].needExpend;
        }

        return needExpend;
    }
    
    getInlineFields = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return this.state.formConfig.fields.map(child => {
            let defaultValue = null; 
            if(child.props.defaultValue!=null){
                if(typeof(child.props.defaultValue)==='function'){
                    defaultValue=child.props.defaultValue();
                }else{
                    defaultValue=child.props.defaultValue;
                }
            }

            //console.log('defaultValue',defaultValue);


            if(child.showLabel){
                let formItemLayout = defalutFormItemLayout;
                if(child.formItemLayout){
                    formItemLayout = child.formItemLayout;
                }
                return (<FormItem  key={`${cx('formitem_'+child.key)}`}
                        label={`${child.label}`}
                        required={child.required}
                        {...formItemLayout}
                        >
                    {getFieldDecorator(`${child.key}`,{
                        rules:child.rules,initialValue:defaultValue,
                        validateTrigger:child.validateTrigger?child.validateTrigger:['onChange', 'onBlur']
                    })(this.renderActualComp(child))}
                   
                    </FormItem>)
            }else{
                return (<FormItem key={`${cx('formitem_'+child.key)}`}>
                    {getFieldDecorator(`${child.key}`,{
                        rules:child.rules,initialValue:defaultValue,
                        validateTrigger:child.validateTrigger?child.validateTrigger:['onChange', 'onBlur']
                    })(this.renderActualComp(child))}
                    
                    </FormItem>)
            }

            
        });
    }

    getFields = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        
        
        let rows = [];

        this.state.formConfig.fields.map(x => {
            if(x.rowId!=null){
                let row = rows[x.rowId]
                if(row == null) {
                    row={
                    children:[],
                    show:true
                    };
                } 
                rows[x.rowId]=row;
                row.rowId=x.rowId
                row.children.push(x);
                row.show = row.show && (this.state.expand? true : !x.needExpend);
            }
        });
        rows = _.pull(rows,null,undefined);
        //console.log('rendering fields',rows);
        let ret = rows.map(x => 
           
            (<Row key={`${cx('formrow_'+x.rowId)}`} gutter={24} style={{ display: x.show ? 'block' : 'none' }}>{
                x.children.map(child => {
                    let defaultValue = null; 
                    if(child.props.defaultValue!=null){
                        if(typeof(child.props.defaultValue)==='function'){
                            defaultValue=child.props.defaultValue();
                        }else{
                            defaultValue=child.props.defaultValue;
                        }
                    }

                    //console.log('defaultValue',defaultValue);


                    if(child.showLabel){
                        let formItemLayout = defalutFormItemLayout;
                        if(child.formItemLayout){
                            formItemLayout = child.formItemLayout;
                        }
                        return (<Col span={child.col} key={`${cx('formcol_'+child.key)}`} className={`${cx('searchform-col')}`} style={{ display: (this.state.expand? true : !child.needExpend) ? 'block' : 'none' }}>
                            <FormItem 
                                label={`${child.label}`}
                                required={child.required}
                                {...formItemLayout}
                                >
                            {getFieldDecorator(`${child.key}`,{
                                rules:child.rules,initialValue:defaultValue,
                                validateTrigger:child.validateTrigger?child.validateTrigger:['onChange', 'onBlur']
                            })(this.renderActualComp(child))}
                           
                            </FormItem>
                        </Col>)
                    }else{
                        return (<Col span={child.col} key={`${cx('formcol_'+child.key)}`} className={`${cx('searchform-col')}`} style={{ display: (this.state.expand? true : !child.needExpend) ? 'block' : 'none' }}>
                            <FormItem >
                            {getFieldDecorator(`${child.key}`,{
                                rules:child.rules,initialValue:defaultValue,
                                validateTrigger:child.validateTrigger?child.validateTrigger:['onChange', 'onBlur']
                            })(this.renderActualComp(child))}
                            
                            </FormItem>
                        </Col>)
                    }

                    
                })
            }</Row>)
        );

        let floatFields = _.filter(this.state.formConfig.fields, function(f) { return !f.rowId; });
        if(floatFields==null){
            floatFields=[];
        }


        return ret.concat(floatFields.map(child=>{
            let defaultValue = null; 
                    if(child.props.defaultValue!=null){
                        if(typeof(child.props.defaultValue)==='function'){
                            defaultValue=child.props.defaultValue();
                        }else{
                            defaultValue=child.props.defaultValue;
                        }
                    }

                    //console.log('defaultValue',defaultValue);


                    if(child.showLabel){
                        let formItemLayout = defalutFormItemLayout;
                        if(child.formItemLayout){
                            formItemLayout = child.formItemLayout;
                        }
                        return (
                            <FormItem key={`${cx('formitem_'+child.key)}`} style={{width:child.width?(child.width+'px'):'150px'}}
                                label={`${child.label}`}
                                required={child.required}
                                {...formItemLayout}
                                >
                            {getFieldDecorator(`${child.key}`,{
                                rules:child.rules,initialValue:defaultValue,
                                validateTrigger:child.validateTrigger?child.validateTrigger:['onChange', 'onBlur']
                            })(this.renderActualComp(child))}
                           
                            </FormItem>)
                    }else{
                        return (
                            <FormItem key={`${cx('formitem_'+child.key)}`} style={{width:child.width?(child.width+'px'):'150px'}}>
                            {getFieldDecorator(`${child.key}`,{
                                rules:child.rules,initialValue:defaultValue,
                                validateTrigger:child.validateTrigger?child.validateTrigger:['onChange', 'onBlur']
                            })(this.renderActualComp(child))}
                            
                            </FormItem>
                        )
                    }

        }));
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            for(let k in values){
                //moment(val).format('YYYY-MM-DD HH:mm:ss')
                //console.log(k,values[k] instanceof moment);
                if(values[k] instanceof moment){
                    values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
                }
            }
          if(this.props.onSubmit){
            this.props.onSubmit(err, values)
          }
        });
      }

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
        //console.log('toggle',!expand);
      }

      renderFooter=()=>{
        if(this.props.hideFooter)return null;
        return (<Row>
            <Col span={24} style={{ textAlign: 'right' }}>
            <div className={'clearfix'}>
                <div style={{float:'left'}}>
                    {this.props.children}
                </div>
                <div style={{float:'right'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    
                    <a style={{ marginLeft: 8, fontSize: 12,display:(this.getNeedExpand()?'inline':'none') }} onClick={this.toggle}>
                    {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
                    </a>
                </div>
            </div>
                
            </Col>
        </Row>);
      }

      
    renderInlineForm(){
        return (<Form
            className={`ant-advanced-search-form ${cx('searchform')} ${this.props.className}`}
            style={this.props.style}
            layout='inline'
            onSubmit={this.handleSearch}
          >
          {this.getInlineFields()}
          {this.props.children}
          </Form>);
    }
    
    render(){
        if(this.state.formConfig.layout=='inline'){
            return this.renderInlineForm();
        }
        return (<Form
            className={`ant-advanced-search-form ${cx('searchform')} ${this.props.className}`}
            style={this.props.style}
            onSubmit={this.handleSearch}
          >
            {this.getFields()}
            {this.renderFooter()}
          </Form>);
    }
}

export default Form.create()(DynamicSearchForm);