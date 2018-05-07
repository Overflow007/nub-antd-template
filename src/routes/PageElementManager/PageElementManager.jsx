import React, { Component } from 'react';
import { Select, Table, Modal, Button, Form, Icon, message, Input } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { extractPath } from 'common/path';
import moment from 'moment';
import styles from './PageElementManager.scss';
import StandardTable from 'components/StandardTable';
import NonModalDialog from 'components/NonModalDialog';
import DynamicSearchForm from 'components/DynamicSearchForm';
import DynamicForm from 'components/DynamicForm';
import session from 'models/Session';
import { tableColumnsTitle, intiTableDefaultParam, searchFormTagConfig, addFormTagConfig, initShowItemArray, initAllItemArray } from './StaticConfigs'

const FormItem = Form.Item;
const PREFIX = 'flow-pageelementmgr';
const cx = utils.classnames(PREFIX, styles);


/**
 * 元素管理
 */
@observer
class PageElementManager extends Component {


	//将表格配置参数定义在全局state域中，兼初始化state的作用
	state = {
		index: 0,//执行次数
		selectedKeys: [],//被选择行所记录的行索引号记录数组
		selectedRows: [],//被选择行所记录的行记录数组，数组的每个对象按顺序代表选中的行数据
		/** 查询参数对象，因为一般的查询条件放在查询表单中，所以此处是命名formValue*/
		formValues: {
			"eleCode": "",
			"eleName": ""
		},
		/**footer下的分页导航栏信息 */
		pagination: {
			"showSizeChanger": true,//是否支持变更页面展示条数
			"showQuickJumper": true,//是否支持快速跳页
			"current": 1,//当前所在页数
			"pageSize": 10,//默认页面展示行数
			"total": 0 //是否当页完全展示所有项，0-否；1-是
		},
		sorter: {},//排序字段
		filtersArg: {},//排序和过滤参数
		modalName: '',//用以弹出模态框，当此值发生改变时，会重绘页面对象，充分利用this.setStatus({})进行操作
		isloading: false, //是否正在加载中
		popFormTagConfig: {},//弹出框（新增弹出、修改弹出）的表单项配置信息
		elementTypeValue: '',//元素类型
		buttonFuncValue: ''//按钮事件
	}

	/**构造器 */
	constructor(props) {
		super(props);
	}

	/**删除左右两端的空格*/
	trim = str => {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}

	/**
	 * 获取数组的的并集、差集、交集 
	 *@param{array} array1 数组1
	 *@param{array} array2 数组2
	 *@param{String} modle 模式union-并集；intersect-交集；dfrcset-差集
	 *@returns{array} 返回一个数组
	 *
	 * */
	setOperation = (array1, array2, models) => {
		let set1 = new Set(array1);
		let set2 = new Set(array2);

		if (models == 'union') {//并集 
			return [...new Set([...set1, ...set2])];
		}

		if (models == 'intersect') {//交集  
			return [...new Set([...set1, ...set2])];
		}

		if (models == 'dfrcset') {//差集 
			return [...new Set([...set1].filter(x => !set2.has(x)))];
		}
		console.error('函数调用模式未知，请检查参数！');
		return [];
	}


	/** 已插入真实 DOM 之前调用,即首次render()之前，重绘不再在调用*/
	componentWillMount() {
		console.log("调用此处0000a");
		// 此处将弹出框的两个下拉框添加两个监听事件
		addFormTagConfig.fields[0].props.onChange = this.handleElementTypeChange;//元素类型下拉框添加下拉选项
		addFormTagConfig.fields[11].props.onChange = this.handleButtonFuncChange;//按钮点击事件下拉框添加下拉选项
		//将表单项信息存于本地
		this.state.popFormTagConfig = _.cloneDeep(addFormTagConfig);
	}

	/**重绘即将发生时调用,每次(除开首次加载)重绘前均会掉用 */
	componentWillUpdate(nextProps, nextState) {
		// console.log("调用此处0000c");
		// console.log("获取到元素33333：" + this.state.elementTypeValue);
		//Object.assign(this.state.popFormTagConfig, addFormTagConfig);
	}

	/** 已插入真实 DOM 之后调用*/
	componentDidMount() { }

	/** 已移出真实 DOM 之前*/
	componentWillUnmount() { }


	//取消
	handleCancel = (e) => {
		//console.log(e);
		console.log('取消：');
		this.setState({
			modalName: ''
		});
	}

	/**元素类型下拉选择框响应事件 */
	handleElementTypeChange = (value) => {
		let elementTypeValue = value;
		let showItemArray = [];//应该展示的表单项
		showItemArray = _.cloneDeep(initShowItemArray);
		if (value == 'OPTION') {
			let myItenArray = [4, 5, 6, 7];
			for (let i = 0; i < myItenArray.length; i++) {
				showItemArray.push(myItenArray[i]);
			}
		} else if (value == 'POP') {
			let myItenArray = [6, 7, 8, 9, 10];
			for (let i = 0; i < myItenArray.length; i++) {
				showItemArray.push(myItenArray[i]);
			}
		} else if (value == 'BUTTON') {
			let myItenArray = [12];
			for (let i = 0; i < myItenArray.length; i++) {
				showItemArray.push(myItenArray[i]);
			}

		} else if (value == 'TEXT') {
			let myItenArray = [6, 7, 11];
			for (let i = 0; i < myItenArray.length; i++) {
				showItemArray.push(myItenArray[i]);
			}
		} else {
			if (value == 'INPUT' || value == 'DATE') {
				let myItenArray = [6, 7];
				for (let i = 0; i < myItenArray.length; i++) {
					showItemArray.push(myItenArray[i]);
				}
			} else {

			}
		}
		// 不被展示的表单项的非空校验规则删除掉
		let notNeedShowItemArray = this.setOperation(initAllItemArray, showItemArray, 'dfrcset');
		// console.log('需展示项：', showItemArray);
		// console.log('不需展示项：', notNeedShowItemArray);
		//初始化表单项
		this.state.popFormTagConfig = _.cloneDeep(addFormTagConfig);
		//重组表单配置项
		for (let k = 0; k < showItemArray.length; k++) {
			let v = (showItemArray[k] - 1);//数组是从0开始的
			//console.log("获取到元素类型下拉框的值3：", (this.state.popFormTagConfig.fields)[v]);	
			(this.state.popFormTagConfig.fields)[v].needExpend = false;//将对应的项展示出来
		}

		for (let k = 0; k < notNeedShowItemArray.length; k++) {
			let v = (notNeedShowItemArray[k] - 1);//数组是从0开始的
			//console.log("获取到元素类型下拉框的值3：", (this.state.popFormTagConfig.fields)[v]);	
			if ((this.state.popFormTagConfig.fields)[v].rules != null) {
				delete (this.state.popFormTagConfig.fields)[v].rules;//将不展示部分的检空逻辑除去
			}
		}

		/**注意，setState此方法不会立即在同方法的后续取值生效 */
		this.setState({
			elementTypeValue
		})
		const form = this.formRef.props.form;//获取提交表单的Dom对象
		form.resetFields();//清空表单内所有输入框的值变为初值
		//form.setFieldsValue();
		//form.setFieldsInitialValue({'ButtonFunc':'ok'});
		//console.log("表单对象是：" , form);
	}

	/**按钮事件下拉选择框事件 */
	handleButtonFuncChange = (value) => {
		// console.log("获取到按钮响应下拉框的值1：" + this.state.elementTypeValue);
		// console.log("获取到按钮响应下拉框的值2：", value);
		let buttonFuncValue = value;
		let showItemArray = [];//应该展示的表单项
		showItemArray = _.cloneDeep(initShowItemArray);
		if (value == 'closePage') {
			let myItenArray = [12];
			for (let i = 0; i < myItenArray.length; i++) {
				showItemArray.push(myItenArray[i]);
			}
		} else if (value == 'popPage') {
			let myItenArray = [8, 9, 10, 12];
			for (let i = 0; i < myItenArray.length; i++) {
				showItemArray.push(myItenArray[i]);
			}
		} else {//ok
			let myItenArray = [12, 13, 14];
			for (let i = 0; i < myItenArray.length; i++) {
				showItemArray.push(myItenArray[i]);
			}
		}
		// 不被展示的表单项的非空校验规则删除掉
		let notNeedShowItemArray = this.setOperation(initAllItemArray, showItemArray, 'dfrcset');
		//初始化表单项
		this.state.popFormTagConfig = _.cloneDeep(addFormTagConfig);
		//重组表单配置项
		for (let k = 0; k < showItemArray.length; k++) {
			let v = (showItemArray[k] - 1);//数组是从0开始的
			//console.log("获取到元素类型下拉框的值3：", (this.state.popFormTagConfig.fields)[v]);	
			(this.state.popFormTagConfig.fields)[v].needExpend = false;//将对应的项展示出来
		}
		//不展示部分的rules去掉
		for (let k = 0; k < notNeedShowItemArray.length; k++) {
			let v = (notNeedShowItemArray[k] - 1);//数组是从0开始的
			//console.log("获取到元素类型下拉框的值3：", (this.state.popFormTagConfig.fields)[v]);	
			if ((this.state.popFormTagConfig.fields)[v].rules != null) {
				delete (this.state.popFormTagConfig.fields)[v].rules;//将不展示部分的检空逻辑除去
			}
		}
		/**注意，setState此方法不会立即在同方法的后续取值生效 */
		this.setState({
			buttonFuncValue
		})
		const form = this.formRef.props.form;//获取提交表单的Dom对象
		form.resetFields();//清空表单内所有输入框的值变为初值
		//考虑到第一个下拉框已经选择了一个值,要设置进去
		form.setFieldsValue({ 'elementType': this.state.elementTypeValue });
	}




	/**编辑元素时反显页面所需 */
	// handleEditReviewForm = (selectdRowData) => {
	// 	let rowData = selectdRowData;//选中行数据
	// 	console.log('选中行数据：', selectdRowData[0]);	
	// }

	/**编辑元素时反显页面所需 */
	handleEditReviewForm = (selectdRowData) => {
		let rowData = selectdRowData[0];//选中行数据
		this.state.selectedRows.push(rowData);//存入state域
		console.log('选中行数据：', rowData);
		let elementTypeValue = rowData.elementType;
		let buttonFuncValue = rowData.buttonFunc ? rowData.buttonFunc : '';
		let showItemArray = [];//应该展示的表单项
		showItemArray = _.cloneDeep(initShowItemArray);

		//获取需要展示的项
		if (elementTypeValue == 'BUTTON') {
			if (buttonFuncValue == 'closePage') {
				let myItenArray = [12];
				for (let i = 0; i < myItenArray.length; i++) {
					showItemArray.push(myItenArray[i]);
				}
			} else if (buttonFuncValue == 'popPage') {
				let myItenArray = [8, 9, 10, 12];
				for (let i = 0; i < myItenArray.length; i++) {
					showItemArray.push(myItenArray[i]);
				}
			} else {//ok
				let myItenArray = [12, 13, 14];
				for (let i = 0; i < myItenArray.length; i++) {
					showItemArray.push(myItenArray[i]);
				}
			}
		} else {
			if (elementTypeValue == 'OPTION') {
				let myItenArray = [4, 5, 6, 7];
				for (let i = 0; i < myItenArray.length; i++) {
					showItemArray.push(myItenArray[i]);
				}
			} else if (elementTypeValue == 'POP') {
				let myItenArray = [6, 7, 8, 9, 10];
				for (let i = 0; i < myItenArray.length; i++) {
					showItemArray.push(myItenArray[i]);
				}
			} else if (elementTypeValue == 'TEXT') {
				let myItenArray = [6, 7, 11];
				for (let i = 0; i < myItenArray.length; i++) {
					showItemArray.push(myItenArray[i]);
				}
			} else {
				if (elementTypeValue == 'INPUT' || elementTypeValue == 'DATE') {
					let myItenArray = [6, 7];
					for (let i = 0; i < myItenArray.length; i++) {
						showItemArray.push(myItenArray[i]);
					}
				} else {

				}
			}
		}

		// 不被展示的表单项的非空校验规则删除掉
		let notNeedShowItemArray = this.setOperation(initAllItemArray, showItemArray, 'dfrcset');
		//初始化表单项
		this.state.popFormTagConfig = _.cloneDeep(addFormTagConfig);
		//重组表单配置项
		for (let k = 0; k < showItemArray.length; k++) {
			let v = (showItemArray[k] - 1);//数组是从0开始的
			//console.log("获取到元素类型下拉框的值3：", (this.state.popFormTagConfig.fields)[v]);	
			(this.state.popFormTagConfig.fields)[v].needExpend = false;//将对应的项展示出来
			//设置要展示的表单项的默认值
			let rowKey = (this.state.popFormTagConfig.fields)[v].key;
			let itemDefaultValue = rowData[rowKey];
			(this.state.popFormTagConfig.fields)[v].props.defaultValue = itemDefaultValue;
		}
		//不展示部分的rules去掉
		for (let k = 0; k < notNeedShowItemArray.length; k++) {
			let v = (notNeedShowItemArray[k] - 1);//数组是从0开始的
			//console.log("获取到元素类型下拉框的值3：", (this.state.popFormTagConfig.fields)[v]);	
			if ((this.state.popFormTagConfig.fields)[v].rules != null) {
				delete (this.state.popFormTagConfig.fields)[v].rules;//将不展示部分的检空逻辑除去
			}
		}

		//设置三个不可读的属性
		(this.state.popFormTagConfig.fields)[0].props.disabled = true;
		(this.state.popFormTagConfig.fields)[1].props.disabled = true;
		(this.state.popFormTagConfig.fields)[11].props.disabled = true;

		return this.state.popFormTagConfig;
	}

	/**页面初始化数据查询请求 */
	loadData = (current, pageSize, pagination) => {

		/**打印默认参数，看看是什么信息 */
		// console.log("执行此处current", current);
		// console.log("执行此处pageSize", pageSize);
		// console.log("执行此处pagination", pagination);

		//将查询请求的参数获取到
		const { formValues } = this.state;//获取查询表单值
		let param = Object.assign({}, formValues);
		param.page = current;//当前页
		param.pageSize = pagination.pageSize;//页面展示条数，分页值
		param.systemCode = session.currentTendant.tenantCode;//系统代码,ITS
		return http.post(
			'/call/call.do', //请求交易码（控制器拦截路径），此处是个总控
			/** 请求参数部分*/
			{
				bean: 'FormManagerServ',//服务端被调用bean
				method: 'qryPageElement',//被调用bean中被调用的方法名
				param: param//请求参数（一般就是查询条件）
			},
			{
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'//post请求文本格式
			}
		).then(//then表示在异步请求有结果之后再执行
			//post成功回调函数，res=>等价于function(res){}
			res => {
				/**成功处理 */
				const returnData = JSON.parse(res);
				if (returnData) {
					//console.log("执行此处0000", returnData);
					const firstRowId = (returnData.rows[0]).id;
					return {
						data: {
							rows: returnData.rows,
							pagination: {
								//...pagination内容putAll进外面的pagination
								...pagination,
								total: returnData.total,
								current,
								pageSize
							}
						}, selectedRowKeys: [firstRowId]
					}
				} else {
					/**若返回报文为空，则表格没数据 */
					return { data: { rows: [], pagination }, selectedRowKeys: [] }
				}
			},
			/**异步请求失败回调函数 */
			res => res//直接返回失败报文
		);
	}

	/**查询请求函数,实际上是重新调用loadData方法*/
	handleSearch = (err, values) => {
		if (err) return;
		/**去除查询条件两边的空字符串 */
		for (let k in values) {
			values[k] = this.trim(values[k]);
		}
		/**重绘,但要注意的是，重绘是发生在这个方法执行完成之后的事，刷新页面在次调用查询 */
		const formValues = {};
		Object.assign(formValues, values);
		this.setState({
			formValues
		});
		//如果表格Dom对象找的到，依据查询数据重绘
		if (this.refs.pageElementTable) {
			this.refs.pageElementTable.tryReloadDatatoPage(1);
		}
	}

	/**展示模态对话框的函数，主要是利用了this.setStatus({})赋值页面重绘的特性 */
	showModals = (e) => {
		//获取此次操作
		let modalName = e.target.getAttribute('operation') || '';
		//console.log("执行此处0005", modalName);
		//初始化表单项
		this.state.popFormTagConfig = _.cloneDeep(addFormTagConfig);
		this.setState({
			modalName
		})
		//console.log("执行此处0006",this.state.modalName);
	}


	/**表格重绘后会触发render()函数，并调用renderModal方法*/
	renderModal = () => {
		//console.log("执行此处0007",this.state.modalName);
		if (this.state.modalName == '') {
			return null;
		}
		//增加页面元素
		if (this.state.modalName == 'addPageElement') {
			//console.log("执行此处0008",this.state.modalName);
			return (<Modal
				title={'增加页面元素'}
				visible={!this.state.modalName == ''}
				onCancel={this.handleCancel}
				//onOK={this.handleCancel}
				// okText="确定"
				// cancelText="取消"
				footer={[
					<Button type="primary" loading={this.state.loading} onClick={this.addPageElementFun}>确定</Button>,
					<Button onClick={this.handleCancel}>取消</Button>,
				]}
			>
				<DynamicSearchForm
					wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
					style={{ width: '100%' }}
					formConfig={this.state.popFormTagConfig}
					hideFooter={true}
				/>
			</Modal>);
		}
		//修改页面元素
		if (this.state.modalName == 'editPageElement') {
			//获取当前选中行数据
			if (this.refs.pageElementTable) {
				const rows = this.refs.pageElementTable.getSelectedRecords();
				//先整理好配置信息
				this.handleEditReviewForm(rows);
			}

			//console.log("执行此处0008",this.state.modalName);
			return (<Modal
				title={'修改页面元素'}
				visible={!this.state.modalName == ''}
				onCancel={this.handleCancel}
				//onOK={this.handleCancel}
				// okText="确定"
				// cancelText="取消"
				footer={[
					<Button type="primary" loading={this.state.loading} onClick={this.editPageElementFun}>确定</Button>,
					<Button onClick={this.handleCancel}>取消</Button>,
				]}
			>
				<DynamicSearchForm
					wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
					style={{ width: '100%' }}
					formConfig={this.state.popFormTagConfig}
					hideFooter={true}
				/>
			</Modal>);
		}
		//删除页面元素
		if (this.state.modalName == 'deletePageElement') {
			return (
				<Modal
					title={'删除选中页面元素'}
					visible={!this.state.modalName == ''}
					onCancel={this.handleCancel}
					//onOK={this.handleOk}
					footer={[
						<Button type="primary" icon="delete" loading={this.state.loading} onClick={this.delPageElementFun}>删除</Button>,
						<Button onClick={this.handleCancel}>取消</Button>,
					]}
				>
					<div style={{ 'textAlign': 'center' }}>
						<div span={24}>
							<Icon type="question-circle-o" /><span> 确定删除该页面元素吗？</span>
						</div>
					</div>
				</Modal>
			);
		}
		return null;
	}


	/**增加页面元素方法 */
	addPageElementFun = () => {
		//console.log("执行此处增加页面元素方法", this.state.modalName);
		var myFormValus = {};//表单数据项
		//直接获取新增表单的内容
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;
			/**去除查询条件两边的空字符串 */
			for (let k in values) {
				values[k] = this.trim(values[k]);
			}
			myFormValus = values;
			if (myFormValus.elementType != 'BUTTON') {
				myFormValus.buttonFunc = '';
			}

			// console.log('取值完毕！', myFormValus);
			// console.log('发起与后台交互请求', myFormValus);
			//发起与后台交互请求
			let params = {};
			params.elementCode = myFormValus.elementCode;//元素代码
			params.systemCode = session.currentTendant.tenantCode;//系统代码,ITS
			//查询新增的元素code是否已经存在
			http.post('/call/call.do', {
				bean: 'FormManagerServ',
				method: 'isPageElementExist',
				param: params
			}, {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}).then(
					res => {
						const returnData = JSON.parse(res);
						if (returnData != '0') {
							Modal.warn({ title: '提示', content: "新增元素编码已存在，请更换！" });
						} else {
							//调用新增接口
							let params1 = myFormValus;//将表单内容全部复赋值给
							params1.tenantId = session.currentTendant.tenantCode;//系统代码,ITS
							http.post('/call/call.do', {
								bean: 'FormManagerServ',
								method: 'addPageElement',
								param: params1
							}, {
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								}).then(
									res => {
										const returnData = JSON.parse(res);
										if (returnData.isSuccess) {
											Modal.success({ title: '提示', content: "新增元素成功！" });
											this.setState({
												modalName: ''
											})
										} else {
											//调用新增接口
											Modal.error({ title: '提示', content: "新增元素失败！" });
											this.setState({
												modalName: ''
											})
										}
									},
									res => {
										Modal.error({ title: '提示', content: "新增元素出现异常！" });
									});
						}
					},
					res => {
						Modal.error({ title: '提示', content: "新增元素出现异常！" });
					});
		});

	}

	/**修改页面元素方法 */
	editPageElementFun = () => {
		var myFormValus = {};//表单数据项
		//直接获取新增表单的内容
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;
			/**去除查询条件两边的空字符串 */
			for (let k in values) {
				values[k] = this.trim(values[k]);
			}
			myFormValus = values;
			if (myFormValus.elementType != 'BUTTON') {
				myFormValus.buttonFunc = '';
			}
			let params = myFormValus;//将表单内容全部复赋值给
			params.id = this.state.selectedRows[0].id;//系统代码,ITS
			params.systemCode = session.currentTendant.tenantCode;//系统代码,ITS
			http.post('/call/call.do', {
				bean: 'FormManagerServ',
				method: 'modPageElement',
				param: params
			}, {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}).then(
					res => {
						const returnData = JSON.parse(res);
						if (returnData.isSuccess) {
							Modal.success({ title: '提示', content: "新增元素成功！" });
							this.setState({
								modalName: ''
							})
						} else {
							//调用更新接口
							Modal.error({ title: '提示', content: "新增元素失败！" });
							this.setState({
								modalName: ''
							})
						}
						this.handleSearch();//重新请求页面
					},
					res => {
						Modal.error({ title: '提示', content: "更改元素信息出现异常！" });
					});
		});

	}
	/**删除页面元素方法 */
	delPageElementFun = () => {
		//console.log("执行此处删除页面元素方法", modalName);
		this.state.isloading = true;
		//获取选中的行数据
		const selectedRows = this.refs.pageElementTable.getSelectedRecords();
		let rowData = selectedRows[0];
		let params = {};//将表单内容全部复赋值给
		params.id = rowData.id;//id
		params.elementCode = rowData.elementCode;//elementCode
		params.systemCode = session.currentTendant.tenantCode;//系统代码,ITS
		http.post('/call/call.do', {
			bean: 'FormManagerServ',
			method: 'delPageElement',
			param: params
		}, {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}).then(
				res => {
					const returnData = JSON.parse(res);
					this.state.isloading = false;
					if (returnData.isSuccess) {
						Modal.success({ title: '提示', content: "删除页面元素成功！" });
						this.setState({
							modalName: ''
						})
					} else {
						let tips = '删除失败！原因：' + returnData.templateName;
						//调用更新接口
						Modal.error({ title: '提示', content: tips });
						this.setState({
							modalName: ''
						})
					}
					this.handleSearch();//重新请求页面
				},
				res => {
					Modal.error({ title: '异常原因', content: "删除页面元素信息出现异常！" });
				});
	}





	render() {
		//console.log("执行此处0004", this.state.index);
		console.log("调用此处0000b");
		let userNameError = false;
		let passwordError = false;
		return (
			/**引入标准表格组件（标签），理解为写table标签的html */
			<div style={{ 'padding': '10px' }}>
				<div style={{ 'paddingBottom': '10px', 'paddingTop': '10px' }}>
					{/* 异步表单 */}
					<DynamicSearchForm ref='pageElementSearchForm'
						style={{ width: '100%' }}
						formConfig={searchFormTagConfig}
						hideFooter={true}
						onSubmit={this.handleSearch}
					/>
				</div>

				{/* 按钮栏*/}
				<div className="toolBar" style={{ 'paddingBottom': '10px', 'paddingTop': '10px' }}>
					<Button icon="plus-circle" title="增加元素" operation="addPageElement" onClick={this.showModals} />
					<Button icon="edit" title="修改元素" operation="editPageElement" onClick={this.showModals} />
					<Button icon="delete" title="删除元素" operation="deletePageElement" onClick={this.showModals} />
				</div>
				{/* 表格栏 */}
				<div>
					<StandardTable
						ref='pageElementTable'
						rowKey={'id'}//表格行数据的id(可以理解为数据库表的PK)
						columns={tableColumnsTitle} //表格标题项，dataIndex的值为后台返回数据的Key,表格会从返回报文填充进去
						data={intiTableDefaultParam} //页面初始化参数
						clicktoSelect={true}//是否点中“行”就选择
						rowSelection={{ 'type': 'single' }}//单行
						loadData={this.loadData}//展示（绘制）表格的数据来源，this.loadData异步请求方法（查询实现请求，类似于ajax）
						scroll={{ x: true, y: (document.querySelector('body').clientHeight - 300) }} />
				</div>
				{
					//实际上只有重绘会调用
					this.renderModal()
				}

			</div>
		);
	}

}

export default PageElementManager;