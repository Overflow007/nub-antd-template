import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Modal, Button, Popover, Icon, message ,Layout,Card,Tree,Collapse} from 'antd';
import moment from 'moment';
import session from 'models/Session';
import DynamicSearchForm from 'components/DynamicSearchForm';
//import HolidayList from 'components/HolidayList';
import NonModalDialog from 'components/NonModalDialog';
import StandardTable from 'components/StandardTable';
import { columns, workitemColumns, formConfig } from './StaticConfigs';
import './HolidayManager.scss';

const { Sider, Content, Header, Footer } = Layout;
const { TreeNode } = Tree;
const Panel = Collapse.Panel;
const PREFIX = 'flow-instance-mgr';
const cx = utils.classnames(PREFIX);

@observer
class HolidayManager extends Component {

    state = {
        showOperations: false,
        expandWorkitem: false,
        renderAreaTree: [],
        selectedRows: [],
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
        modalName: '',
        modal: {

        },
        areaId:1,
        pageSize:10,
        current:10,
    };

    constructor(props) {
        super(props);
        //this.popupModel = popupModel;
    }

    componentDidMount() {
        this.fetchAreaTree();
        // this.popupModel.triggerReload = this.rerenderInstancesData;
        // if (this.refs.instanceSearchForm) {
        //     this.refs.instanceSearchForm.getForm().validateFields(this.handleSearch);
        // }

    }

    componentWillUnmount() {
        //this.popupModel.clear();
    }

    handleSelectInstancesChange = (keys,rows) => {
        this.setState({

            selectedRows: rows,
        });
    };


    showModals=(modalName)=>{
        this.setState({
            modalName
        })
    }

    // renderModal=()=>{

    //     if(this.state.modalName == 'showDetail'){
    //         return <FlowDetailTab flowInstance={this.state.selectedRows[0]} onCancel={() => { this.setState({ modalName: ''}); }}/>;
    //     }

    //     return null;
    // }

     /**
	 * 查询左边的区域树
	 */
	fetchAreaTree = () => {
		http.post('/call/call.do', {
			bean: 'AreaServ',
			method: 'getAreaJsonTree',
			param: { areaId: this.state.areaId}
		}, {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(res => {
			const returnData = JSON.parse(res);
			if (returnData) {
				this.setState({
					renderAreaTree: returnData
				});
			}
			//this.rerenderMainGridData();
		}, res => {
			message.error('获取区域目录失败！');
			this.setState({
				loading: false,
				renderAreaTree: []
			});
			//this.rerenderMainGridData();
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

        this.state.formValues = values;
        if (this.refs.instanceList) {
            this.refs.instanceList.tryReloadDatatoPage(1);
        }
        //this.postGetInstancesData(values,this.state.pagination,{},this.state.sorter);
    }
    
   
    addHolidayModel = () => {
        if (this.state.selectedRows[0]) {
            const param = {
                processInstanceId: this.state.selectedRows[0].processInstanceId,
                areaId: this.state.selectedRows[0].areaId,
                systemCode: session.currentTendant.tenantCode
            };

            http.post('/call/call.do', {
                bean: 'FlowOperServ',
                method: 'addHolidayModel',//'qryWorkItemByCond',
                param: param
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    if(res == '"success"'){
                        message.success('新增节假日模板成功');
                        this.rerenderInstancesData();
                    } else {
                        message.error('新增节假日模板失败');
                    }
                }, res => {
                    message.error('新增节假日模板失败');
                    console.log('failed!!', res);
                });

        }

    }

    modHolidayModel = () => {
        if (this.state.selectedRows[0]) {
            const param = {
                processInstanceId: this.state.selectedRows[0].processInstanceId,
                areaId: this.state.selectedRows[0].areaId,
                systemCode: session.currentTendant.tenantCode
            };

            http.post('/call/call.do', {
                bean: 'FlowOperServ',
                method: 'modHolidayModel',//'qryWorkItemByCond',
                param: param
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    if(res == '"success"'){
                        message.success('修改节假日模板成功');
                        this.rerenderInstancesData();
                    } else {
                        message.error('修改节假日模板失败');
                    }
                }, res => {
                    message.error('修改节假日模板失败');
                    console.log('failed!!', res);
                });

        }
    }

    delHolidayModel = () => {
        if (this.state.selectedRows[0]) {
            const param = {
                processInstanceId: this.state.selectedRows[0].processInstanceId,
                areaId: this.state.selectedRows[0].areaId,
                systemCode: session.currentTendant.tenantCode
            };

            http.post('/call/call.do', {
                bean: 'FlowOperServ',
                method: 'delHolidayModel',//'qryWorkItemByCond',
                param: param
                

            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    if (res == '"success"') {
                        message.success('删除节假日模板成功');
                        this.rerenderInstancesData();
                    } else {
                        message.error('删除节假日模板失败');
                    }
                }, res => {
                    message.error('删除节假日模板失败');
                    console.log('failed!!', res);
                });

        }
    }


    rerenderInstancesData = () => {
        if(this.refs.instanceList){
            this.refs.instanceList.tryReloadData();
        }
    }

    /**
     * 选中环节目录执行事件
	 * @param selectedKeys
	 * @param e
	 */
	handleChooseTacheCatalog = (selectedKeys, e) => {
		if (selectedKeys && selectedKeys.length > 0) { 
            console.log('selectedKeys',selectedKeys[0]);  
            this.setState({
                areaId:selectedKeys[0]
             });
            this.loadData(this.state.current,this.state.pageSize,this.state.pagination);
        }
	}

    loadData = (current, pageSize, pagination) => {
        console.log('pagination',pageSize);
        const { formValues } = this.state;
        let param = Object.assign({}, formValues);
        param.pageSize = pagination.pageSize;
        param.pageIndex = current;
        param.areaId=this.state.areaId; 
        this.setState({
            pagination:pagination,
            pageSize:pageSize,
            current:current,
        });
        return http.post('/call/call.do', {
            bean: 'holidayServ',
            method: 'qryHolidayModelByAreaId',//'qryWorkItemByCond',
            param: param
        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
                    return {
                        data: {
                            rows: returnData.rows,
                            pagination: {
                                ...pagination,
                                total: returnData.total,
                                current,
                                pageSize
                            }
                        }
                    }
                }
                return { data: { rows: [], pagination } }

            }, res => res);

    }

    render() {
        const pagination = {
            pageSize: 10,
            current: 1,
            total: 0,
            showQuickJumper: true,
            onChange: ((current, pageSize, pagination) => {
            })
        };  
         return (
            <Layout className={`${PREFIX}`}  style={{height:"100%"}}>
                {/* <Collapse style={{float:left"}}>
                    <Panel> */}
                    <Sider className={`${cx('sider')}`} style={{height:"100%",borderRight:"1px solid #E8E8E8"}}>
                        <Card  style={{height:"100%"}}
                            title="目录"
                            bordered={false}
                        >
                            <Tree
                                showLine
                                defaultExpandedKeys={['1']}
                                expandedKeys={this.state.expandedKeys}
                                onExpand={(expandedKeys) => { console.log('expandedKeys', expandedKeys); this.setState({ expandedKeys });}}
                                onSelect={this.handleChooseTacheCatalog}
                                defaultSelectedKeys={[this.state.chosenTacheCatalogId]}
                                selectedKeys={[this.state.chosenTacheCatalogId]}
                                style={{ position: ''}}
                            >
                                {this.renderAreaTree(this.state.renderAreaTree)}
                            </Tree>
                        </Card>
                    </Sider>
                    {/* </Panel>
                </Collapse> */}
		        <Content className={`${cx('content')}`} style={{height: '100%',width: "100%"}}>
                   <div className={PREFIX} style={{height: '100%',width: "100%"}}>
                        
                        {/* {
                            this.renderModal()
                        } */}
                    </div>
                </Content>
	        </Layout>
        );
    }
}

HolidayManager.propTypes = {};

HolidayManager.defaultProps = {};

export default HolidayManager;
