import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Form, Modal, Button, Popover, Icon, message, Tree, Card} from 'antd';
import moment from 'moment';
import { extractPath } from 'common/path';
import styles from './FlowLimitManager.scss';
import DynamicSearchForm from 'components/DynamicSearchForm';
import StandardTable from 'components/StandardTable';
import {flowLimitCols, searchFormConfig} from './StaticConfigs';
import AddFlowLimit from './popups/AddFlowLimit';
import EditFlowLimit from './popups/EditFlowLimit';
import DeleteFlowLimit from './popups/DeleteFlowLimit';
import session from 'models/Session';


const PREFIX = 'flow-flowlimitmgr';

const cx = utils.classnames(PREFIX,styles);

const { TreeNode } = Tree;

/**
 * 流程时限管理
 */
@observer
class FlowLimitManager extends Component {

    state = {
		areaCatalogTree: [],
		flowCatalogTree: [],
        loading: false,
        loadingTree: false,
        showOperations: false,
        chosenAreaCatalogId: null,
        chosenAreaCatalogKeys: [],
		chosenFlowCatalogIds: [],
        checkedFlowCatalogKeys:[],
        checkedFlowCatalogIds:[],
        expandSubGrid: false,
        selectedRows: [],
        defaultSelectedRowKeys: [],
        formValues: {},
        pagination: {
            "showSizeChanger": true,
            "showQuickJumper": true,
            "current": 1,
            "pageSize": 10,
            total: 0
        },
        sorter: {},
        filtersArg: {},
        mainGridResult: { "total": 0, "rows": [] },
		exceptionReasons: {},
        modalName: '',
	}

    constructor(props) {
        super(props);
    }

    fetchAreaTree() {
        http.post('/call/call.do', {
            bean: 'AreaServ',
            method: 'getAreaJsonTree',//'qryWorkItemByCond',
            param: { "areaId": "1" }
            //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}

        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                const loop = (data) => {
                    data.forEach((item) => {
                        if(item.children) {
                            loop(item.children);
                        }
                        item.isLeaf = false;
                        item.loaded = false;
                        item.key = item.id+'-0';
                    });
                };
                if (returnData) {
                    loop(returnData);
                    console.log("}}}}}}",returnData);
                    this.setState({
                        areaCatalogTree: returnData
                    });
                }

                //this.rerenderMainGridData();
                //console.log('success!!',res);
            }, res => {
                console.log("查询区域树失败！");
                //this.rerenderMainGridData();
            });
    }
    
    fetchFlowTree() {
        this.setState({
            loadingTree: true
        });
        let areaId = this.state.chosenAreaCatalogId==null?"1":this.state.chosenAreaCatalogId;
        console.log("0000000",areaId);
        console.log("5555555",session);
        http.post('/call/call.do', {
            bean: 'FlowServ',
            method: 'queryPackageCatalogByAreaIdAndSystemCode',//'qryWorkItemByCond',
            param: { "areaId": areaId , 'systemCode':session.currentTendant.tenantCode }
            //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}

        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                const loop = (data) => {
                    data.forEach((item) => {
                        if(item.children) {
                            loop(item.children);
                        }
                        item.isLeaf = false;
                        item.loaded = false;
                        item.key = item.id+'-0';
                    });
                };
                if (returnData) {
                    loop(returnData);
                    this.setState({
                        flowCatalogTree: returnData
                    });
                }

                this.setState({
                    loadingTree: false
                });
                //this.rerenderMainGridData();
                //console.log('success!!',res);
            }, res => {
                this.setState({
                    loadingTree: false
                });
                console.log("查询流程树失败！");
                //this.rerenderMainGridData();
            });
	}
	
    componentDidMount() {
        this.fetchAreaTree();
        this.fetchFlowTree();
	}
	
    onLoadData=(treeNode)=>{
        const node = treeNode.props;
        console.log("+++++",treeNode)
		if(node.isLeaf==false){
            console.log("",node)
		  return  http.post('/call/call.do', {
								bean: 'FlowServ',
								method: 'qryProcessDefineByCatalogId',
								param: {"catalogId":treeNode.props.id}
							}, {
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								}).then(res => { 
                                    const treeData = JSON.parse(res);
                                    console.log("-------",this.state.flowCatalogTree);
                                    treeData.forEach((item)=>{
                                        item.isLeaf = true;
                                        item.loaded = true;
                                        item.key = item.id + '-1';
                                    })
                                    this.setState({
                                        loadingTree:true
                                    });
									const loop = (data) => {
										data.forEach((item) => {
                                            if(item.id == treeNode.props.id && item.loaded==false && item.isLeaf == false){
                                                console.log("-----",item);
                                                item.loaded = true;
                                                if(item.children){
                                                  item.children=item.children.concat(treeData);
                                                  return
                                                }else{
                                                  item.children = treeData;
                                                  return
                                                }
                                            }
											if(item.children) {
												loop(item.children);
											}
										});
									  };
                                    loop(this.state.flowCatalogTree);
                                    console.log("-------",this.state.flowCatalogTree);
                                    this.setState({
                                        loadingTree:false
                                    });
								}, res => {
			
			});
		}else{
		  return new Promise(function(resolve, reject) {
			resolve();
			return;
		});
		}
	}
		  
	renderTree = (tree) => {
        if (tree == null || tree.length < 1) return null;
        return tree.map(t => {
            if (t.children && t.children.length > 0) {
                return (<TreeNode key={`${t.key}`} id={`${t.id}`} title={`${t.text}`} isLeaf={t.isLeaf} loaded={t.loaded}>
                    {this.renderTree(t.children)}
                </TreeNode>)
            }
            return (<TreeNode key={`${t.key}`} id={`${t.id}`} title={`${t.text}`} isLeaf={t.isLeaf} loaded={t.loaded}/>)
        });

    } 
    
    
    showModals=(modalName)=>{
        this.setState({
            modalName
        })
    }


    renderModal=()=>{
        if(this.state.modalName=='flowLimitAdd'){
            // console.log(this.state.selectedRows[0]);
            // console.log("777777",catalogInherit);
            return <AddFlowLimit flowTree={this.state.flowCatalogTree} areaTree={this.state.areaCatalogTree} onCancel={this.handleCancel}/>;
        }
        if(this.state.modalName=='flowLimitEdit'){
            return <EditFlowLimit flowLimitInstance={this.state.selectedRows[0]} onCancel={this.handleCancel}/>;
        }
        
        
        if(this.state.modalName=='flowLimitDelete'){
            return <DeleteFlowLimit flowLimitInstance={this.state.selectedRows[0]} onCancel={this.handleCancel}/>;
        }
        return null;
    }


    handleCancel = () => {
        this.setState({
            modalName:''
        })
    }


	handleChooseAreaCatalog = (selectedKeys, e) => {
        console.log("222222222",selectedKeys);
        if (e) {
            this.state.chosenAreaCatalogKeys = selectedKeys;
            this.state.chosenAreaCatalogId = e.node.props.rid;
            this.setState({
                chosenAreaCatalogKeys: selectedKeys,
                chosenAreaCatalogId: e.node.props.rid
            },() => {
                this.fetchFlowTree();
            })
        }
	}

	handleChooseFlowCatalog = (selectedKeys, e) => {
        console.log("11111111",e);
        if (selectedKeys) {
            this.state.chosenFlowCatalogIds = selectedKeys;
            this.setState({
                chosenFlowCatalogIds: selectedKeys
            },() => {
                // this.rerenderMainGridData();
            })
        }
	}

	handleCheckedFlowCatalog = (checkedKeys, e) => {
        console.log("222222222",e);
        if (checkedKeys) {
            let checkNode = [];
            e.checkedNodes.forEach((item)=>{
                checkNode.push(item.props.id);
            });
            console.log('9999999',checkNode)
            this.state.checkedFlowCatalogIds = checkNode;
            this.state.checkedFlowCatalogKeys = checkedKeys;
            this.setState({
                checkedFlowCatalogIds: checkNode,
                checkedFlowCatalogKeys: checkedKeys
            },() => {
                this.rerenderMainGridData();
            })
        }
	}


	handleStandardTableChange = (pagination, filtersArg, sorter) => {
        this.setState({
            pagination,
            showOperations: false,
            expandSubGrid: false,
            selectedRows: []
        });
        //this.popupModel.showWorkitemOperations=false;

        const { formValues } = this.state;

        console.log("||||||||||",formValues);
        if (sorter.field) {
            this.setState({
                sorter
            });

        } else {
            this.setState({
                sorter: {}
            });
        }

        this.postGetMainGridData(formValues, pagination, {}, sorter);

	}
	
	handleSelectRows = row => {
		const rows = Array.isArray(row) ? row : [row];
		this.state.defaultSelectedRowKeys = rows[0].id;
        this.state.selectedRows = rows;
        // this.setState({
        //     defaultSelectedRowKeys: rows[0].id,
        //     selectedRows: rows
        // })
        // this.rerenderRelaGridData();
	};


    handleSearch = (err, values) => {
        if (err) return;

        for (let k in values) {
            if (values[k] instanceof moment) {
                values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
            }
        }

        this.setState({
            formValues: values,
        });
        this.postGetMainGridData(values,this.state.pagination,{},this.state.sorter);
    }

	getGridData = () => {
        this.state.pagination.total = this.state.mainGridResult.total;
        if (this.state.pagination.total == null) {
            this.state.pagination.total = 0;
        }
        const ret = _.merge({}, this.state.mainGridResult);
        ret.pagination = this.state.pagination;

        return ret;
    }
    

    rerenderMainGridData = () => {
        this.postGetMainGridData(this.state.formValues, this.state.pagination, this.state.pagination, this.state.sorter);

    }

    postGetMainGridData = (formValues, pagination, filtersArg, sorter) => {

        let packageIds = [];
        let param = Object.assign({}, formValues);
        param = _.merge(param, pagination);
		console.log(param);
        param.page = param.current;
        if (sorter.field) {
            param.sortColumn = sorter.field;
            if (sorter.order === "descend") {
                param.sortOrder = 'desc';
            } else {
                param.sortOrder = 'asc';
            }
        }

        if (this.state.checkedFlowCatalogIds.length>0) {
            packageIds = this.state.checkedFlowCatalogIds
            param.packageId = packageIds[0];
        }else{
            param.packageId = '-1';
        }

        if (this.state.chosenAreaCatalogId) {
            param.areaId = this.state.chosenAreaCatalogId;
        }

        this.setState({
            loading: true,
            showOperations: false,
            expandSubGrid: false,
            selectedRows: []
        });
        //this.popupModel.showWorkitemOperations=false;
        console.log(param);
        http.post('/call/call.do', {
            bean: 'FlowLimitServ',
            method: 'qryFlowLimitByPackageDefine',//'qryWorkItemByCond',
            param: param
            //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}

        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
                    this.state.pagination.total = returnData.total;
                    this.setState({
                        mainGridResult: returnData,
                        pagination: this.state.pagination
                    });
                    console.log(returnData, this.state.pagination)
                }

                this.setState({
                    loading: false
                });

                //console.log('success!!',res);
            }, res => {
                this.setState({
                    loading: false
                });
                console.log('failed!!', res);
            });
    }


    render() {
        return (
            <div style={{ 'padding': '5px', height: '100%' }}>
                <div className={PREFIX} style={{ height: '100%', position: 'relative' }}>
                    <div className='Tree' style={{ height: '100%', position: 'relative', width:250 }}>
                        <Card className={`${cx('card_areaTree')}`} style={{ width: 250, height: '40%', float: 'left' }}
                            title="区域"
                            bordered={false}
                            type='inner'
                        /*  actions={[ <Icon type="folder-add" />,<Icon type="file-add" />, <Icon type="edit" />, <Icon type="close" />]} this.showConfirmDelCatalog()*/
                        >
                            <Tree
                                className="areaTree"
                                showLine
                                defaultExpandedKeys={['1']}
                                onSelect={this.handleChooseAreaCatalog}
                                defaultSelectedKeys={['1-0']}
                                selectedKeys={this.state.chosenAreaCatalogKeys}
                                // onRightClick={this.handleRClickExcepCatalog}
                            >
                                {this.renderTree(this.state.areaCatalogTree)}
                            </Tree>
                        </Card>
                        <Card className={`${cx('card_flowTree')}`} style={{ width: 250, height: '60%', float: 'left', marginTop:'5px'}}
                            title="流程"
                            bordered={false}
                            type='inner'
                        /*  actions={[ <Icon type="folder-add" />,<Icon type="file-add" />, <Icon type="edit" />, <Icon type="close" />]} this.showConfirmDelCatalog()*/
                        >
                            <div className="flowTree" style={{position:'relative',height: '180px',overflow: 'auto'}}>
                                <Tree
                                    className="flowTree"
                                    multiple checkable
                                    defaultExpandedKeys={['1']}
                                    onSelect={this.handleChooseFlowCatalog}
                                    onCheck={this.handleCheckedFlowCatalog}
                                    defaultSelectedKeys={this.state.chosenFlowCatalogIds}
                                    defaultCheckedKeys={this.state.checkedFlowCatalogKeys}
                                    selectedKeys={this.state.chosenFlowCatalogIds}
                                    checkedKeys={this.state.checkedFlowCatalogKeys}
                                    loadData={this.onLoadData}
                                    loading={this.state.loadingTree}
                                    // onRightClick={this.handleRClickExcepCatalog}
                                >
                                    {this.renderTree(this.state.flowCatalogTree)}
                                </Tree>
                            </div>
                            <DynamicSearchForm 
                                ref='instanceSearchForm'
                                formConfig={searchFormConfig}
                                hideFooter={true}
                                onSubmit={this.handleSearch}                           
                            >
                            </DynamicSearchForm>
                        </Card>
                    </div>

                    <Card  className={'flow-widget-table'} style={{ position: 'absolute',height:'100%', top: '0px', left: '255px', bottom: '0px', right: '0px', overflow: 'auto' }}
                        title="流程时限列表"
                        bordered={false}
                        type='inner'>
                        {/* disabled={(this.state.selectedRows.length > 0 && this.state.selectedRows[0].state=='10A')? false : true}  */}
                        <div className="flowToolBar" style={{position:'sticky',top:'5px',backgroundColor:'#fff',zIndex: 199,opacity: '1',marginBottom:'10px'}}>
                            <Button size="small" onClick={() => {this.showModals('flowLimitAdd');}} ><Icon type="plus" />新增</Button>
                            <Button size="small" onClick={() => {this.showModals('flowLimitEdit');}} ><Icon type="edit" />修改</Button>
                            <Button size="small" onClick={() => {this.showModals('flowLimitDelete');}} ><Icon type="delete" />删除</Button>
                        </div>
						<StandardTable 
						    rowKey={'id'}
                            selectedRows={this.state.selectedRows}
                            selectedRowKeys={this.state.defaultSelectedRowKeys}
							loading={this.state.loading}
							bordered={true}
                            data={this.getGridData()}
                            columns={flowLimitCols}
							rowSelection={{ type: 'single' }}
							
                            // rowSelection={rowSelection}
                            clicktoSelect={true}
                            onRowClick={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                            // scoll={{ x: true, y: (document.querySelector('.ant-tabs-content').clientHeight - 300) }}
                        />
                    </Card>
                    {
                        this.renderModal()
                    }
                </div>
                {/* <NonModalDialog visible={true}>
                </NonModalDialog> */}
            </div>
        );
    }

	// render() {
	// 	let url = '';
	// 	if(location.hostname == 'localhost' || location.hostname == '127.0.0.1' || location.hostname == ''){
	// 		if(location.pathname.startsWith('/' + extractPath)){
	// 			url = '/' + extractPath;
	// 		} else {
	// 			url = 'http://101.132.66.16:9079/uos-manager';
	// 		}
	// 	} else {
	// 		url = '/' + extractPath;
	// 	}
	// 	url += '/view/flow/timelimit/flowLimitManager.html';

	// 	return (
    //         <div style={{height:'100%'}}>
    //             <iframe scrolling={"no"} frameBorder={"0"} src={`${url}`} style={{width:'100%',height:'99%'}}>
    //             </iframe>
    //         </div>
	// 	);
	// }

}

export default FlowLimitManager;