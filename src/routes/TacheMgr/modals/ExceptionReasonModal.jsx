/* eslint-disable no-tabs */
import React, { Component } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import http from 'common/http';
import StandardTable from 'components/StandardTable';
import AddTacheExceptionReasonModal from './AddTacheExceptionReasonModal';
import './ExceptionReasonModal.scss';

const PREFIX = 'flow-tache-exreson';

const exceptionColumns = [
	{ title: '名称', dataIndex: 'returnReasonName', width: 150 },
	{ title: '区域', dataIndex: 'areaName', width: 80 },
	{ title: '异常原因类别', dataIndex: 'reasonType', width: 150, render: (value) => { return value == '10R' ? '退单' : ''; } },
	{ title: '状态', dataIndex: 'state', width: 80, render: (value) => { return value == '10A' ? '启用' : '禁用'; } },
	{ title: '是否需要审核', dataIndex: 'auditFlag', width: 150, render: (value) => { return value == '0' ? '否' : '是'; } }
]

class ExceptionReasonModal extends Component {
	constructor(props){
		super(props);

		this.state = {
			tacheId: props.tacheId ? props.tacheId : null,
			selectedRows: [],
			visible: props.visible,
			gridData: { rows: [], pagination: false },
			showRight: false
		};
	}

	/**
	 * 组件初始化后操作事件
	 */
	componentDidMount = () => {
		this.loadExceptionGridData();
	}

	/**
	 * 查询环节异常原因列表数据，通过 setState({gridData}) 改变表格数据;
	 */
	loadExceptionGridData = () => {
		if (!this.props.tacheId) return;
		this.setState({ loading: true });
		http.post('/call/call.do', { bean: 'ReturnReasonServ', method: 'qryTacheReturnReasons', param: { tacheId: this.props.tacheId } }, {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}).then(res => {
				const returnData = JSON.parse(res);
				if (returnData) {
					const { gridData } = this.state;
					gridData.rows = returnData.rows;
					gridData.total = returnData.total;
					this.setState({ loading: false, gridData });
				}

			}, res => {
				const { gridData } = this.state;
				gridData.rows = [];
				this.setState({ loading: false, gridData });
				console.error('failed!!', res);
		});
	}

	/**
	 * 启用环节异常原因
	 * @param rows
	 * @param callback
	 */
	enableReason = () => {
		if (this.state.selectedRows.length == 0) return;
		Modal.confirm({
			title: '提示',
			content: '确定启用该环节异常原因吗？',
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				this.toEnableReason(this.state.selectedRows[0]);
			}
		});
	}

	toEnableReason = (row) => {
		http.post('/call/call.do',
			{
				bean: 'ReturnReasonServ',
				method: 'modTacheReturnReason',
				param: {
					tacheId: this.state.tacheId,
					returnReasonId: row.returnReasonId,
					state: '10A',
					areaId: '1'
				}
			},
			{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
		).then(res => {
			const resData = JSON.parse(res);
			if (resData.isSuccess){
				Modal.success({ title: '提示', content: '启用环节异常原因成功' });
			}
			this.loadExceptionGridData();
		}, res => {
			Modal.error({ title: '提示', content: '启用环节异常原因失败' });
		});
	}

	/**
	 * 禁用环节异常原因
	 * @param rows
	 * @param callback
	 */
	disableReason = () => {
		if (this.state.selectedRows.length == 0) return;
		Modal.confirm({
			title: '提示',
			content: '确定禁用该环节异常原因吗？',
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				this.toDisableReason(this.state.selectedRows[0]);
			}
		});		
	}

	toDisableReason = (row) => {
		http.post('/call/call.do',
			{
				bean: 'ReturnReasonServ',
				method: 'delTacheReturnReason',
				param: {
					tacheId: this.state.tacheId,
					returnReasonId: row.returnReasonId,
					areaId: '1'
				}
			},
			{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
		).then(res => {
			const resData = JSON.parse(res);
			if (resData.isSuccess){
				Modal.success({ title: '提示', content: '禁用环节异常原因成功' });
			}
			this.loadExceptionGridData();
		}, res => {
			Modal.error({ title: '提示', content: '禁用环节异常原因失败' });
		});
	}

	handleSelectChange = (keys, rows) => {
		this.setState({ selectedRows: rows });
	};

	/**
	 * 组件渲染
	 * @returns {*}
	 */
	render = () => {
		if (!this.props.tacheId){
			if (this.props.onCancel){
				this.props.onCancel();
			}
			return null;
		}

		const modalProps = {...this.props};
		const contentProps = {};
		const leftContent = (
			<div style={{ margin: '20px' }}>
				<Button.Group>
					<Button icon="plus" onClick={() => { this.setState({ showRight: true }); }}>新增</Button>
					<Button icon="check-circle-o" onClick={this.enableReason}>启用</Button>
					<Button icon="minus-circle-o" onClick={this.disableReason}>禁用</Button>
				</Button.Group>

				<StandardTable
					bordered={true}
					ref={'exceptionReasonTable'}
					rowKey="returnReasonId"
					data={this.state.gridData}
					onSelectChange={this.handleSelectChange}
					columns={exceptionColumns}
					clicktoSelect={true}
					rowSelection={{ type: 'single' }}
					scroll={{ x: true, y: (document.querySelector('body').clientHeight-350) }}
				/>
			</div>
		);
		const rightContent = (<AddTacheExceptionReasonModal tacheId={this.state.tacheId} ref="tacheExReasonAddForm" onOk={() => {
			this.loadExceptionGridData();
		}} />);

		if (this.state.showRight){
			modalProps.okText = '保存';
			modalProps.cancelText = '取消';
			modalProps.width = '80%';
			modalProps.onOk = () => {
				this.refs.tacheExReasonAddForm.handleOnOk();
			};
			modalProps.onCancel = () => {
				this.setState({ showRight: false });
			};
			contentProps.cols = [
				{ key: 'left', span: 14, content: leftContent, style: { borderRight: '1px solid #eeeeee'} },
				{ key: 'right', span: 10, content: rightContent, style: { borderLeft: '1px solid #eeeeee' }},
			]
		} else {
			modalProps.footer = null;
			modalProps.width = '50%';
			contentProps.cols = [
				{ key: 'left', span: 24, content: leftContent }
			]
		}

		return (
			<Modal 
				className={`${PREFIX}`}
				{...modalProps}
				title="环节适配异常原因" 
				mask={true} 
				maskClosable={false}
			>
				<Row>
					{ contentProps.cols.map(({ content, ...otherProps }) => {
						return (<Col {...otherProps}>{content}</Col>);
					})}
				</Row>
				
			</Modal>
		);
	}
}

export default ExceptionReasonModal;