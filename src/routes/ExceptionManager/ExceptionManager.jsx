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
import styles from './ExceptionManager.scss';
import DynamicSearchForm from 'components/DynamicSearchForm';
import StandardTable from 'components/StandardTable';
import NonModalDialog from 'components/NonModalDialog'
import { exceptionReasonCols, formConfig, dynamicFormConfig, catalogFormConfig, dynamicEditFormConfig, catalogEditFormConfig, relationCols } from './StaticConfigs'
import StandardList from 'components/StandardList';
import CatalogAdd from './popups/CatalogAdd';
import CatalogDelete from './popups/CatalogDelete';
import CatalogEdit from './popups/CatalogEdit';
import SubCatalogAdd from './popups/SubCatalogAdd';
import ReasonAdd from './popups/ReasonAdd'; 
import ReasonDelete from './popups/ReasonDelete';
import ReasonEdit from './popups/ReasonEdit';
import session from 'models/Session';

//import popupModel from './models/TacheMgrModel'

const PREFIX = 'flow-exceptionmgr';

const FormItem = Form.Item;
const cx = utils.classnames(PREFIX,styles);
const { TreeNode } = Tree;
const confirm = Modal.confirm;

let catalogOption = [];
let catalogInherit  = [];

// const tableStyle = {
//       return {
//             disabled: record.state === '10P'    // 配置无法勾选的列
//       };
//   };

const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');
/**
 * 异常原因管理
 */
@observer
class ExceptionManager extends Component {
    state = {
        excecpCatalogTree: [],
        loading: false,
        showOperations: false,
        chosenExcecpCataChild: false,
        chosenExcecpCatalogId: null,
        chosenExcecpCatalogName: '',
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
        catalogValue:'',
        relaLoading: false,
        relaSelectedRows: [],
        relaDefaultSelectedRowKeys: [],
        relaPagination: {
            "showSizeChanger": true,
            "showQuickJumper": true,
            "current": 1,
            "pageSize": 10,
            total: 0
        },
        relaSorter: {},
        relaFiltersArg: {},
        relaGridResult: { "total": 0, "rows": [] }
    };

    constructor(props) {
        super(props);
        // this.popupModel = popupModel;
    }

    fetchReasonTree() {
        this.setState({
            loading: true
        });
        http.post('/call/call.do', {
            bean: 'ReturnReasonServ',
            method: 'qryReturnReasonCatalogTree',//'qryWorkItemByCond',
            param: { "systemCode": session.currentTendant.tenantCode }
            //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}

        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
                    this.setState({
                        excecpCatalogTree: returnData
                    });
                }

                this.setState({
                    loading: false
                });
                //this.rerenderMainGridData();
                //console.log('success!!',res);
            }, res => {
                this.setState({
                    loading: false
                });
                this.setState({
                    excecpCatalogTree: [{"id":1004,"text":"上海公安","type":1,"systemCode":"ITS","iconCls":"catalog-close"},{"id":1005,"text":"测试目录","type":1,"systemCode":"ITS","iconCls":"catalog-close","state":"closed","children":[{"id":1006,"text":"测试1","type":1,"systemCode":"ITS","iconCls":"catalog-close"}]}]
                });
                //this.rerenderMainGridData();
            });
    }

    componentDidMount() {
        this.fetchReasonTree();
    }

    componentWillUnmount() {

	}
	
	handleReasonDeleteOk = () => {
        let rows = this.state.selectedRows;
        console.log("++++++++"+rows);
        if (rows.length>0) {
            const params = {
                returnReasonId: rows[0].id,
                state: "10A",
            };
            http.post('/call/call.do', {
                bean: 'ReturnReasonServ',
                method: 'qryTacheReturnReasons',//'qryWorkItemByCond',
                param: params
                //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
    
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    const returnData = JSON.parse(res);
                    if(returnData && returnData.total > 0)
                    {
                        Modal.warn({ title: '提示', content: "该异常原因已经配置在环节上，请停用之后再删除异常原因"});
                    }else{
                        http.post('/call/call.do', {
                            bean: 'ReturnReasonServ',
                            method: 'delReturnReason',//'qryWorkItemByCond',
                            param: {"id":rows[0].id}
                            //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
                
                        }, {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }).then(res => {
                                const returnData = JSON.parse(res);
                                console.log("////////",returnData.isSuccess);
                                if(returnData.isSuccess)
                                {
                                    Modal.success({ title: '提示', content: "删除异常原因成功"});
                                    this.rerenderMainGridData();
                                }else{
                                    Modal.error({ title: '提示', content: "删除异常原因失败"});
                                }
                            }, res => {
                                console.log("删除异常原因失败");
                            });
                    }
                }, res => {
                    console.log("查询环节异常原因失败");
                });
        }
        this.setState({
            modalName:''
        });  
	}

	handleCatalogDeleteOk = () => {
        let hasChild = this.state.chosenExcecpCataChild;
        let CatalogId = this.state.chosenExcecpCatalogId;
        console.log("++++++++",hasChild,CatalogId);
        if(CatalogId)
        {
            if (hasChild) {
                Modal.warn({ title: '提示', content:"该目录下存在子目录，无法删除"});
            }
            else{
                const params = {
                    reasonCatalogId: CatalogId,
                    state: '10A',
                    page: 1,
                    pageSize: 1,
                    systemCode: session.currentTendant.tenantCode
                };
                http.post('/call/call.do', {
                    bean: 'ReturnReasonServ',
                    method: 'qryReturnReasons',//'qryWorkItemByCond',
                    param: params
                    //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
        
                }, {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }).then(res => {
                        const returnData = JSON.parse(res);
                        if(returnData && returnData.total > 0)
                        {
                            Modal.warn({ title: '提示', content: "该目录下存在异常原因，无法删除"});
                        }else{
                            http.post('/call/call.do', {
                                bean: 'ReturnReasonServ',
                                method: 'delReturnReasonCatalog',//'qryWorkItemByCond',
                                param: {"id":CatalogId}
                                //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
                    
                            }, {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                }).then(res => {
                                    const returnData = JSON.parse(res);
                                    console.log("////////",returnData.isSuccess);
                                    if(returnData.isSuccess)
                                    {
                                        Modal.success({ title: '提示', content: "删除异常原因目录成功"});
                                        this.fetchReasonTree();
                                    }else{
                                        Modal.error({ title: '提示',content: "删除异常原因目录失败"});
                                    }
                                }, res => {
                                    console.log("删除异常原因目录失败");
                                });
                        }
                    }, res => {
                        console.log("查询目录下存在异常原因");
                    });
                }
        }
        this.setState({
            modalName:''
        });  
    }

    showConfirmDelRelation = () => {
        let returnReasonId = this.state.relaSelectedRows[0].returnReasonId;
        let tacheId = this.state.relaSelectedRows[0].tacheId;
        let areaId = this.state.relaSelectedRows[0].areaId;
		confirm({
          title: '确定删除该异常原因的适配环节吗？',
          closable: 'true',
          okText: '确定',
          cancelText: '取消',
		  onOk() {
            if(tacheId)
            {
                const params = {
                    returnReasonId: returnReasonId,
                    tacheId: tacheId,
                    areaId: areaId
                };
                http.post('/call/call.do', {
                    bean: 'ReturnReasonServ',
                    method: 'delTacheReturnReason',//'qryWorkItemByCond',
                    param: params
                    //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
        
                }, {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }).then(res => {
                        const returnData = JSON.parse(res);
                        console.log("////////",returnData.isSuccess);
                        if(returnData.isSuccess)
                        {
                            Modal.success({ title: '提示', content:"删除异常原因的适配环节成功"});
                            this.rerenderRelaGridData();
                        }else{
                            Modal.error({ title: '提示',content: "删除异常原因的适配环节失败"});
                        }
                    }, res => {
                        console.log("删除异常原因的适配环节失败");
                    });
                }
		  },
		  onCancel() {}
        });
    }

    showModals=(modalName)=>{
        this.setState({
            modalName
        })
    }

    renderModal=()=>{
        if(this.state.modalName=='catalogAdd'){
            // console.log(this.state.selectedRows[0]);
            catalogInherit = [];
            this.findParentNode(this.state.excecpCatalogTree,-1);
            // console.log("777777",catalogInherit);
            return <Modal title="增加异常原因目录" visible = {true} closable = {true}
            onOk={this.handleCatalogAddOk} onCancel={this.handleCancel}
            okText="确定" cancelText="取消"  width="470px">
            <DynamicSearchForm wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
                            formConfig={catalogFormConfig}
                            hideFooter='true'
                            // onSubmit={this.handleSearch}
            >
            </DynamicSearchForm>
          </Modal>
        }
        if(this.state.modalName=='catalogEdit'&&this.state.chosenExcecpCatalogId){
            catalogEditFormConfig.fields[0].props.defaultValue = this.state.chosenExcecpCatalogName;
            return <Modal title="修改异常原因目录" visible = {true} closable = {true}
            onOk={this.handleCatalogEditOk} onCancel={this.handleCancel}
            okText="确定" cancelText="取消"  width="470px">
            <DynamicSearchForm wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
                            formConfig={catalogEditFormConfig}
                            hideFooter='true'
                            // onSubmit={this.handleSearch}
            >
            </DynamicSearchForm>
            {/* <div style={{margin: '20px'}}>目录名称<span stype={{color:"red",margin: '20px'}}>*</span>
		        <input type={"text"} id={"catalogName"} value={this.state.chosenExcecpCatalogName}/>
            </div> */}
          </Modal>
        }
        
        
        if(this.state.modalName=='catalogDelete'){
            return <Modal title="确定删除此目录" visible = {true} closable = {true}
            onOk={this.handleCatalogDeleteOk} onCancel={this.handleCancel}
            okText="确定" cancelText="取消" width="350px">
          </Modal>
        }

		if(this.state.modalName=='subCatalogAdd'){
            return <Modal title="增加异常原因子目录" visible = {true} closable = {true}
            onOk={this.handleSubCatalogAddOk} onCancel={this.handleCancel}
            okText="确定" cancelText="取消"  width="470px">
            <DynamicSearchForm wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
                            formConfig={catalogFormConfig}
                            hideFooter='true'
                            // onSubmit={this.handleSearch}
            >
            </DynamicSearchForm>
          </Modal>
		}
		
		if(this.state.modalName=='reasonAdd'){
            return <Modal title="增加异常原因" visible = {true} closable = {true}
            onOk={this.handleReasonAddOk} onCancel={this.handleCancel}
            okText="确定" cancelText="取消"  width="470px">
            <DynamicSearchForm wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
                            formConfig={dynamicFormConfig}
                            hideFooter='true'
                            //onSubmit={this.handleReasonAddOk}
            >
            </DynamicSearchForm>
          </Modal>
        }
		
		if(this.state.modalName=='reasonEdit'&&this.state.selectedRows.length>0){
            let editFormConfig = dynamicEditFormConfig;
            editFormConfig.fields[2].options = catalogOption;
            let selectRowCatalog = catalogOption.find(data=>data.value==this.state.selectedRows[0].reasonCatalogId)
            editFormConfig.fields[0].props.defaultValue = this.state.selectedRows[0].reasonCode;
            editFormConfig.fields[1].props.defaultValue = this.state.selectedRows[0].returnReasonName;
            editFormConfig.fields[2].props.defaultValue = selectRowCatalog.value;
            editFormConfig.fields[2].props.placeholder = selectRowCatalog.text;
            //console.log("_____",catalogOption.find(data=>data.value==this.state.selectedRows[0].reasonCatalogId));
            editFormConfig.fields[3].props.defaultValue = this.state.selectedRows[0].reasonType;
            return <Modal title="修改异常原因" visible = {true} closable = {true}
            onOk={this.handleReasonEditOk} onCancel={this.handleCancel}
            okText="确定" cancelText="取消" width="470px">
            <DynamicSearchForm wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
                            formConfig={editFormConfig}
                            hideFooter='true'
                            // onSubmit={this.handleSearch}
            >
            </DynamicSearchForm>
          </Modal>
        }

        if(this.state.modalName=='reasonDelete'){
            return <Modal title="确定删除此异常原因" visible = {true} closable = {true}
            onOk={this.handleReasonDeleteOk} onCancel={this.handleCancel}
            okText="确定" cancelText="取消" width="350px">
          </Modal>
        }

        if(this.state.modalName=='relationAdd'){
            return <Modal title="增加异常原因适配环节" visible = {true} closable = {true}
            onOk={this.handleRelationAddOk} onCancel={this.handleCancel}
            okText="确定" cancelText="取消"  width="470px">
            <DynamicSearchForm wrappedComponentRef={(formRef) => { this.formRef = formRef; }}
                            formConfig={dynamicFormConfig}
                            hideFooter='true'
                            //onSubmit={this.handleReasonAddOk}
            >
            </DynamicSearchForm>
          </Modal>
        }
        return null;
    }

    renderExcepTree = (tree) => {
        if (tree == null || tree.length < 1) return null;
        return tree.map(t => {
            if (t.children && t.children.length > 0) {
                catalogOption.push({value:`${t.id}`,text:`${t.text}`});
                // catalogInherit.push({id:`${t.id}`,text:`${t.text}`});
                return (<TreeNode key={`${t.id}`} title={`${t.text}`} >
                    {this.renderExcepTree(t.children)}
                </TreeNode>)
            }
            catalogOption.push({value:`${t.id}`,text:`${t.text}`});
            return (<TreeNode key={`${t.id}`} title={`${t.text}`} />)
        });

    }

    findParentNode = (tree,nodeId) => {
        if (tree == null || tree.length < 1) return null;
        return tree.map(t => {
            catalogInherit.push({value:`${t.id}`,parent:nodeId});
            if (t.children && t.children.length > 0) {
                // catalogInherit.push({id:`${t.id}`,text:`${t.text}`});
                this.findParentNode(t.children,t.id);
            }
        });

    }

    refDynFormCb = (instance) => {
        this.DynFormInst = instance;
        if (instance == null) return;
        instance.getForm().validateFields((err, values) => {

            if (err) return;

            for (let k in values) {
                if (values[k] instanceof moment) {
                    values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
                }
            }

            this.setState({
                formValues: values,
            });
            //console.log('初始化grid');
            //this.postGetInstancesData(values,this.state.pagination,{},this.state.sorter);

        });
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

    getRelaGridData = () => {
        this.state.relaPagination.total = this.state.relaGridResult.total;
        if (this.state.relaPagination.total == null) {
            this.state.relaPagination.total = 0;
        }
        const ret = _.merge({}, this.state.relaGridResult);
        ret.pagination = this.state.relaPagination;

        return ret;
    }

    handleChooseExcepCatalog = (selectedKeys, e) => {
        // console.log("222222222",e.selectedNodes[0].props.title);
        if (selectedKeys && selectedKeys.length > 0) {
            this.state.chosenExcecpCatalogId = selectedKeys[0];
            let title = e.selectedNodes[0].props.title;
            if(e.selectedNodes[0].props.children)
            {
                this.state.chosenExcecpCataChild = true;
                this.setState({
                    chosenExcecpCatalogId: selectedKeys[0],
                    chosenExcecpCataChild: true,
                    chosenExcecpCatalogName: title
                },() => {
                    this.rerenderMainGridData();
                })
            }
            else{
                this.state.chosenExcecpCataChild = false;
                this.setState({
                    chosenExcecpCatalogId: selectedKeys[0],
                    chosenExcecpCataChild: false,
                    chosenExcecpCatalogName: title
                },() => {
                    this.rerenderMainGridData();
                })
            }
        }
        // else {
        //      this.state.chosenExcecpCatalogId = null;
        //     this.state.chosenExcecpCataChild = false;
        //     this.setState({
        //         chosenExcecpCatalogId: null,
        //         chosenExcecpCataChild: false,
        //         chosenExcecpCatalogName: ''
        //     })
        // }

        // this.rerenderMainGridData();

    }
    

    handleCatalogAddOk = ()=>{
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;

			for (const k in values) {
				if (values[k] instanceof moment) {
					values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
				}
            }
            
            let selectCatalogInherit = catalogInherit.find(data=>data.value==this.state.chosenExcecpCatalogId);
            
            const params = {
                reasonCatalogName:values.reasonCatalogName,
                parentReasonCatalogId:selectCatalogInherit.parent,
                systemCode:session.currentTendant.tenantCode
            };
            
            http.post('/call/call.do', {
                bean: 'ReturnReasonServ',
                method: 'addReturnReasonCatalog',//'qryWorkItemByCond',
                param: params
                //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
    
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    const returnData = JSON.parse(res);
                    if (returnData.catalogId) {
                        Modal.success({ title: '提示', content:"新增异常原因目录成功"});
                        this.fetchReasonTree();
                    }else{
                        Modal.error({ title: '提示',content: "新增异常原因目录失败"});
                    }
                    //this.rerenderMainGridData();
                    //console.log('success!!',res);
                }, res => {
                    Modal.error({ title: '提示',content: "新增异常原因目录失败"});
                    //this.rerenderMainGridData();
                });

		});

        this.setState({
            modalName:''
        });                
    }

    handleCatalogEditOk = ()=>{
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;

			for (const k in values) {
				if (values[k] instanceof moment) {
					values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
				}
			}

            const params = {
                reasonCatalogName: values.reasonCatalogName,
                id: this.state.chosenExcecpCatalogId
            };
            
            http.post('/call/call.do', {
                bean: 'ReturnReasonServ',
                method: 'modReturnReasonCatalog',//'qryWorkItemByCond',
                param: params
                //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
    
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    const returnData = JSON.parse(res);
                    if (returnData.isSuccess) {
                        Modal.success({ title: '提示', content: "修改异常原因目录成功"});
                        this.fetchReasonTree();
                    }else{
                        Modal.error({ title: '提示',content: "修改异常原因目录失败"});
                    }
                    //this.rerenderMainGridData();
                    //console.log('success!!',res);
                }, res => {
                    Modal.error({ title: '提示',content: "修改异常原因目录失败"});
                    //this.rerenderMainGridData();
                });

		});

        this.fetchReasonTree();
        this.setState({
            modalName:''
        });               
    }

    handleSubCatalogAddOk = ()=>{
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;

			for (const k in values) {
				if (values[k] instanceof moment) {
					values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
				}
            }
            
            const params = {
                reasonCatalogName:values.reasonCatalogName,
                parentReasonCatalogId:this.state.chosenExcecpCatalogId,
                systemCode:session.currentTendant.tenantCode
            };
            
            http.post('/call/call.do', {
                bean: 'ReturnReasonServ',
                method: 'addReturnReasonCatalog',//'qryWorkItemByCond',
                param: params
                //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
    
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    const returnData = JSON.parse(res);
                    if (returnData.catalogId) {
                        Modal.success({ title: '提示', content: "新增异常原因子目录成功"});
                        this.fetchReasonTree();
                    }else{
                        Modal.error({ title: '提示',content: "新增异常原因子目录失败"});
                    }
                    //this.rerenderMainGridData();
                    //console.log('success!!',res);
                }, res => {
                    Modal.error({ title: '提示',content: "新增异常原因子目录成功"});
                    //this.rerenderMainGridData();
                });

		});

        this.setState({
            modalName:''
        });          
    }

    handleReasonAddOk = ()=>{
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;

			for (const k in values) {
				if (values[k] instanceof moment) {
					values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
				}
			}


            const params = {
                reasonCatalogId: this.state.chosenExcecpCatalogId,
                reasonCode: values.reasonCode,
                returnReasonName: values.returnReasonName,
                reasonType: values.reasonType,
                systemCode: session.currentTendant.tenantCode
            };
            
            http.post('/call/call.do', {
                bean: 'ReturnReasonServ',
                method: 'addReturnReason',//'qryWorkItemByCond',
                param: params
                //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
    
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    const returnData = JSON.parse(res);
                    if (returnData.returnReasonId=='-1') {
                        Modal.error("提示","异常原因编码重复");
                    }else{
                        Modal.success({ title: '提示', content: "新增异常原因成功"});
                        this.rerenderMainGridData();
                    }
                    //this.rerenderMainGridData();
                    //console.log('success!!',res);
                }, res => {
                    Modal.error({ title: '提示',content: "新增异常原因失败"});
                    //this.rerenderMainGridData();
                });

		});

        this.setState({
            modalName:''
        });       
    }

    handleReasonEditOk = ()=>{
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) return;

			for (const k in values) {
				if (values[k] instanceof moment) {
					values[k] = moment(values[k]).format('YYYY-MM-DD HH:mm:ss');
				}
			}


            const params = {
                reasonCatalogId: values.reasonCatalogId,
                returnReasonName: values.returnReasonName,
                id: this.state.selectedRows[0].id
            };
            
            http.post('/call/call.do', {
                bean: 'ReturnReasonServ',
                method: 'modReturnReason',//'qryWorkItemByCond',
                param: params
                //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
    
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    const returnData = JSON.parse(res);
                    if (returnData.isSuccess) {
                        Modal.success({ title: '提示', content: "修改异常原因成功"});
                        this.rerenderMainGridData();
                    }else{
                        Modal.error({ title: '提示',content: "修改异常原因失败"});
                    }
                    //this.rerenderMainGridData();
                    //console.log('success!!',res);
                }, res => {
                    Modal.error({ title: '提示',content: "修改异常原因失败"});
                    //this.rerenderMainGridData();
                });

		});

        this.setState({
            modalName:''
        });         
    }

    handleCancel = () =>{
        this.setState({
            modalName:''
        });
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

    handleRelaStandardTableChange = (pagination, filtersArg, sorter) => {
        this.setState({
            relaPagination:pagination,
            relaSelectedRows: []
        });
        //this.popupModel.showWorkitemOperations=false;

        // console.log("}}}}}}}",relaFormValues);
        if (sorter.field) {
            this.setState({
                relaSorter:sorter
            });

        } else {
            this.setState({
                relaSorter: {}
            });
        }

        this.postGetRelaGridData(pagination, {}, sorter);

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

    handleRelaSelectRows = row => {
		const rows = Array.isArray(row) ? row : [row];
		this.state.relaDefaultSelectedRowKeys = rows[0].tacheId;
		this.state.relaSelectedRows = rows;
    };

    handleSearch = (err, values) => {
        //console.log('submit',err, values);
        if (err) return;
        this.setState({
            formValues: values,
        });
        this.postGetMainGridData(values, this.state.pagination, {}, this.state.sorter);
    }

    rerenderMainGridData = () => {
        this.postGetMainGridData(this.state.formValues, this.state.pagination, this.state.pagination, this.state.sorter);

    }

    rerenderRelaGridData = () => {
        this.postGetRelaGridData(this.state.relaPagination, this.state.relaPagination, this.state.relaSorter);

    }

    postGetMainGridData = (formValues, pagination, filtersArg, sorter) => {

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

        if (param.state == 'all') {
            delete param.state;
        }

        if (param.reasonType == 'all') {
            delete param.reasonType;
        }

        if (this.state.chosenExcecpCatalogId) {
            param.reasonCatalogId = this.state.chosenExcecpCatalogId;
        }

		// param.reasonClass = '1';
        param.systemCode = session.currentTendant.tenantCode;
        this.setState({
            loading: true,
            showOperations: false,
            expandSubGrid: false,
            selectedRows: []
        });
        //this.popupModel.showWorkitemOperations=false;
        console.log(param);
        http.post('/call/call.do', {
            bean: 'ReturnReasonServ',
            method: 'qryReturnReasons',//'qryWorkItemByCond',
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
                const returnData = {"total":3,"rows":[{"id":1005,"reasonCatalogId":1006,"reasonCode":"3","reasonType":"10P","returnReasonName":"3","createDate":"2018-04-18 19:52:18","state":"10A","stateDate":"2018-04-18 19:52:18","synFlag":"N","actionCode":"ADD","reasonClass":"1","tenantId":"ITS"},{"id":1004,"reasonCatalogId":1006,"reasonCode":"2","reasonType":"10R","returnReasonName":"2","createDate":"2018-04-18 16:11:59","state":"10A","stateDate":"2018-04-18 16:11:59","synFlag":"N","actionCode":"ADD","reasonClass":"1","tenantId":"ITS"},{"id":1003,"reasonCatalogId":1006,"reasonCode":"1","reasonType":"10R","returnReasonName":"1","createDate":"2018-04-18 16:10:50","state":"10A","stateDate":"2018-04-18 16:10:50","synFlag":"N","actionCode":"ADD","reasonClass":"1","tenantId":"ITS"}]}
                if (returnData) {
                    this.state.pagination.total = returnData.total;
                    this.setState({
                        mainGridResult: returnData,
                        pagination: this.state.pagination
                    });
                }
                this.setState({
                    loading: false
                });
                console.log('failed!!', res);
            });
    }

    postGetRelaGridData = (pagination, filtersArg, sorter) => {

        let param = {};
        param = _.merge(param, pagination);
		console.log("\\\\\\",param);
        param.page = param.current;
        if (sorter.field) {
            param.sortColumn = sorter.field;
            if (sorter.order === "descend") {
                param.sortOrder = 'desc';
            } else {
                param.sortOrder = 'asc';
            }
        }

        if (this.state.selectedRows && this.state.selectedRows.length > 0) {
            param.returnReasonId = this.state.selectedRows[0].id;
        }

		// param.reasonClass = '1';
        this.setState({
            relaLoading: true,
            relaSelectedRows: []
        });
        //this.popupModel.showWorkitemOperations=false;
        console.log("pppppp",param);
        http.post('/call/call.do', {
            bean: 'ReturnReasonServ',
            method: 'qryTacheReturnReasons',//'qryWorkItemByCond',
            param: param
            //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}

        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
                    this.state.relaPagination.total = returnData.total;
                    this.setState({
                        relaGridResult: returnData,
                        relaPagination: this.state.relaPagination
                    });
                    console.log(returnData, this.state.relaPagination)
                }

                this.setState({
                    relaLoading: false
                });

                //console.log('success!!',res);
            }, res => {
                const returnData = {"total":2,"rows":[{"tacheId":1096,"returnReasonId":1015,"tacheCatalogName":"内部功能环节","areaId":1,"areaName":"默认","tacheName":"菜单表","tacheCode":"n-7","auditFlag":"1","returnReasonName":"123","reasonType":"10R","state":"10X"},{"tacheId":1098,"returnReasonId":1015,"tacheCatalogName":"内部功能环节","areaId":1,"areaName":"默认","tacheName":"租户用户表","tacheCode":"n-8","auditFlag":"0","returnReasonName":"123","reasonType":"10R","state":"10A"}]}
                if (returnData) {
                    this.state.relaPagination.total = returnData.total;
                    this.setState({
                        relaGridResult: returnData,
                        relaPagination: this.state.relaPagination
                    });
                }
                this.setState({
                    relaLoading: false
                });
                console.log('failed!!', res);
            });
    }


    render() {
        console.log('=================', formConfig);
        catalogOption = [];
        return (
            <div style={{ 'padding': '5px', height: '100%' }}>
                <div className={PREFIX} style={{ height: '100%', position: 'relative' }}>
                    <Card className={`${cx('card_exceptioncatalog')}`} style={{ width: 250, height: '100%', float: 'left' }}
                        title="目录"
                        bordered={false}
                        type='inner'
                    /*  actions={[ <Icon type="folder-add" />,<Icon type="file-add" />, <Icon type="edit" />, <Icon type="close" />]} this.showConfirmDelCatalog()*/
                    >
						<div className = {'catalogButton'} style={{ height: 50, width: 250, position: 'relative'}}>
							<Button style = {{float: 'left'}} onClick={() => {this.showModals('catalogAdd');}} ><Icon type="plus-circle" /></Button>
							<Button style = {{marginLeft : '5px',float: 'left'}} onClick={() => {this.showModals('catalogEdit');}} ><Icon type="edit" /></Button>
							<Button style = {{marginLeft : '5px',float: 'left'}} onClick={() => {this.showModals('catalogDelete')}} ><Icon type="delete" /></Button>
							<Button style = {{marginLeft : '5px',float: 'left'}} onClick={() => {this.showModals('subCatalogAdd');}} ><Icon type="plus-square" /></Button>
						</div>
                        <Tree
                            showLine
                            defaultExpandedKeys={['1']}
                            onSelect={this.handleChooseExcepCatalog}
                            defaultSelectedKeys={[this.state.chosenExcecpCatalogId]}
                            selectedKeys={[this.state.chosenExcecpCatalogId]}
							// onRightClick={this.handleRClickExcepCatalog}
                        >
                            {this.renderExcepTree(this.state.excecpCatalogTree)}
                        </Tree>
                    </Card>

                    <Card  className={'flow-widget-table'} style={{ position: 'absolute',height:'100%', top: '0px', left: '255px', bottom: '0px', right: '0px', overflow: 'auto' }}
                        title="异常原因列表"
                        bordered={false}
                        type='inner'>
                        <DynamicSearchForm 
                            ref={this.refDynFormCb}
                            formConfig={formConfig}
                            hideFooter={true}
                            onSubmit={this.handleSearch}                           
                        >
                        </DynamicSearchForm>
                        {/* disabled={(this.state.selectedRows.length > 0 && this.state.selectedRows[0].state=='10A')? false : true}  */}
                        <div className="reansonToolBar" style={{position:'sticky',top:'5px',backgroundColor:'#fff',zIndex: 199,opacity: '1',marginBottom:'10px'}}>
                            <Button  onClick={() => {this.showModals('reasonAdd');}} ><Icon type="plus" />新增</Button>
                            <Button  onClick={() => {this.showModals('reasonEdit');}} ><Icon type="edit" />修改</Button>
                            <Button  onClick={() => {this.showModals('reasonDelete');}} ><Icon type="delete" />删除</Button>
                        </div>
                        <StandardTable rowKey={'id'}
                            selectedRows={this.state.selectedRows}
                            selectedRowKeys={this.state.defaultSelectedRowKeys}
                            loading={this.state.loading}
                            data={this.getGridData()}
                            columns={exceptionReasonCols}
                            rowSelection={{ type: 'single' }}
                            // rowSelection={rowSelection}
                            clicktoSelect={true}
                            onRowClick={this.handleSelectRows}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                            // scoll={{ x: true, y: (document.querySelector('.ant-tabs-content').clientHeight - 300) }}
                        />
                    </Card>
                    {/* <Card  className={'flow-widget-list'} style={{ position: 'absolute', height:'40%', top: '60%', left: '255px', bottom: '0px', right: '0px', overflow: 'auto' }}
                        title="异常原因使用环节"
                        bordered={false}
                        type='inner'>
                        <div className="RelationToolBar" style={{position:'sticky',top:'5px',backgroundColor:'#fff',zIndex: 199,opacity: '1',marginBottom:'10px'}}>
                            <Button onClick={() => {this.showModals('relationAdd');}} ><Icon type="plus" />新增</Button>
                            <Button onClick={() => {this.showConfirmDelRelation()}} ><Icon type="delete" />删除</Button>
                        </div>
                        <StandardTable 
                            rowKey={'tacheId'}
                            selectedRows={this.state.relaSelectedRows}
                            selectedRowKeys={this.state.relaDefaultSelectedRowKeys}
                            loading={this.state.relaLoading}
                            data={this.getRelaGridData()}
                            columns={relationCols}
                            rowSelection={{ type: 'single' }}

                            clicktoSelect={true}
                            onRowClick={this.handleRelaSelectRows}
                            onChange={this.handleRelaStandardTableChange}
                            // scoll={{ x: true, y: (document.querySelector('.ant-tabs-content').clientHeight - 300) }}
                        />
                    </Card> */}
                    {
                        this.renderModal()
                    }
                </div>
                {/* <NonModalDialog visible={true}>
                </NonModalDialog> */}
            </div>
        );
    }
    // state = {}

    // render() {
	//     let url = '';
	//     if(location.hostname == 'localhost' || location.hostname == '127.0.0.1' || location.hostname == ''){
	// 	    if(location.pathname.startsWith('/' + extractPath)){
	// 		    url = '/' + extractPath;
	// 	    } else {
	// 		    url = 'http://101.132.66.16:9079/uos-manager';
	// 	    }
	//     } else {
	// 	    url = '/' + extractPath;
	//     }
	//     url += '/view/flow/exception/exceptionManager.html';

	//     return (
	//         <div style={{height:'100%'}}>
    //             <iframe scrolling={"no"} frameBorder={"0"} src={`${url}`} style={{width:'100%',height:'99%'}}>
    //             </iframe>
    //         </div>
    //     );

    // }

}

export default ExceptionManager;