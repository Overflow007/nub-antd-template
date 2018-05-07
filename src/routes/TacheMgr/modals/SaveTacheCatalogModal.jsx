/* eslint-disable no-tabs */
import React, { Component } from 'react';
import { Modal, Form, message } from 'antd';
import http from 'common/http';
import session from 'models/Session';
import DynamicSearchForm from 'components/DynamicSearchForm';
import { tacheCatalogSaveFormConfig } from '../StaticConfigs';

class SaveTacheCatalogModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			toRender: true,
			type: '',
			formConfig: tacheCatalogSaveFormConfig,
			systemCode: session.currentTendant.tenantCode,
			tacheCatalogId: '',
			tacheCatalogName: '',
			parentTacheCatalogId: ''
		}

		let _type = props.type;
		if (!props.currentTacheCatalog) _type = '';
		switch (_type){
			case 'addCataLog':
				this.state.title = '增加目录';
				this.state.parentTacheCatalogId = props.currentTacheCatalog.parentCatalogId;
				this.state.tacheCatalogName = '';
				this.state.formConfig.fields[0].props.defaultValue = '';
				this.state.type = 'add';
				break;
			case 'editCataLog':
				this.state.title = '修改目录';
				this.state.parentTacheCatalogId = props.currentTacheCatalog.parentCatalogId;
				this.state.tacheCatalogId = props.currentTacheCatalog.id;
				this.state.catalogName = props.currentTacheCatalog.text;
				this.state.formConfig.fields[0].props.defaultValue = props.currentTacheCatalog.text;
				this.state.type = 'edit';
				break;
			case 'addSubCataLog':
				this.state.title = '增加子目录';
				this.state.parentTacheCatalogId = props.currentTacheCatalog.id;
				this.state.tacheCatalogName = '';
				this.state.formConfig.fields[0].props.defaultValue = '';
				this.state.type = 'add';
				break;
			case 'deleteCataLog':
				this.state.toRender = false;
				if (!this.props.currentTacheCatalog) {
					if (this.props.onCancel){
						this.props.onCancel();
					}
					break;
				}
				this.state.tacheCatalogId = props.currentTacheCatalog.id;
				this.toComfirmAndremoveTacheCatalog();
				break;
			default:
				message.warning('请选中操作的目录');
				if (props.onCancel){
					props.onCancel();
				}
				this.state.toRender = false;
		}
	}

	handleOnOk = (e) => {
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;
			this.state.tacheCatalogName = values.tacheCatalogName;
			if (this.state.type == 'add') {
				this.addTacheCatalog();
			} else if (this.state.type == 'edit') {
				this.editTacheCatalog();
			}
		});
	}

	addTacheCatalog = () => {
		http.post('/call/call.do', {
			bean: 'TacheServ',
			method: 'addTacheCatalog',
			param: {
				tacheCatalogName: this.state.tacheCatalogName,
				parentTacheCatalogId: this.state.parentTacheCatalogId,
				systemCode: this.state.systemCode
			}
		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData.catalogId) {
				Modal.success({ title: '提示', content: '新增环节目录成功' });
				if (this.props.onOk){
					this.props.onOk();
				}
			} else {
				Modal.error({ title: '提示', content: '新增环节目录失败' });
			}

		}, res => {
			Modal.error({ title: '提示', content: '新增环节目录失败' });
		});
	}

	editTacheCatalog = () => {
		http.post('/call/call.do', {
			bean: 'TacheServ',
			method: 'modTacheCatalog',
			param: {
				tacheCatalogName: this.state.tacheCatalogName,
				id: this.state.tacheCatalogId
			}
		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData.isSuccess) {
				Modal.success({ title: '提示', content: '修改环节目录成功' });
				if (this.props.onOk){
					this.props.onOk();
				}
			} else {
				Modal.error({ title: '提示', content: '修改环节目录失败' });
			}

		}, res => {
			Modal.error({ title: '提示', content: '修改环节目录失败' });
		});
	}

	toComfirmAndremoveTacheCatalog = () => {
		http.post('/call/call.do', {
			bean: 'TacheServ',
			method: 'qryTaches',
			param: { tacheCatalogId: this.state.tacheCatalogId, state: '10A', page: 1, pageSize: 1, systemCode: this.state.systemCode }
		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData.rows.length > 0){
				Modal.warning({ title: '提示', content: '该目录下存在环节，无法删除' });
				return;
			}

			Modal.confirm({
				title: '提示',
				content: '确定该目录吗',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.removeTacheCatalog();
				},
				onCancel: () => {
					if (this.props.onCancel){
						this.props.onCancel();
					}
				},
			});

		}, res => {
			Modal.error({ title: '提示', content: '删除环节目录失败' });
		});
	}

	removeTacheCatalog = () => {
		http.post('/call/call.do', {
			bean: 'TacheServ',
			method: 'delTacheCatalog',
			param: { id: this.state.tacheCatalogId }
		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData.isSuccess){
				Modal.success({ title: '提示', content: '删除环节目录成功' });
				if (this.props.onOk) {
					this.props.onOk();
				}
			} else {
				Modal.error('提示', '删除环节目录失败');
			}
		}, res => {
			Modal.error({ title: '提示', content: '删除环节目录失败' });
		});
	}

	render = () => {
		const { onOk, ...otherProps } = this.props;
		return this.state.toRender ? (
			<Modal title={this.state.title} defaultValue={this.state.tacheCatalogName} okText="保存" cancelText="取消" {...otherProps} onOk={this.handleOnOk}>
				<DynamicSearchForm
					wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
					formConfig={this.state.formConfig}
					hideFooter={true}
				/>
			</Modal>
		) : null;
	}
}

export default Form.create()(SaveTacheCatalogModal);