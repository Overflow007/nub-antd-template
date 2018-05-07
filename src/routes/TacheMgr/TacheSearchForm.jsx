/* eslint-disable no-tabs */
import React, { Component } from 'react';
import { Form, Select, Input, Icon } from 'antd';
import DataSelect from 'components/DataSelect';
import utils from 'common/utils';

const FormItem = Form.Item;

class TacheSearchForm extends Component {

	handleSelectChange = (value, target) => {
		console.log(value);
	}

    render = () => {
		const {
			onSubmitForm,
			onSelectedChange,
			onTacheCodeInputChange,
			onTachaNameInputChange,
			form, 
			...props
		} = this.props;

        return (
             <Form layout="inline" {...props}>
                <FormItem>
	                <Select
		                showSearch
		                defaultValue="enabled"
		                placeholder="环节状态"
		                style={{ width: 120 }}
		                onChange={onSelectedChange}
		                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
	                >
			                <Select.Option value="enabled">有效</Select.Option>
			                <Select.Option value="disable">失效</Select.Option>
			                <Select.Option value="all">全部</Select.Option>
	                </Select>
                </FormItem>
                <FormItem>
	                <Input
		                placeholder="请输入环节编码"
		                style={{ width: '150px' }}
		                onChange={onTacheCodeInputChange}
		                onPressEnter={onSubmitForm} />
                </FormItem>
                <FormItem>
	                <Input.Search
		                placeholder="请输入环节名称"
		                style={{ width: '180px' }}
		                onChange={onTachaNameInputChange}
		                onSearch={onSubmitForm}
		                enterButton
	                />
                </FormItem>
             </Form>
        );
    }
}

export default Form.create()(TacheSearchForm);