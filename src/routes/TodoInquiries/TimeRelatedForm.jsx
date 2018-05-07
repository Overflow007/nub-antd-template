import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import moment from 'moment';
import { Form, DatePicker, Row, Col , Button,Input,TreeSelect } from 'antd';
const FormItem = Form.Item;

const treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    label: 'Child Node1',
    value: '0-0-1',
    key: '0-0-1',
  }, {
    label: 'Child Node2',
    value: '0-0-2',
    key: '0-0-2',
  }],
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
}];



class TimeRelatedForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    console.log('表单值：', this.props.form.getFieldsValue());
  }
  render() {
    const { getFieldProps,getFieldDecorator} = this.props.form;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
      <Row type="flex" justify="end">
      <Col span="4">
        <FormItem
        {...formItemLayout}
          label="流程实例ID"
        >
        
            <Input placeholder="Username" {...getFieldProps('flowId')}/>
        </FormItem>
      </Col>
      <Col span="4">
        <FormItem
        {...formItemLayout}
          label="开始时间"
          >
           {getFieldDecorator("start",{
                initialValue:moment('2015/01/01', dateFormat)
                })(
                  <DatePicker showTime    format={dateFormat} />
          )}
        </FormItem>
      </Col>
      <Col span="4">
      <FormItem
      {...formItemLayout}
          label="结束时间"
        >
           {getFieldDecorator("end",{
                initialValue:moment('2015/04/01', dateFormat)
                })(
                  <DatePicker showTime    format={dateFormat} />
          )}
        </FormItem>
      </Col>
      <Col span="4">
      <FormItem
      {...formItemLayout}
          label="环节"
        >
          <TreeSelect
                  style={{ width: 100 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={treeData}
                  placeholder="Please select"
                  treeDefaultExpandAll
                  onChange={this.onChange}
                  {...getFieldProps('Link')}
                />
        </FormItem>
      </Col>
      <Col span="4">
      <FormItem
      {...formItemLayout}
          label="区域"
        >
          <TreeSelect
                  style={{ width: 100 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={treeData}
                  placeholder="Please select"
                  treeDefaultExpandAll
                  onChange={this.onChange}
                  {...getFieldProps('Area')}
                />
        </FormItem>
      </Col>
        
        
        
        
        <FormItem>
          <Button type="primary" htmlType="submit">查看</Button>
        </FormItem>
        </Row>
      </Form>
    
    );
  }
}



export default Form.create()(TimeRelatedForm)
