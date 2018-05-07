/* eslint-disable no-tabs */
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Modal, Tree, Input, message } from 'antd';
import _ from 'lodash';
import http from 'common/http';
import session from 'models/Session';
import DynamicSearchForm from 'components/DynamicSearchForm';

const TreeNode = Tree.TreeNode;
const { Search } = Input;
const catalogKeyPre = 'RSC-';

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
class AddTacheExceptionReasonModal extends Component {

	constructor(props){
		super(props);
		this.state = {
			tacheId: props.tacheId, //  环节ID
			form: {
				areaData: []
			},
			formValues: {
				areaId: '', // 区域
				audiFlag: '0', // 是否需要审核
				state: '10A', // 状态
			},
			tree: {
				data: [],
				expandedKeys: [], // 打开的节点的key值
				autoExpandParent: false, // 是否自动打开父节点
				checkedKeys: [], // 复选框选中
				selectedKeys: [] // 节点选中
			}
		};
	}

	/**
	 * 组件渲染完成时触发
	 */
	componentDidMount = () => {
		this.loadAreaData();
		this.loadTreeData();
	}

	componentDidUpdate = (prevProps, prevState) => {
		prevState.tree.autoExpandParent = false;
	}

	loadAreaData = () => {
		http.post('/call/call.do', { bean: 'AreaServ', method: 'getAreaJsonTree', param: { areaId: '1' } }, { 'Content-Type': 'application/x-www-form-urlencoded' })
		.then(res => {
			const resData = JSON.parse(res);
			if(resData){
				const { form } = this.state;
				form.areaData = resData;
				this.setState({ form });
			}
		}, res => {
			console.error(res);
		});
	}

	/**
	 * 展开/收起节点时触发
	 * @param expandedKeys
	 */
	onExpand = (expandedKeys, { expanded, node }) => {
		const treeProps = this.state.tree;
		treeProps.expandedKeys = expandedKeys;
		this.setState({ tree: treeProps });
		this.loadSubTreeNodes(node);
	}

	/**
	 * 点击复选框选中触发
	 * @param checkedKeys
	 * @param e
	 */
	onCheck = (checkedKeys, e) => {
		const treeProps = this.state.tree;
		treeProps.checkedKeys = checkedKeys;
		this.setState({ tree: treeProps });
	}

	onSelect = (selectedKeys, { node }) => {
		if (!selectedKeys || selectedKeys.length == 0) return;
		const tree = this.state.tree;
		tree.selectedKeys = selectedKeys;
		tree.expandedKeys = _.union(tree.expandedKeys, selectedKeys);
		this.setState({ tree });
		this.loadSubTreeNodes(node);
	}

	onTreeSearch = (value) => {
		
		const param = {
			returnReasonName: value,
			systemCode: session.currentTendant.tenantCode,
			state: '10A',
			page: 1,
			pageSize: 300
		}
		
		http.post('/call/call.do', { bean: 'ReturnReasonServ', method: 'qryReturnReasons', param }, { 'Content-Type': 'application/x-www-form-urlencoded' })
		.then(res => {
			const resData = JSON.parse(res);
			if (resData && resData.rows.length > 0){
				
				const firstSearReason = resData.rows[0];
				const expandNode = this.refs[`${catalogKeyPre}${firstSearReason.reasonCatalogId}`];
				if (!expandNode) {
					return ;
				}
				
				const { key, hadLoadChild } = expandNode.props.dataRef;
				if(!hadLoadChild){
					this.loadSubTreeNodes(expandNode);
				}

				const { tree } = this.state;
				tree.expandedKeys = _.union(tree.expandedKeys, [ key ]);
				tree.autoExpandParent = true; // 注意，此处设置了自动展开父节点，子节点没有关闭时，无法关闭父节点，可在 componentDidUpdate 的 prevState 中设置为false
				tree.selectedKeys = [`${firstSearReason.id}`];
				this.setState({ tree });

			}
		}, err => {
			console.warn('failed!!!', err);
		});
	}

	loadSubTreeNodes = (node) => {

		const { key, hadLoadChild } = node.props.dataRef;
		if (!key.startsWith(catalogKeyPre) || hadLoadChild) return; // 判断是否为目录或者判断是否已经加载目录下的异常数据
		node.props.dataRef.hadLoadChild = true;
		const reasonCatalogId = key.substring(catalogKeyPre.length);

		const { tree } = this.state;
		http.post('/call/call.do', { bean: 'ReturnReasonServ', method: 'qryReturnReasons', param: { reasonCatalogId, state: '10A', systemCode: session.currentTendant.tenantCode, page: 1, pageSize: 300 } }, { 'Content-Type': 'application/x-www-form-urlencoded' })
		.then(res => {
			const resData = JSON.parse(res);
			if (resData){

				const treeData = this.ReasonConvert2TreeData(resData.rows);
				const subCheckedKeys = treeData.map(item => item.key);

				if (node.props.checked){
					tree.checkedKeys = _.union(this.state.tree.checkedKeys, subCheckedKeys);
				}
				node.props.dataRef.children = [
					...(node.props.dataRef.children || []),
					...treeData
				];
			}
			this.setState({ tree });
		}, res => {
			console.error('failed!!!', res);
		});
	}

	getFormConfig = () => {
		const formConfig =
			{
				fields: [
					{
						rowId: 1,
						label: '区域',
						key: 'areaId',
						type: 'dataselect',
						rules: [{ required: true, whitespace: true, message: '请选择区域' }],
						props: {
							placeholder: '区域',
							dataKeyField: 'id',
							dataValueField: 'text',
							dataSource: this.state.form.areaData,
							selectedKey: this.state.formValues.areaId,
							defaultValue: this.state.formValues.areaId,
							onChange: (value) => { this.state.formValues.areaId = value; },
						},
						...baseFieldConf
					},
					{
						rowId: 1,
						label: '是否需要审核',
						key: 'audiFlag',
						type: 'dataselect',
						rules: [{ required: true, whitespace: true, message: '请选择是否需要审核' }],
						props: {
							placeholder: '是否需要审核',
							dataKeyField: 'key',
							dataValueField: 'value',
							dataSource: [{ key: '0', value: '否' }],
							selectedKey: this.state.formValues.audiFlag,
							defaultValue: this.state.formValues.audiFlag,
							onChange: (value) => { this.state.formValues.audiFlag = value; },
						},
						...baseFieldConf,
						formItemLayout: {
							labelCol: {
								xs: { span: 24 },
								sm: { span: 12 },
							},
							wrapperCol: {
								xs: { span: 24 },
								sm: { span: 12 },
							}
						}
					},
					{
						rowId: 2,
						label: '状态',
						key: 'state',
						type: 'dataselect',
						rules: [{ required: true, whitespace: true, message: '请选择状态' }],
						props: {
							placeholder: '状态',
							dataKeyField: 'key',
							dataValueField: 'value',
							dataSource: [{ key: '10A', value: '启用' }, { key: '10P', value: '禁用' }],
							selectedKey: this.state.formValues.state,
							defaultValue: this.state.formValues.state,
							onChange: (value) => { this.state.formValues.state = value; },
						},
						...baseFieldConf
					}
				]
			};
		return formConfig;
	}

	/**
	 * 加载树数据，设置 state.tree.data
	 */
	loadTreeData = () => {
		http.post('/call/call.do', { bean: 'ReturnReasonServ', method: 'qryReturnReasonCatalogTree', param: { systemCode: session.currentTendant.tenantCode } }, { 'Content-Type': 'application/x-www-form-urlencoded' })
		.then(res => {
			const resData = JSON.parse(res);
			const treeData = this.ReasonCatalogConvert2TreeData(resData);
			const { tree } = this.state
			tree.data = treeData;
			this.setState({ tree });
		}, res => {
			const { tree } = this.state
			tree.data = [];
			this.setState({ tree });
			console.error('failed', res);
		});
	}

	ReasonCatalogConvert2TreeData = (gridTreeData) => {
		const antdTreeData = [];

		return (gridTreeData || []).map(item => {
			const { id, text, children, ...others } = item;
			if (children) {
				return { key: `${catalogKeyPre}${id}`, title: text, children: this.ReasonCatalogConvert2TreeData(children), ...others };
			}
			return { key: `${catalogKeyPre}${id}`, title: text, ...others };
		});
	}

	ReasonConvert2TreeData = (reasonData) => {
		return (reasonData || []).map(item => {
			const { id, returnReasonName, ...others } = item;
			return { key: `${id}`, title: returnReasonName, ...others };
		});
	}

	/**
	 * 渲染树节点
	 * @param treeNodes
	 */
	renderTreeNodes = (treeNodes) => {
		return (treeNodes || []).map((item) => {
			if (item.children) {
				return (
					<TreeNode {...item} ref={item.key} dataRef={item}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode {...item} ref={item.key} dataRef={item} />;
		});
	}

	handleOnOk = (info) => {
		const form = this.formRef.props.form;
		const checkedKeys = this.state.tree.checkedKeys;
		const rsCheckedKeys = (checkedKeys || []).filter(key => !key.startsWith(catalogKeyPre));
		if (!rsCheckedKeys || rsCheckedKeys.length == 0) {
			message.warning('请选择异常原因');
			return;
		}

		form.validateFields((err, values) => {
			if (err) return;

			// 1. 判断是否已存在
			// 2. 保存数据
			http.post('/call/call.do',
				{ bean: 'ReturnReasonServ', method: 'qryTacheReturnReasons', param: { tacheId: this.state.tacheId } },
				{ 'Content-Type': 'application/x-www-form-urlencoded' })
			.then(res => {
				const resData = JSON.parse(res);
				if (resData) {
					const reData = resData.rows.filter(item => _.indexOf(rsCheckedKeys, `${item.returnReasonId}`) > -1);
					if (reData.length > 0){
						return { isHas: true };
					}
				}
				return { isHas: false };
			}, errRes => {
				Modal.error({ title: '提示', content: '查询环节的异常原因失败' });
				console.error('failed!!!', errRes);
			}).then(validRes => {
				if (validRes.isHas){
					message.warning('已存在相同配置的环节异常原因');
					return;
				}
				
				console.log('tacheId', this.state.tacheId);
				
				http.post('/call/call.do', { bean: 'ReturnReasonServ', method: 'addTacheReturnReason', param: {
					tacheId: this.state.tacheId,
					returnReasonIds: rsCheckedKeys,
					...values,
				}}, { 'Content-Type': 'application/x-www-form-urlencoded' })
				.then(res => {
					const resData = JSON.parse(res);
					if (resData.isSuccess){
						Modal.success({ title: '提示', content: '新增环节的异常原因成功' });
						if (this.props.onOk){
							this.props.onOk();
						}
					} else {
						Modal.error({ title: '提示', content: '新增环节的异常原因失败' });
					}
				}, errRes => {
					Modal.error({ title: '提示', content: '新增环节的异常原因失败' });
					console.error('failed!!!', errRes);
				});
			}, errRes => {
				Modal.error({ title: '提示', content: '新增环节的异常原因失败' });
				console.error('failed!!!', errRes);
			});
		});
	}


	render = () => {

		const { onOk, ...otherProps } = this.props;

		return (
			<div>
				<div style={{ padding: '10px', fontSize: '16px', fontWeight: '500' }}>新增异常原因</div>
				<DynamicSearchForm
					style={{ padding: '10px', borderTop: '1px solid #eeee' }}
					wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
					formConfig={this.getFormConfig()}
					hideFooter={true}
				/>
				<div className="exception-tree-container" style={{ padding: '10px', borderTop: '1px solid #eeee' }}>
					<div style={{ fontSize: '16px', height: '32px' }}>
						异常原因列表
						<Search style={{ float: 'right', width: 200 }} placeholder="Search" onSearch={this.onTreeSearch} enterButton/>
					</div>
					<Tree
						checkable
						onExpand={this.onExpand}
						expandedKeys={this.state.tree.expandedKeys}
						autoExpandParent={this.state.tree.autoExpandParent}
						onCheck={this.onCheck}
						checkedKeys={this.state.tree.checkedKeys}
						onSelect={this.onSelect}
						selectedKeys={this.state.tree.selectedKeys}
					>
						{this.renderTreeNodes(this.state.tree.data)}
					</Tree>
				</div>
			</div>
		);
	}

}

export default AddTacheExceptionReasonModal;