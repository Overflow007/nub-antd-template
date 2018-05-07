import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import { Select } from 'antd';
import utils from 'common/utils';
import session from 'models/Session';
import { Layout, Menu, Icon, Card, Tree, Table, Button, message, Modal } from 'antd';
import StandardTable from 'components/StandardTable';
import { workTimeCols } from './StaticConfigs';
import WorkTimeModal from './WorkTimeModal';
import moment from 'moment';
import { extractPath } from 'common/path';
import styles from './WorkTimeManager.scss';

const { Sider, Content, Header, Footer } = Layout;
const { TreeNode } = Tree;

const PREFIX = 'flow-worktimemgr';

const cx = utils.classnames(PREFIX,styles);

/**
 * 工作时间管理
 */
@observer
class WorkTimeManager extends Component {

    state = {
		loading: false,
		renderAreaTree: [],
		mainGridResult: { total: 0, rows: [] },
		pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: 1,
            pageSize: 10,
            total: 0
        },
		sorter: {},
		modal: {},
		selectedRows: [],
        selectedRowKeys: [],

	}

	/**
     * 组件渲染完成调用
    */
    componentDidMount() {
		this.fetchAreaTree();
    }

	/**
	 * 组件渲染前调用
	 */
	componentWillUnmount() {
	}
	 
	/**
	 * 查询环节目录树
	 */
	fetchAreaTree = () => {
		http.post('/call/call.do', {
			bean: 'AreaServ',
			method: 'getAreaJsonTree',
			param: { areaId: 1 }
		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData) {
				this.setState({
					renderAreaTree: returnData
				});
			}
			this.rerenderMainGridData();
		}, res => {
			message.error('获取区域目录失败！');
			this.setState({
				loading: false,
				renderAreaTree: []
			});
			this.rerenderMainGridData();
		});
	}

	renderAreaTree = (tree) => {
		if (tree) {
			return tree.map(t => {
				if (t.children && t.children.length > 0) {
					return (<TreeNode key={`${t.id}`} title={`${t.text}`} >
						{this.renderAreaTree(t.children)}
					</TreeNode>)
				}
				return (<TreeNode key={`${t.id}`} title={`${t.text}`} />)
			});
		}else{
			return null;
		}
	}

	rerenderMainGridData = () => {
        this.state.pagination.current = 1;
		this.postGetMainGridData(
			this.state.pagination
		);
	}
	
	postGetMainGridData = (pagination) => {
		let param = Object.assign({}, pagination);
        param.page = param.current;
		param.systemCode = session.currentTendant.tenantCode;
		param.areaId = 1;

		http.post('/call/call.do', {
            bean: 'WorkTimeServ',
            method: 'qryWorkTimeByAreaId',
            param
        },
        {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            const returnData = JSON.parse(res);
            if (returnData) {
                
                /** this.setState({
                    mainGridResult: returnData,
                    pagination: this.state.pagination,
                    
				});*/
				this.setState({
                    mainGridResult: { total: 2, rows: [{id:12,workTimeName:"上海时间",workTimeRule: "1:2-3:4",effDate:"2018-1-1",expDate:"2018-2-2",comments:""},{id:13,workTimeName:"广州时间",workTimeRule: "3-4",effDate:"2018-1-1",expDate:"2018-2-2",comments:""}] },
                    pagination: this.state.pagination
                    
                });
            }

            this.setState({
                loading: false
            });
        }, res => {
            message.error('查询工作时间列表数据失败！');
            this.state.pagination.total = 0;
            this.setState({
                mainGridResult: { total: 0, rows: []},
                pagination: this.state.pagination
            });
            console.warn('failed!!', res);
        });
	}
	/**
     * 获取表格列表数据
     * @returns {*}
     */
    getGridData = () => {
        this.state.pagination.total = this.state.mainGridResult.total;
        if (this.state.pagination.total == null) {
            this.state.pagination.total = 0;
        }
        const ret = _.merge({}, this.state.mainGridResult);
        ret.pagination = this.state.pagination;

        return ret;
	}
	
	/**
     * 选中表格行数据
	 * @param row
	 */
	handleRowClick = row => {
		const rows = Array.isArray(row) ? row : [row];
        this.setState({
            selectedRowKeys: [rows[0].id],
            selectedRows: rows
		});
		console.log(this.state);
    }

	/**
     * 显示弹出框
	 * @param e
	 */
	showModal = (e) => {
        const { modal } = this.state;
        modal.visible = true;
        modal.type = e.target.getAttribute('operation') || '';
		this.setState({ modal });
	}
	/**
     * 关闭弹出框
	 */
	hideModal = () => {
		const modal = this.state.modal;
		modal.visible = false;
		this.setState({ modal });
	};

	renderModal=()=>{

		console.log(this.state);
		return (
			this.state.modal.visible ? (<WorkTimeModal
				type={this.state.modal.type}
				visible={this.state.modal.visible}
				onCancel={this.hideModal}
				selectRowData={this.state.selectedRows[0] || null}
			/>) : null
		)
       
	}

	render() {
		
		return (
			<div >
				<Layout className={`${PREFIX}`}>
					<Sider className={`${cx('sider')}`}>
						<Card
							title="区域"
							bordered={true}
						>
						<Tree
							defaultExpandedKeys={['1']}
							
						>
							{this.renderAreaTree(this.state.renderAreaTree)}
						</Tree>
							
						</Card>
					</Sider>
					<Content className={`${cx('content')}`}>
						<Card
							bordered
							title="工作时间列表"
						>
							<div className="toolBar">
								<Button.Group>
									<Button icon="plus" operation="addWorkTime" onClick={this.showModal}>新增</Button>
									<Button icon="edit" operation="editWorkTime" onClick={this.showModal}>修改</Button>
									<Button icon="delete" operation="deleteWorkTime" onClick={this.showModal}>删除</Button>
								</Button.Group>
							</div>

							<StandardTable 
								style={{ background: '#FFFFFF' }} 
								columns={workTimeCols} 
								bordered={true}
								rowKey="id"
								rowSelection={{ type: 'single' }}
								clicktoSelect={true}
								scroll={{ y: (document.querySelector('body').clientHeight - 314) }} 
								data={this.getGridData()} 
								onRowClick={this.handleRowClick}
								/>
						</Card>
						{
							this.renderModal()
						}
					</Content>
					
				</Layout>
			</div>
            
		);
	}

}

export default WorkTimeManager;