/* eslint-disable no-tabs,no-mixed-spaces-and-tabs */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Layout, Menu, Icon, Card, Tree, Table, Button, message, Modal } from 'antd';
import utils from 'common/utils';
import http from 'common/http';
import session from 'models/Session';
import StandardTable from 'components/StandardTable';
import TacheSearchForm from './TacheSearchForm';
import TacheMgrPopModal from './TacheMgrPopModal';
import { tacheCodeCols } from './StaticConfigs';
import styles from './TacheMgr.scss';

const { Sider, Content } = Layout;
const PREFIX = 'flow-tachemgr';
const { TreeNode } = Tree;

const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

const cx = utils.classnames(PREFIX, styles);

@observer
class TacheMgr extends Component {

    state = {
        tacheCatalogTree: [],
        tacheCatalogList: [],
	    expandedKeys: [],
        loading: false,
        chosenTacheCatalogId: null,
        selectedRows: [],
        selectedRowKeys: [],
        formValues: {},
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: 1,
            pageSize: 10,
            total: 0
        },
        sorter: {},
        filtersArg: {},
        mainGridResult: { total: 0, rows: [] },
        exceptionReasons: {},
        searchTachesParams: {
            systemCode: session.currentTendant.tenantCode,
            state: '10A'
        },
        redraw:{a:1},
        modal: {

        }
    };

    /**
     * 组件渲染完成调用
    */
    componentDidMount() {
        this.fetchTacheTree();
    }

    /**
     * 组件渲染前调用
     */
    componentWillUnmount() {
    }

    /* -------------------------- 环节搜索表单 BEGIN -------------------------- */
    /* 渲染搜索表单 */
    renderSearForm = () => {
       return (
          <TacheSearchForm
              onSubmitForm={this.onSubmitForm}
              onSelectedChange={this.onSelectedChange}
              onTacheCodeInputChange={e => this.state.searchTachesParams.tacheCode = e.target.value}
              onTachaNameInputChange={e => this.state.searchTachesParams.tacheName = e.target.value}
          />
        );
    }

    /**
     * 表单回车搜索环节
     * @param value
     */
    onSubmitForm = (value) => {
        this.rerenderMainGridData();
    }

    /* 环节状态下拉菜单发生变化 */
    onSelectedChange = (value) => {
        switch (value) {
            case 'disable': this.state.searchTachesParams.state = '10P'; break;
            case 'enabled': this.state.searchTachesParams.state = '10A'; break;
            default: delete this.state.searchTachesParams.state;
        }
    }
    /* -------------------------- 环节搜索表单 END -------------------------- */

    /* -------------------------- 环节目录树 BEGIN -------------------------- */
	/**
	 * 查询环节目录树
	 */
	fetchTacheTree = () => {
		this.setState({
			loading: true
		});
		http.post('/call/call.do', {
			bean: 'TacheServ',
			method: 'qryTacheCatalogTree',
			param: { 'systemCode': session.currentTendant.tenantCode }

		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData) {
				this.setState({
					tacheCatalogTree: returnData,
					tacheCatalogList: this.getTacheCatalogList(returnData)
				});
			}

			this.setState({
				loading: false
			});
			this.rerenderMainGridData();
		}, res => {
			this.setState({
				loading: false
			});

			message.error('查询环节目录失败！');
			this.setState({
				tacheCatalogTree: [],
				tacheCatalogList: []
			});
			this.rerenderMainGridData();
		});
	}

	/* 设置tacheCataLogList */
	getTacheCatalogList = (tacheCatalogTree, parendTreeNode) => {
        let tacheCatalogList = [];
        (tacheCatalogTree || []).map((x) => {
            const { children, ...catalog } = x;
            catalog.parentCatalogId = parendTreeNode ? parendTreeNode.id : '-1';
            tacheCatalogList = [
                ...tacheCatalogList, catalog, ...this.getTacheCatalogList(children, catalog)
            ];
            return [catalog, ...this.getTacheCatalogList(children, catalog)];
        });
        return tacheCatalogList;
    }

    /**
     * 渲染环节树
     * @param tree
     * @returns {*}
     */
    renderTacheTree = (tree) => {
        if (tree == null || tree.length < 1) return null;
        return tree.map(t => {
            if (t.children && t.children.length > 0) {
                return (<TreeNode key={`${t.id}`} title={`${t.text}`} >
                    {this.renderTacheTree(t.children)}
                </TreeNode>)
            }
            return (<TreeNode key={`${t.id}`} title={`${t.text}`} />)
        });

    }

	/**
     * 选中环节目录执行事件
	 * @param selectedKeys
	 * @param e
	 */
	handleChooseTacheCatalog = (selectedKeys, e) => {
		if (selectedKeys && selectedKeys.length > 0) {
			this.setState({
				chosenTacheCatalogId: selectedKeys[0]
			}, () => {
				this.rerenderMainGridData();
			});
		}/* else {
			this.setState({
				chosenTacheCatalogId: null
			}, () => {
				this.rerenderMainGridData();
			});
		}*/
	}

	/**
     * 获取被选中的环节目录
	 * @returns {null}
	 */
	getChosenTacheCatalog = () => {
        let chosenTacheCatalogs = null;
        if (this.state.chosenTacheCatalogId) {
            chosenTacheCatalogs =
                this.state.tacheCatalogList.filter(x => x.id == this.state.chosenTacheCatalogId);
        }
        return chosenTacheCatalogs && chosenTacheCatalogs.length > 0
            ? chosenTacheCatalogs[0] : null;
    }
    /* -------------------------- 环节目录树 END -------------------------- */

    /* -------------------------- 环节列表 BEGIN -------------------------- */
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
     * 表格分页、排序、筛选变化时触发的事件
	 * @param pagination
	 * @param filtersArg
	 * @param sorter
	 */
	handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { formValues } = this.state;
        this.setState({
            pagination,
            sorter: sorter.field ? sorter : {},
            selectedRows: []
        });

        this.postGetMainGridData(formValues, pagination, {}, sorter);

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
    };

	/**
     * 重新加载表格数据
	 */
	rerenderMainGridData = () => {
        this.state.pagination.current = 1;
		this.postGetMainGridData(
			this.state.formValues,
			this.state.pagination,
			this.state.pagination,
			this.state.sorter
		);
    }

	/**
     * 查询环节列表数据，并通过state修改表格数据，从而实现表格渲染
	 * @param formValues
	 * @param pagination
	 * @param filtersArg
	 * @param sorter
	 */
    postGetMainGridData = (formValues, pagination, filtersArg, sorter) => {

        let param = Object.assign({}, formValues);
        param = _.merge(param, pagination);
        param.page = param.current;
        param = { ...param, ...this.state.searchTachesParams };
        if (this.state.chosenTacheCatalogId) param.tacheCatalogId = this.state.chosenTacheCatalogId;

        this.setState({
            loading: true,
            selectedRows: []
        });

        http.post('/call/call.do', {
            bean: 'TacheServ',
            method: 'qryTaches',
            param
        },
        {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            const returnData = JSON.parse(res);
            if (returnData) {
                const selectedRows = returnData.rows.filter(item => this.state.selectedRowKeys.indexOf(item.id) > -1);
                this.state.pagination.total = returnData.total;
                this.setState({
                    mainGridResult: returnData,
                    pagination: this.state.pagination,
                    selectedRows
                });
            }

            this.setState({
                loading: false
            });
        }, res => {
            this.setState({ loading: false });
            message.error('查询环节列表数据失败！');
            this.state.pagination.total = 0;
            this.setState({
                mainGridResult: { total: 0, rows: []},
                pagination: this.state.pagination
            });
            console.warn('failed!!', res);
        });
    }
    /* -------------------------- 环节列表 END -------------------------- */

    /* -------------------------- 弹出框 BEGIN ---------------------------- */
	/**
     * 查看异常原因
	 */
	openExcepResonModal = () => {
        this.setState({
            showNonModal: true
        });
        this.loadWorkItems();
    }

	/**
     * 弹出框确认操作
	 */
	handleModalOnOk = () => {
        const { type, area } = this.state.modal;
        this.hideModal();
		
        if (type == 'deleteCataLog') {
            this.setState({ chosenTacheCatalogId: null });
        } else if (type == 'addSubCataLog') {
			this.setState({ expandedKeys: _.union(this.state.expandedKeys, [this.state.chosenTacheCatalogId]) });
        }
        if (area == 'tree'){
            this.fetchTacheTree();
        } else {
            this.rerenderMainGridData();
        }
	};

	/**
     * 关闭弹出框
	 */
	hideModal = () => {
		const modal = this.state.modal;
		modal.visible = false;
		this.setState({ modal });
	};

	/**
     * 显示弹出框
	 * @param e
	 */
	showModal = (e) => {
        const { modal } = this.state;
        modal.visible = true;
        modal.area = e.target.getAttribute('area') || '';
        modal.type = e.target.getAttribute('operation') || '';
		this.setState({ modal });
    }
    /* -------------------------- 弹出框 END ---------------------------- */

    /**
     * 窗口 resize 触发
     * @see AsyncComponent.jsx
     */
    onResize = () => {
        // 触发组件重绘
        this.setState({ ...this.state });
    }

    render() {
        return (
            <Layout className={`${PREFIX}`}>
             
                {/* 左边环节目录 BEGIN */}
		        <Sider className={`${cx('sider')}`} >
			        <Card
				        title="目录"
				        bordered={false}
			        >
				        <div className="toolBar">
					        <Button icon="plus-circle" title="增加目录" area="tree" operation="addCataLog" onClick={this.showModal} />
					        <Button icon="edit" title="修改目录" area="tree" operation="editCataLog" onClick={this.showModal} />
					        <Button icon="delete" title="删除目录" area="tree" operation="deleteCataLog" onClick={this.showModal} />
					        <Button icon="plus-square" title="增加子目录" area="tree" operation="addSubCataLog" onClick={this.showModal} />
				        </div>
				        <Tree
					        showLine
					        defaultExpandedKeys={['1']}
					        expandedKeys={this.state.expandedKeys}
				            onExpand={(expandedKeys) => { console.log('expandedKeys', expandedKeys); this.setState({ expandedKeys });}}
					        onSelect={this.handleChooseTacheCatalog}
					        defaultSelectedKeys={[this.state.chosenTacheCatalogId]}
					        selectedKeys={[this.state.chosenTacheCatalogId]}
				            style={{ position: '' }}
				        >
					        {this.renderTacheTree(this.state.tacheCatalogTree)}
				        </Tree>
			        </Card>
		        </Sider>
                {/* 左边环节目录 END */}
                
                {/* 环节列表 BEGIN */}
		        <Content className={`${cx('content')}`}>
                    <Card
				        bordered
				        title="环节列表"
				        extra={<div>{this.renderSearForm()}</div>}
			        >
                        <div className="toolBar">
					        <Button.Group>
						        <Button icon="plus" operation="addTache" onClick={this.showModal}>新增</Button>
						        <Button icon="edit" operation="editTache" onClick={this.showModal}>修改</Button>
						        <Button icon="delete" operation="deleteTache" onClick={this.showModal}>删除</Button>
					        </Button.Group>
					        <Button type="primary" style={{ float: 'right' }} operation="showEexceptionReasonList" onClick={this.showModal}>
						        查看环节适配异常原因
					        </Button>
				        </div>

                        <StandardTable 
                            style={{ background: '#FFFFFF' }} 
                            columns={tacheCodeCols} 
                            data={this.getGridData()} 
                            bordered={true}
                            rowKey="id"
                            selectedRowKeys={this.state.selectedRowKeys}
                            loading={this.state.loading}
                            rowSelection={{ type: 'single' }}
                            clicktoSelect={true}
                            onSelectRow={this.handleSelectRows}
                            onRowClick={this.handleRowClick}
                            onChange={this.handleStandardTableChange}
                            scroll={{ y: (document.querySelector('body').clientHeight - 314) }} />
			        </Card>
                </Content>
                {/* 环节列表 END */}

                {/* 弹出框 BEGIN */}
		        {this.state.modal.visible ? (<TacheMgrPopModal
			        type={this.state.modal.type}
			        visible={this.state.modal.visible}
			        onOk={this.handleModalOnOk}
			        onCancel={this.hideModal}
			        tacheCatalogTree={this.state.tacheCatalogTree}
			        currentTacheCatalog={this.getChosenTacheCatalog()}
			        currentCatalogId={this.state.chosenTacheCatalogId}
			        selectRowData={this.state.selectedRows[0] || null}
		        />) : null}
		        {/* 弹出框 END */}
                
	        </Layout>
        );
    }
}

export default TacheMgr;