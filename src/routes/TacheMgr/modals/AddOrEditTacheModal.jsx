/* eslint-disable no-tabs */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import session from 'models/Session';
import utils from 'common/utils';
import http from 'common/http';
import DynamicSearchForm from 'components/DynamicSearchForm';
import moment from 'moment';
import styles from './Modal.scss';

const FormItem = Form.Item;
const PREFIX = 'flow-tachemgr-modal';
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

@observer
class AddOrEditTacheModal extends Component{

	constructor(props){
		super(props);
		this.state = {
			title: props.type == 'add' ? '增加环节' : '修改环节',
			packageCatalogs: [], // 流程目录
			formValues: props.type == 'add' ? {
				tacheType: 'NORMAL',
				isAuto: '0',
				tacheCatalogId: props.currentCatalogId,
			} : props.formValues
		};
	}

	componentDidMount = () => {
		this.loadPackageCatalogs();
	}

	getFormConfig = (tacheType) => {
		const formConfig = {
			fields: [
				{
					rowId: 1,
					label: '环节编码',
					key: 'tacheCode',
					type: 'input',
					rules: [{ required: true, whitespace: true, message: '请输入环节编码' }],
					validateTrigger: ['onChange', 'onBlur'],
					props: {
						placeholder: '环节编码',
						defaultValue: this.state.formValues.tacheCode,
						disabled: this.props.formValues ? true : false,
						onChange: (value) => { const formValues = this.state.formValues; formValues.tacheCode = value; this.setState({ formValues }); },
					},
					...baseFieldConf
				},
				{
					rowId: 1,
					label: '环节名称',
					key: 'tacheName',
					type: 'input',
					rules: [{ required: true, whitespace: true, message: '请输入环节名称' }],
					validateTrigger: ['onChange', 'onBlur'],
					props: {
						placeholder: '环节名称',
						defaultValue: this.state.formValues.tacheName,
						onChange: (value) => { const formValues = this.state.formValues; formValues.tacheName = value; this.setState({ formValues }); },
					},
					...baseFieldConf
				},
				{
					rowId: 2,
					label: '所属目录',
					key: 'tacheCatalogId',
					type: 'treeselect',
					props: {
						placeholder: '所属目录',
						treeDefaultExpandAll: true,
						treeData: this.tacheCatalogTree2TreeData(this.props.tacheCatalogTree),
						defaultValue: this.state.formValues.tacheCatalogId ? String(this.state.formValues.tacheCatalogId) : '',
						onChange: (value) => { const formValues = this.state.formValues; formValues.tacheCatalogId = value; this.setState({ formValues }); }
					},
					...baseFieldConf
				},
				{
					rowId: 2,
					label: '环节类型',
					key: 'tacheType',
					type: 'dataselect',
					props: {
						placeholder: '环节类型',
						dataKeyField: 'key',
						dataValueField: 'name',
						dataSource: [{ key: 'NORMAL', name: '普通环节' }, { key: 'DUMMY', name: '数据驱动环节' }],
						selectedKey: 'NORMAL',
						defaultValue: this.state.formValues.tacheType,
						onChange: (value) => { const formValues = this.state.formValues; formValues.tacheType = value; this.setState({ formValues }); },
					},
					...baseFieldConf
				},
				{
					rowId: 3,
					label: '自动回单',
					key: 'isAuto',
					type: 'dataselect',
					props: {
						placeholder: '环节名称',
						dataKeyField: 'key',
						dataValueField: 'name',
						dataSource: [{ key: '1', name: '是' }, { key: '0', name: '否' }],
						selectedKey: '0',
						defaultValue: this.state.formValues.isAuto,
						onChange: (value) => { this.state.formValues.isAuto = value; },
					},
					...baseFieldConf
				},
				{
					rowId: 4,
					label: '生效时间',
					key: 'effDate',
					type: 'date',
					props: {
						placeholder: '生效时间',
						defaultValue: moment(this.state.formValues.effDate) || moment(new Date()),
						onChange: (value) => { this.state.formValues.effDate = value; },
					},
					...baseFieldConf
				},
				{
					rowId: 4,
					label: '失效时间',
					key: 'expDate',
					type: 'date',
					props: {
						placeholder: '失效时间',
						defaultValue: moment(this.state.formValues.expDate),
						onChange: (value) => { this.state.formValues.expDate = value; },
					},
					...baseFieldConf
				}
			]
		};
		return formConfig;
	}

	loadPackageCatalogs = () => {
		const param = {
			areaId: 1,
			systemCode: session.currentTendant.tenantCode
		}
		http.post('/call/call.do', { bean: 'FlowServ', method: 'queryPackageCatalogByAreaIdAndSystemCode', param }, { 'Content-Type': 'application/x-www-form-urlencoded'})
		.then(res => {
			const resData = JSON.parse(res);
			if(resData){
				this.setState({
					packageCatalogs: resData
				});
			}
		}, res => {
			console.error('failed!!!', res);
		});
	}

	tacheCatalogTree2TreeData = (tacheCatalogTree) => {
		return (tacheCatalogTree||[]).map( x => ({ label: x.text, value: `${x.id}`, key: `${x.id}`, children: this.tacheCatalogTree2TreeData(x.children) }));
	}

	handleTacheAdd = () => {
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;

			for (const k in values) {
				if (values[k] instanceof moment) {
					values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
				}
			}
			this.setState({
				formValues: values,
			});

			let tacheType = values.tacheType,
				tacheCode = values.tacheCode,
				tacheName = values.tacheName,
				isAuto = values.isAuto,
				subFlowNames = values.subFlowNames,
				packageDefineCodes = [],
				effDate = values.effDate,
				expDate = values.expDate,
				tacheCatalogId = values.tacheCatalogId;

			if(tacheType == 'NORMAL') {
				tacheType = '';
			}else if(tacheType=='FLOW'){
				if(!subFlowNames){
					Modal.warning({ title: '提示', content: '请选择子流程' });
					return;
				}
			}
			/* TODO 子流程处理
			var packageDefineCodes=[];
			$.each($('#subFlowNames').data('rows'),function(i,n){
				packageDefineCodes.push(n.code);
			});*/

			if (effDate != ''){
				if(new Date(effDate).getTime() > new Date().getTime()){
					Modal.warning({ title: '提示', content: '生效效时间不能晚于当前时间' });
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
				tacheCatalogId: tacheCatalogId,
				tacheCode: tacheCode,
				tacheName: tacheName,
				tacheType: tacheType,
				isAuto: isAuto,
				effDate: effDate,
				expDate: expDate,
				packageDefineCodes: packageDefineCodes.join(),
				systemCode: session.currentTendant.tenantCode
			};

			if(this.props.type == 'add'){
				this.addTache(params);
			} else if(this.props.type == 'edit') {
				params.id = this.state.formValues.id;
				this.editTache(params);
			}
		});
	}

	editTache = (params = {}) => {
		http.post('/call/call.do', { bean: 'TacheServ', method: 'modTache', param: params }, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData.isSuccess) {
				Modal.success({ title: '提示', content: '修改环节成功' });
				if (this.props.onOk){
					this.props.onOk();
				}
			} else {
				Modal.error({ title: '提示', content: '修改环节失败' });
			}

		}, res => {
			Modal.error({ title: '提示', content: '修改环节失败' });
		});
	}

	addTache = (params = {}) => {
		http.post('/call/call.do', {
			bean: 'TacheServ',
			method: 'addTache',
			param: params

		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData) {
				this.setState({
					tacheCatalogTree: returnData
				});
			}

			if (returnData.id){
				if (returnData.id == '-1'){
					Modal.warning({ title: '提示', content: '环节编码重复' });
				} else {
					Modal.success({ title: '提示', content: '新增环节成功' });

					if (this.props.onOk){
						this.props.onOk();
					}
				}
			} else {
				Modal.error({ title: '提示', content: '新增环节失败' });
			}

		}, res => {
			Modal.error({ title: '提示', content: '新增环节失败' });
		});
	}

	render = () => {
		return (
			<Modal
				className={`${cx('tache-save-modal')}`}
				title={this.state.title}
				okText="保存"
				cancelText="取消"
				{...this.props}
				style={{ width: '100%' }}
				onOk={this.handleTacheAdd}>
					<DynamicSearchForm
						wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
						formConfig={this.getFormConfig(this.state.formValues.tacheType)}
						hideFooter={true}
					/>
			</Modal>
		);
	}
}

export default Form.create()(AddOrEditTacheModal);