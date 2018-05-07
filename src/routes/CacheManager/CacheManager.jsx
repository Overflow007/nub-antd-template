import React, { Component } from 'react';
import { Select, Table, Modal, Button, Popover, Icon, message } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { extractPath } from 'common/path';
import moment from 'moment';
import styles from './CacheManager.scss';
import StandardTable from 'components/StandardTable';
import NonModalDialog from 'components/NonModalDialog';


const PREFIX = 'flow-cachemgr';
const cx = utils.classnames(PREFIX, styles);

/**
 * 缓存管理（有许多无用的注释，仅此一页，做学习交流之用，其他页面不会有这么多注释的）
 */
@observer
class CacheManager extends Component {

	//将表格配置参数定义在全局state域中，兼初始化state的作用
	state = {
		selectedKeys: [],//被选择行所记录的行索引号记录数组
		selectedRows: [],//被选择行所记录的行记录数组，数组的每个对象按顺序代表选中的行数据
		formValues: { "state": "1" },//查询参数对象，因为一般的查询条件放在查询表单中，所以此处是命名formValue
		/**分页导航信息栏信息，具体配置可见“http://ant.design/components/pagination/” */
		pagination: {
			/**对象的Key加不加""都是一样的，加了更严格，加比较好*/
			"showSizeChanger": true,//是否支持变更页面展示条数
			"showQuickJumper": true,//是否支持快速跳页
			"current": 1,//当前所在页数
			"pageSize": 10,//默认页面展示行数
			"total": 0 //是否当页完全展示所有项，0-否；1-是
			//"pageSizeOptions": [10, 25, 50, 75, 100],//与showSizeChanger一起，可选择每页展示数量
			// "size": "small",//表格底部分页导航栏大小，默认是""
			// "hideOnSinglePage": true,//在单页是否隐藏寻呼机
			// "itemRender": (
			// 	(page, type, originalElement) => {
			// 		console.log("值page：", page);
			// 		console.log("值type：", type);
			// 		console.log("值originalElement：", originalElement);
			// 		return (<p>Hollow World!</p>);
			// 	}
			// ),//自定义项innerHTML
			// "showTotal": ((total, range) => {
			// 	console.log("值total：", total);
			// 	console.log("值range：", range);
			// }
			// ),//是否展示表格记录总数和分页数量
			// "onChange": ((current, pageSize, pagination) => { }),//一个回调函数,页码发生变化时执行,以产生的页码和页大小为参数
			// "onShowSizeChange": ((current, size) => { console.log("页面展示数量发生改变") })//当页大小改变执行
		},
		sorter: {},//排序字段
		filtersArg: {},//过滤参数,排序和过滤参考“http://design.alipay.com/develop/web/components/table/”
		modalName: '',//用以弹出模态框，当此值发生改变时，会重绘页面对象，充分利用this.setStatus({})进行操作
		chooesValue: '',//刷新类型选择下拉框
		isloading: false, //是否正在加载中
	}

	/**构造器 */
	constructor(props) {
		super(props);
	}

	/** 已插入真实 DOM 之后调用*/
	componentDidMount() { }

	/** 已移出真实 DOM 之前*/
	componentWillUnmount() { }

	/**提示框弹出控制部分 */
	//取消
	handleOk = (e) => {
		//console.log(e);
		this.setState({
			modalName: ''
		});
	}
	//OK
	handleCancel = (e) => {
		//console.log(e);
		this.setState({
			modalName: ''
		});
	}

	/**下拉选择框响应事件 */
	handleChange = (value) => {
		//不调用setState是不想引起重绘
		this.state.chooesValue = value;
	}

	/**
	 * 刷新对话框选中下拉框的值
	 */

	/**展示模态对话框的函数，主要是利用了this.setStatus({})赋值页面重绘的特性 */
	showModals = (modalName) => {
		/**先判断是否选中了记录 */
		if (this.state.selectedKeys.length == 0) {//未选中记录
			console.log("执行到此处0000：", this.state.selectedKeys.length);
			/**未选中记录。提示错误 */
			message.warn("请至少选择一台服务器刷新缓存！");
		} else {//选中记录
			this.setState({
				modalName
			})
		}
	}

	/**表格重绘后会触发render()函数，并调用renderModal方法*/
	renderModal = () => {
		if (this.state.modalName) {
			console.log("执行到此处选择数组：", this.state.selectedKeys.length);
		}

		if (this.state.modalName == 'refreshModle') {

			/**非模态框方式 */
			// return (
			// 	<NonModalDialog
			// 		title={'刷新缓存配置'}
			// 		visible={!this.state.modalName == ''}
			// 		onCancel={
			// 			//取消函数,利用了setState的重绘机制
			// 			() => {
			// 				this.setState({
			// 					modalName: ''
			// 				});
			// 			}}>
			// 		<div>
			// 			<Select defaultValue="all" style={{ width: 120 }} onChange={this.handleChange}>
			// 				<Option value="all">全部</Option>
			// 				<Option value="refreshProcessDefineCache">流程模板缓存</Option>
			// 				<Option value="refreshTacheDefCache">环节缓存</Option>
			// 				<Option value="refreshReturnReasonConfigCache">退单原因缓存</Option>
			// 				<Option value="refreshProcessParamDefCache">流程参数定义缓存</Option>
			// 			</Select>
			// 		</div>

			// 		<div>
			// 			<Button.Group style={{ 'text-align': 'center' }} >
			// 				<Button onClick={() => {
			// 					//相当于隐藏了模态框
			// 					this.reFreshCache();
			// 				}}>刷新</Button>
			// 				<Button onClick={() => {
			// 					//相当于隐藏了模态框
			// 					this.setState({
			// 						modalName: ''
			// 					})
			// 				}}>取消</Button>
			// 			</Button.Group>
			// 		</div>
			// 	</NonModalDialog>
			// );

			/**模态框方式 */
			return (
				<Modal
					title={'刷新缓存配置'}
					visible={!this.state.modalName == ''}
					onCancel={this.handleCancel}
					onOK={this.handleOk}
					footer={[
						<Button type="primary" icon="reload" loading={this.state.loading} onClick={this.reFreshCache}>刷新</Button>,
						<Button onClick={this.handleCancel}>取消</Button>,
					]}
				//style={{'text-align': 'center' }}
				>
					<div style={{ 'textAlign': 'center' }}>
						<Select defaultValue="all" style={{ width: '30%' }} onChange={this.handleChange}>
							<Option value="all">全部</Option>
							<Option value="refreshProcessDefineCache">流程模板缓存</Option>
							<Option value="refreshTacheDefCache">环节缓存</Option>
							<Option value="refreshReturnReasonConfigCache">退单原因缓存</Option>
							<Option value="refreshProcessParamDefCache">流程参数定义缓存</Option>
						</Select>
					</div>

					{/**
					//原本和非模态框配合使用
					<div>
						<Button.Group style={{ 'text-align': 'center' }} >
							<Button onClick={() => {
								//相当于隐藏了模态框
								this.reFreshCache();
							}}>刷新</Button>
							<Button onClick={() => {
								//相当于隐藏了模态框
								this.setState({
									modalName: ''
								})
							}}>取消</Button>
						</Button.Group>
					</div> */}
				</Modal>
			);
		}
		return null;
	}

	/**
	 * 处理表格行选中事件，将选中的行标记rowKeys存在state域中，并触发表格重绘 
	 * @param keys 被选中的行的所有行索号数组，即rowKeys,[id0,...,idn]数组
	 * @param rows 被选中的行的所有对象数组，即[{rowdata0},....,{rowdatan}]
	*/
	handleSelectOnChange = (keys, rows) => {
		this.setState({
			selectedKeys: keys,
			selectedRows: rows
		});
	};


	/**页面初始化数据查询请求 */
	loadData = (current, pageSize, pagination) => {

		/**打印默认参数，看看是什么信息 */
		// console.log("执行此处current", current);
		// console.log("执行此处pageSize", pageSize);
		// console.log("执行此处pagination", pagination);

		//将查询请求的参数获取到
		const { formValues } = this.state;//解构赋值（ES6语法），查询请求参数对象
		//将forValues的内容复制到{}并表示成param做查询条件
		let param = Object.assign({}, formValues);
		//param = _.merge(param, pagination);
		param.pageSize = pagination.pageSize;//页面展示条数，分页值
		//param.pageIndex = current;//当前页
		//param.sortColumn = 'id';//排序字段，与数据库字段一致
		//param.sortOrder = 'desc';//排序字段方式
		//param.systemCode = session.currentTendant.tenantCode;//系统代码
		//【说明】--------类似于adjx对服务端的异步请求，以下是格式说明--------【说明】
		// http.post(
		// 	txcode,//请求交易码（控制器拦截路径）
		// 	data = { bean: '服务端被调用bean', method: '被调用bean中被调用的方法名', param: '对象请求参数' },
		// 	configparam = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }//post请求文本格式
		// )
		// 	.then(//then表示在异步请求有结果之后再执行
		// 		successCallbackFunction(res),//异步请求成功回调函数
		// 		errCallbackFunction(res)//异步请求失败回调函数
		// 	)
		return http.post(
			'/call/call.do', //请求交易码（控制器拦截路径），此处是个总控
			/** 请求参数部分*/
			{
				bean: 'CacheManagerServ',//服务端被调用bean
				method: 'qryServerList',//被调用bean中被调用的方法名
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

					///console.log(returnData);//控制台打印返回报文
					return {
						data: {
							rows: returnData,
							pagination: {
								//三点表达式表示把...pagination内容putAll进外面的pagination，可查看ES6的解构赋值内容
								...pagination
							}
						}, selectedRowKeys: []
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

	/**刷新缓存请求参数 */
	reFreshCache = () => {
		console.log("刷新缓存");
		//首先要确保isloading=true,不用setState是防止页面重绘
		this.state.isloading = true;

		let serverAddrsArray = [];
		for (let map of this.state.selectedRows) {
			serverAddrsArray.push(map.serverAddress);
		}
		let param = {};
		param.cacheType = this.state.chooesValue;
		param.serverAddrs = serverAddrsArray;
		//param.systemCode = session.currentTendant.tenantCode;//系统代码
		//【说明】--------类似于adjx对服务端的异步请求，以下是格式说明--------【说明】
		// http.post(
		// 	txcode,//请求交易码（控制器拦截路径）
		// 	data = { bean: '服务端被调用bean', method: '被调用bean中被调用的方法名', param: '对象请求参数' },
		// 	configparam = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }//post请求文本格式
		// )
		// 	.then(//then表示在异步请求有结果之后再执行
		// 		successCallbackFunction(res),//异步请求成功回调函数
		// 		errCallbackFunction(res)//异步请求失败回调函数
		// 	)
		return http.post(
			'/call/call.do', //请求交易码（控制器拦截路径），此处是个总控
			/** 请求参数部分*/
			{
				bean: 'CacheManagerServ',//服务端被调用bean
				method: 'refreshCache',//被调用bean中被调用的方法名
				param: param//请求参数（一般就是查询条件）
			},
			{
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'//post请求文本格式
			}
		).then(//then表示在异步请求有结果之后再执行
			//post成功回调函数，res=>等价于function(res){}
			res => {
				/**成功处理 */
				//解除加载,不用setState是防止页面重绘
				this.state.isloading = false;
				if (res == '"fail"') {
					message.error('刷新失败');
				} else {
					message.success('刷新成功');
				}
			},
			/**异步请求失败回调函数 */
			res => {
				//直接返回失败报文
				message.error('刷新失败');
			}
		);
	}

	/**初始化查询数据方法loadData返回promise对象中的回调函数示例*/
	/**异步获取的加载数据存放变量*/
	// let LoadData = {
	// 	data: {
	// 		rows: returnData.rows,
	// 		/**分页信息对象，同上*/
	// 		pagination: {
	// 			pageSize: 10,
	// 			current: 1,
	// 			total: 0,
	// 			showQuickJumper: true,
	// 			onChange: ((current, pageSize, pagination) => {
	// 			})
	// 		}
	// 	}, selectedRowKeys: []
	// };


	/**返回报文数据格式（F12请求response截取） */
	// var backdata = [ {
	// 	"id" : 1,
	// 	"serverName" : "serverj",
	// 	"serverAddress" : "127.0.0.1:8088",
	// 	"state" : "1",
	// 	"comments" : ""
	// }, {
	// 	"id" : 2,
	// 	"serverName" : "servert",
	// 	"serverAddress" : "127.0.0.1:8080",
	// 	"state" : "1",
	// 	"comments" : ""
	// } ];

	render() {//页面调用时会调用此方法将html(包括组件的Html)添加到Dom节点中（通俗的话就是绘制）
		/**状态位转义数组 */
		const cacheStatusArray =
			[{
				value: '0',
				text: '失效'
			}, {
				value: '1',
				text: '有效'
			}];
		/**状态位转义方法 */
		const convertStatsToDes = (arr, val) => {
			const found = _.find(arr, x => x.value == val);
			return found ? found.text : '';
		};

		/**表格标题部分 */
		const tableColumnsTitle = [
			{ title: '服务器标识', dataIndex: 'id', width: 120, sortable: true },
			{ title: '服务器名称', dataIndex: 'serverName', width: 120 },
			{ title: '服务器地址', dataIndex: 'serverAddress', width: 120 },
			//{ title: '服务器状态', dataIndex: 'state', width: 120 },
			{
				title: '服务器状态', dataIndex: 'state', width: 100,
				render(val) {
					return convertStatsToDes(cacheStatusArray, val);
				}
			},
			{ title: '备注', dataIndex: 'comments', width: 150 }
		];

		/**表格查询条件表单栏html部分（仅做展示，本例不实际使用） */
		// let queryFormDiv = <div key={'search'} style={{ width: '800px', margin: '-17.5px 10px -17.5px 0px', position: 'relative', height: '100%', display: 'inline-block' }}>
		// 	//使用了组件
		// 	<DynamicSearchForm ref='instanceSearchForm'
		// 		style={{ position: 'absolute', width: '800px', top: '-15px' }}//样式
		// 		formConfig={formConfig}//查询输入框的相关配置，建议另起一个文件存放
		// 		hideFooter={true}//是否隐藏下分割线
		// 		onSubmit={this.handleSearch}//查询提交触发执行方法，与laodData异曲同工
		// 	/>
		// </div>;

		/**页面初始化查询请求参数（只执行一次）*/
		const intiTableDefaultParam = {
			rows: [],//表格行数据，没查询条件前肯定是没有数数据的
			/**表格底部的分页信息栏配置对象 */
			//pagination:this.state.pagination//不建议写成这样，因为this.state.pagination这个值是会变更的
			pagination: {
				"showSizeChanger": true,//是否支持变更页面展示条数
				"showQuickJumper": true,//是否支持快速跳页
				"current": 1,//当前所在页数
				"pageSize": 10,//默认页面展示行数
				"total": 0 //是否当页完全展示所有项，0-否；1-是
				/**表格右下角箭头点击事件声明*/
				//"pageSizeOptions": [10, 25, 50, 75, 100],//与showSizeChanger一起，可选择每页展示数量
				// "size": "small",//表格底部分页导航栏大小，默认是""
				// "hideOnSinglePage": false,//在单页是否隐藏表格下方的分页导航栏
				// "itemRender": (
				// 	(page, type, originalElement) => {
				// 		console.log("值page：", page);
				// 		console.log("值type：", type);
				// 		console.log("值originalElement：", originalElement);
				// 		if (type == 'prev') {
				// 			return (<p>上一页</p>);
				// 		}
				// 		if (type == 'next') {
				// 			return (<p>下一页</p>);
				// 		}
				// 		if (type == 'page') {
				// 			return (<p>{page}</p>);
				// 		}
				// 	}
				// ),//自定义项innerHTML
				// "showTotal": ((total, range) => {
				// 	console.log("值total：", total);
				// 	console.log("值range：", range);
				// }
				// ),//是否展示表格记录总数和分页数量
				// "onChange": ((current, pageSize, pagination) => { }),//一个回调函数,页码发生变化时执行,以产生的页码和页大小为参数
				// "onShowSizeChange": ((current, size) => { console.log("页面展示数量发生改变") })//当页大小改变执行
			}
		};
		//console.log("执行此处cx", cx);
		/**返回组件其实就是将React组件生成的html文本appand进某个指定的元素下面，这里是<div id=app></app> */
		return (
			/**引入标准表格组件（标签），理解为写table标签的html */
			<div style={{ 'padding': '15px' }}>
				{/* 按钮栏*/}
				<div style={{ 'padding': '10px' }}>
					<Button.Group>
						<Button type="primary" icon="reload" onClick={() => { this.showModals('refreshModle'); }}>刷新</Button>
					</Button.Group>
				</div>
				{/* 表格栏 */}
				<StandardTable
					rowKey={'id'}//表格行数据的id(可以理解为数据库表的PK)
					columns={tableColumnsTitle} //表格标题项，dataIndex的值为后台返回数据的Key,表格会从返回报文填充进去
					data={intiTableDefaultParam} //页面初始化参数
					loadData={this.loadData}//展示（绘制）表格的数据来源，this.loadData异步请求方法（查询实现请求，类似于ajax）
					selectType={'multi'} //设置表格单选还是多选，值可选'multi',’single’,’radio’,false，默认为单选
					allowChangeSelectType={true}//为false时不允许改单选或者多选的类型
					rowSelection={{ type: 'multi' }}
					clicktoSelect={true}//是否点中“行”就选择
					onSelectChange={this.handleSelectOnChange}//表格元素（行）被选中事件触发选中处理动作
					//extra={queryFormDiv} // 查询表单模块（仅做调用参考值）
					//x轴方向自适应；y轴方向以示窗窗口高度减去300px自适应上下滚动
					scroll={{ x: true, y: (document.querySelector('body').clientHeight - 300) }} />
				{
					//实际上只有重绘会调用
					this.renderModal()
				}

			</div>
		);
	}
}

/**组件（标签）对象（实例）无强制检验属性格式 */
CacheManager.propTypes = {};
/**组件（标签）对象（实例）无强默认属性 */
CacheManager.defaultProps = {};
/**发布组件（标签），使其他组件可引用 */
export default CacheManager;