/* eslint-disable no-tabs */
import React, { Component } from 'react';
import { Modal } from 'antd';
import utils from 'common/utils';
import http from 'common/http';
import styles from './WorkTimeModal.scss';
import AddWorkTimeModal from './modals/AddWorkTimeModal';
const PREFIX = 'flow-worktime-modal';
const cx = utils.classnames(PREFIX, styles);

class WorkTimeModal extends Component {

	constructor(props){
		super(props);
		this.state = {

		}
	}

	removeWorkTime = (id) => {
		http.post('/call/call.do', {
			bean: 'WorkTimeServ',
			method: 'delWorkTime',
			param: { id: id }
		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			if (res){
				const returnData = JSON.parse(res);
				if (returnData.isSuccess){
					Modal.success({ title: '提示', content: '删除成功' });
					
				} else {
					Modal.error('提示', '删除失败');
				}
			} else {
				Modal.error({ title: '提示', content: '删除失败' });
			}
		}, res => {
			Modal.error({ title: '提示', content: '删除失败' });
		});
	}

	renderModal = () => {
		const { type, selectRowData, ..._props } = this.props;
		switch (type){
			case 'addWorkTime':
				return (<AddWorkTimeModal type="add" wrapClassName="flow-worktime-modal vertical-center-modal" {..._props} />);
			case 'editWorkTime':
				if (!selectRowData) {
					Modal.warning({ title: '提示', content: '请选择需要修改的数据' });
					if (this.props.onCancel){
						this.props.onCancel();
					}
					return null;
				}
				return (<AddWorkTimeModal type="edit" wrapClassName="flow-worktime-modal vertical-center-modal" formValues={selectRowData} {..._props} />);
			case 'deleteWorkTime':
				if (!this.props.selectRowData) {
					if (this.props.onCancel){
						this.props.onCancel();
					}
					return null;
				}
				Modal.confirm({
					title: '提示',
					content: '确定删除该工作时间吗',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.removeWorkTime(this.props.selectRowData.id);
					},
					onCancel: () => {
						if (this.props.onCancel){
							this.props.onCancel();
						}
					},
				});
				return null;
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

export default WorkTimeModal;