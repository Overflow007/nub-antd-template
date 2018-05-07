/* eslint-disable no-tabs */
import React, { Component } from 'react';
import { Button, Modal, Form, Table, Input, Row, Col, DatePicker, Icon, Popconfirm } from 'antd';
import { observer } from 'mobx-react';
import session from 'models/Session';
import utils from 'common/utils';
import http from 'common/http';
import DynamicSearchForm from 'components/DynamicSearchForm';
import StandardTable from 'components/StandardTable';
import { workTimeCols } from '../StaticConfigs';
import moment from 'moment';
import styles from './Modal.scss';

const FormItem = Form.Item;
const PREFIX = 'flow-worktime-modal';
const cx = utils.classnames(PREFIX, styles);

const baseFieldConf = {
	col: 12,
	orderNum: 1,
	showLabel: true,
	required: true,
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
const EditableCell = ({ editable, value, onChange }) => (
	<div>
	  {editable
		? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
		: value
	  }
	</div>
  );

@observer
class AddWorkTimeModal extends Component{

	constructor(props){
		super(props);
		this.state = {
			title: props.type == 'add' ? '增加工作时间' : '修改工作时间',
			formValues: props.type == 'add' ? {} : props.formValues,
			showRight : false,
			wtRuledataArr: [],
			count: 0,
			loading : true
		};
		this.cacheData = [];
	}
	/**
	 * 组件渲染前调用
	 */
	componentWillUnmount() {
		
	}
	componentDidMount = () => {
		var wtRule = [];
		var count = 0;
		if(this.state.formValues.workTimeRule){
			var timeStr = this.state.formValues.workTimeRule;
			if(timeStr){
				var timeStrArr = timeStr.split(" ");
				var dataArr = new Array();
				var timeArr = new Array();
				
				for(let i=0;i<timeStrArr.length;i++){
					timeArr =  timeStrArr[i].split("-");	
					var data = new Object();
					data.key = i.toString(),
					data.startTime = timeArr[0];
					data.endTime = timeArr[1];
					dataArr.push(data);
				}
				wtRule = dataArr;
				count = timeStrArr.length;
			}
			
			this.setState({
				wtRuledataArr: wtRule,
				count : count
			});
			this.cacheData = wtRule;
		}
	}

	getFormConfig = (tacheType) => {
		const formConfig = {
			fields: [
				
				{
					rowId: 1,
					label: '工作时间名称',
					key: 'workTimeName',
					type: 'input',
					rules: [{ required: true, whitespace: true, message: '请输入名称' }],
					validateTrigger: ['onChange', 'onBlur'],
					props: {
						placeholder: '工作时间名称',
						defaultValue: this.state.formValues.workTimeName,
						onChange: (value) => { const formValues = this.state.formValues; formValues.workTimeName = value; this.setState({ formValues }); },
					},
					...baseFieldConf
				},
				{
					rowId: 1,
					label: '时间段',
					key: 'workTimeRule',
					type: 'input',
					props: {
						placeholder: '时间段',
						disabled: true,
						addonAfter : <Icon type="setting" className="dynamic-search-button"
									onClick={() => {this.setState({ showRight: true });}}/>,
						defaultValue: this.state.formValues.workTimeRule ? String(this.state.formValues.workTimeRule) : '',
						onChange: (value) => { const formValues = this.state.formValues; formValues.workTimeRule = value; this.setState({ formValues }); }
					},
					...baseFieldConf
				},
				{
					rowId: 2,
					label: '生效时间',
					key: 'effDate',
					type: 'datetime',
					props: {
						placeholder: '生效时间',
						defaultValue: moment(this.state.formValues.effDate) || moment(new Date()),
						onChange: (value) => { this.state.formValues.effDate = value; },
					},
					...baseFieldConf
				},
				{
					rowId: 2,
					label: '失效时间',
					key: 'expDate',
					type: 'datetime',
					props: {
						placeholder: '失效时间',
						defaultValue: moment(this.state.formValues.expDate) || moment(new Date()),
						onChange: (value) => { this.state.formValues.expDate = value; },
					},
					...baseFieldConf
				},
				{
					rowId: 3,
					label: '备注',
					key: 'comments',
					type: 'textarea',
					rules: [{ required: false, whitespace: true, message: '' }],
					validateTrigger: [],
					props: {
						placeholder: '备注',
						defaultValue: this.state.formValues.comments,
						autosize : { minRows: 2, maxRows: 10 },
						onChange: (value) => { const formValues = this.state.formValues; formValues.comments = value; this.setState({ formValues }); },
					},
					...baseFieldConf
				},
			]
		};
		return formConfig;
	}
	
	onCancel = () => {

	}
	handleOk = () => {

	}
	handleWtOk = () => {
		const form = this.formRef.props.form;

		form.validateFields((err, values) => {
			if (err) return;

			for (const k in values) {
				if (values[k] instanceof moment) {
					values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
				}
			}
			this.setState({
				formValues: values
			});

			let workTimeName = values.workTimeName,
				workTimeRule = values.workTimeRule,
				comments = values.comments,
				effDate = values.effDate,
				expDate = values.expDate;

			if (effDate != ''){
				if(new Date(effDate).getTime() < new Date().getTime()){
					Modal.warning({ title: '提示', content: '生效时间不能晚于当前时间' });
					return;
				}
			}
			if (expDate != ''){
				if (new Date(expDate).getTime() < new Date().getTime()){
					Modal.warning({ title: '提示', content: '失效时间必须晚于当前时间' });
					return;
				}
			}

			const params = {
				workTimeName: workTimeName,
				workTimeRule: workTimeRule,
				effDate: effDate,
				expDate: expDate,
				comments:comments,
				areaId: 1,
				systemCode:session.currentTendant.tenantCode
			};
			if(this.props.type == 'add'){
				this.addWorkTime(params);
			} else if(this.props.type == 'edit') {
				params.id = this.state.formValues.id;
				this.editWorkTime(params);
			}
		});
	}

	editWorkTime = (params = {}) => {
		http.post('/call/call.do', { bean: 'WorkTimeServ', method: 'modWorkTime', param: params }, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData.isSuccess) {
				Modal.success({ title: '提示', content: '修改成功' });
				if (this.props.onOk){
					this.props.onOk();
				}
			} else {
				Modal.error({ title: '提示', content: '修改失败' });
			}

		}, res => {
			Modal.error({ title: '提示', content: '修改失败' });
		});
	}

	addWorkTime = (params = {}) => {
		http.post('/call/call.do', {
			bean: 'WorkTimeServ',
			method: 'addWorkTime',
			param: params

		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			/** const returnData = JSON.parse(res); */
			if (res.isSuccess) {
				Modal.success({ title: '提示', content: '新增成功' });
				if (this.props.onOk){
					this.props.onOk();
				}
			} else {
				Modal.error({ title: '提示', content: '新增失败' });
			}

		}, res => {
			Modal.error({ title: '提示', content: '新增失败' });
		});
	}

	handleRowClick = () => {

	}
	renderColumns= (text, record, column) => {
		return (
		  <EditableCell
			editable={record.editable}
			value={text}
			onChange={value => this.handleChange(value, record.key, column)}
		  />
		);
	}
	handleChange(value, key, column) {
		const newData = [...this.state.wtRuledataArr];
		const target = newData.filter(item => key === item.key)[0];

		if (target) {
		  target[column] = value;
		  this.setState({ wtRuledataArr: newData });
		}
	  }

	editRow(key) {
		const newData = [...this.state.wtRuledataArr];
		const target = newData.filter(item => key === item.key)[0];
		if (target) {
		  target.editable = true;
		  this.setState({ wtRuledataArr: newData, editable : true });
		}
	}
	saveRow(key) {
		const newData = [...this.state.wtRuledataArr];
		const target = newData.filter(item => key === item.key)[0];
		
		if (target) {
		  delete target.editable;
		  this.cacheData = newData.map(item => ({ ...item }));

			var timeStr ="";
			var allItem = newData;
			for(var i=0;i< allItem.length;i++){
				var tempTimeStr = allItem[i].startTime +"-"+  allItem[i].endTime;	
				if(i==0){			
					timeStr =tempTimeStr;
				}else{
					timeStr =timeStr + " " + tempTimeStr;
				}
			}
			let newFormValues = this.state.formValues;
			newFormValues["workTimeRule"] = timeStr;
		  this.setState({ 
			  wtRuledataArr: newData,
			  formValues: newFormValues
		});

		  
		}
	}
	onDeleteRow = (key) => {
		const dataSource = [...this.state.wtRuledataArr];

		var timeStr ="";
		var allItem = dataSource.filter(item => item.key !== key) ;
		for(var i=0;i< allItem.length;i++){
			var tempTimeStr = allItem[i].startTime +"-"+  allItem[i].endTime;	
			if(i==0){			
				timeStr =tempTimeStr;
			}else{
				timeStr =timeStr + " " + tempTimeStr;
			}
		}
		let newFormValues = this.state.formValues;
		newFormValues["workTimeRule"] = timeStr;
		this.setState({ 
			wtRuledataArr: dataSource.filter(item => item.key !== key),
			formValues: newFormValues
		 });
	  }
	handleAdd = () => {
		const { count, wtRuledataArr } = this.state;
		const newData = {
		  key: count,
		  startTime: ''
		};
		this.setState({
		  wtRuledataArr: [...wtRuledataArr, newData],
		  count: count + 1
		});
	  }
	render = () => {

		const wtRuleCols = [
			{ title: '上班时间(h:m)', dataIndex: 'startTime', width: "20%", render: (text, record) => this.renderColumns(text, record, 'startTime')},
			{ title: '下班时间(h:m)', dataIndex: 'endTime', width: "20%",render: (text, record) => this.renderColumns(text, record, 'endTime')},
			{ title: '操作', dataIndex: 'operation', width : "20%",render: (text, record) => {
				const { editable } = record;
				return (
				<div className="editable-row-operations">
					{
					editable ?
							<span>
							<a onClick={() => this.saveRow(record.key)}>保存</a>
							<Popconfirm title="确认删除?" onConfirm={() => this.onDeleteRow(record.key)}>
								<a >删除</a>
							</Popconfirm>
							</span>
						: <a onClick={() => this.editRow(record.key)}>编辑</a>
					}
				</div>
				);
			}}
		];

		const contentProps = {};
		const leftContent = (
			<div style={{ margin: '20px' }}>
				<DynamicSearchForm
							wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
							formConfig={this.getFormConfig()}
							hideFooter={true}
						/>
			</div>			
		);
		const rightContent = (
			<div>
				<div style={{ padding: '10px', fontSize: '16px', fontWeight: '500' }}>选择时间段</div>
				<div className="toolBar">
					<Button.Group>
						<Button icon="plus" operation="addWtRule" onClick={this.handleAdd}>新增</Button>
					</Button.Group>
				</div>
				<Table
					columns={wtRuleCols} 
					bordered
					dataSource={this.state.wtRuledataArr} 
					rowkey = 'key'
				/>
			</div>
				);

		console.log(this.state.wtRuledataArr);
		if (this.state.showRight){
			
			contentProps.cols = [
				{ key: 'left', span: 14, content: leftContent, style: { borderRight: '1px solid #eeeeee'} },
				{ key: 'right', span: 10, content: rightContent, style: { borderLeft: '1px solid #eeeeee' }},
			]
		} else {
			
			contentProps.cols = [
				{ key: 'left', span: 24, content: leftContent }
			]


		}

		return (
			<Modal
				className={`${cx('worktime-save-modal')}`}
				title={this.state.title}
				okText="保存"
				cancelText="取消"
				{...this.props}
				onOk={this.handleWtOk}
				
				mask={true} 
				maskClosable={false}>
				<Row>
					{ contentProps.cols.map(({ content, ...otherProps }) => {
						return (<Col {...otherProps}>{content}</Col>);
					})}
				</Row>


			</Modal>
		);
	}
}

export default Form.create()(AddWorkTimeModal);