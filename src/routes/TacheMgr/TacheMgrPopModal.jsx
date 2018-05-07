/* eslint-disable no-tabs */
import React, { Component } from 'react';
import { Modal } from 'antd';
import utils from 'common/utils';
import http from 'common/http';
import SaveTacheCatalogModal from './modals/SaveTacheCatalogModal';
import AddOrEditTacheModal from './modals/AddOrEditTacheModal';
import ExceptionReasonModal from './modals/ExceptionReasonModal';
import styles from './TacheMgrPopModal.scss';

const PREFIX = 'flow-tachemgr-modal';
const cx = utils.classnames(PREFIX, styles);

class TacheMgrPopModal extends Component {

	constructor(props){
		super(props);
		this.state = {

		};
	}

	removeTache = (tacheId) => {
		http.post('/call/call.do', {
			bean: 'ReturnReasonServ',
			method: 'hasActiveReturnReasonsByTacheId',
			param: { tacheId }
		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData.isHas){
				Modal.warning({ title: '提示', content: '该环节存在启用状态的异常原因，请先禁用异常原因！' });
				return;
			}

			return http.post('/call/call.do', {
				bean: 'TacheServ',
				method: 'delTache',
				param: { id: tacheId }
			}, {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			});

		}, res => {
			throw '查询环节异常原因失败';
		}).then(res => {
			if (res){
				const returnData = JSON.parse(res);
				if (returnData.isSuccess){
					Modal.success({ title: '提示', content: '删除成功' });
					if (this.props.onOk) {
						this.props.onOk();
					}
				} else {
					Modal.error('提示', '删除环节失败');
				}
			} else {
				Modal.error({ title: '提示', content: '删除环节失败' });
			}
		}, res => {
			Modal.error({ title: '提示', content: '删除环节失败' });
		});
	}

	renderModal = () => {
		const { type, selectRowData, ..._props } = this.props;
		switch (type){
			case 'addCataLog':
				return (<SaveTacheCatalogModal type={type} {..._props} />);
			case 'editCataLog':
				return (<SaveTacheCatalogModal type={type} {..._props} />);
			case 'deleteCataLog':
				return (<SaveTacheCatalogModal type={type} {..._props} />);
			case 'addSubCataLog':
				return (<SaveTacheCatalogModal type={type} {..._props} />);
			case 'addTache':
				return (<AddOrEditTacheModal type="add" wrapClassName="flow-tachemgr-modal vertical-center-modal" {..._props} />);
			case 'editTache':
				if (!selectRowData) {
					Modal.warning({ title: '提示', content: '请选择需要修改的数据' });
					if (this.props.onCancel){
						this.props.onCancel();
					}
					return null;
				}
				return (<AddOrEditTacheModal type="edit" wrapClassName="flow-tachemgr-modal vertical-center-modal" formValues={selectRowData} {..._props} />);
			case 'deleteTache':
				if (!this.props.selectRowData) {
					if (this.props.onCancel){
						this.props.onCancel();
					}
					return null;
				}
				Modal.confirm({
					title: '提示',
					content: '确定删除该环节吗',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.removeTache(this.props.selectRowData.id);
					},
					onCancel: () => {
						if (this.props.onCancel){
							this.props.onCancel();
						}
					},
				});
				return null;
			case 'showEexceptionReasonList':
				if (!selectRowData){
					if (this.props.onCancel){
						this.props.onCancel();
					}
					return null;
				}
				const { id } = selectRowData;
				return <ExceptionReasonModal type={type} tacheId={id} {..._props} />;
			default:
				if (this.props.onCancel){
					this.props.onCancel();
				}
				return null;
		}
	}

	render = () => {
		return this.renderModal();
	}
}

export default TacheMgrPopModal;