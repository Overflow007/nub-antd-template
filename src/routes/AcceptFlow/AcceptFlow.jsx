import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import session from 'models/Session';
import {Select, Card, Icon, Avatar, Table, Modal, Button, Popover, message, Divider } from 'antd';
import DynamicSearchForm from 'components/DynamicSearchForm';
import FlowExhibition from './popups/FlowExhibition';
import FlowMsg from './popups/FlowMsg';
import { formConfig } from './StaticConfigs';
import moment from 'moment';
import { extractPath } from 'common/path';
import styles from './AcceptFlow.scss';

const { Meta } = Card;
const PREFIX = 'flow-acceptflow';

const cx = utils.classnames(PREFIX, styles);

/**
 * 业务受理
 */
@observer
class AcceptFlow extends Component {

	constructor(props) {
		super(props);
	}
	state = {
		flowData: [],
		formValues: {},
		modalName: '',
		loading: false,
		packageId : null,
		packageDefineCode : null,
		packageDefineId : null,
		processDefineName : null
		
	}

	componentDidMount() {
		this.fetchFlowData();
	}
	componentDidUpdate(){

	}
	componentWillUpdate(){

	}
	fetchFlowData() {
		this.setState({
			loading: true
		});
		/* $.callSyn("FlowServ", "queryPackageCatalogByAreaIdAndSystemCode", {systemCode:session["tenant"]}); */
		http.post('/call/call.do', {
			bean: 'FlowServ',
			method: 'queryPackageCatalogByAreaIdAndSystemCode',
			param: { systemCode: "FLOWPLAT" }
		}, {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}).then(res => {
				const returnData = JSON.parse(res);
				if (returnData) {
					this.setState({
						flowData: returnData
					});
				}
				if(returnData == ""){
					this.setState({
						flowData: [{ id: 1012, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1013, text: "流程设置业务", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1012, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1013, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }]
					});
				}
				this.setState({
					loading: false
				});

				//console.log('success!!',res);
			}, res => {
				this.setState({
					loading: false
				});
				this.setState({
					flowData: [{ id: 1012, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1013, text: "流程设置业务", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1012, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1013, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }]
				});

			});
	}

	renderCars = (flowData) => {
		if (flowData == null || flowData.length < 1) return null;

		return flowData.map(d => {
			return (
				<Card
					style={{ width: '20%', height: '30%', float: 'left' }}
					cover={<Icon type="tool" />}
					actions={[<Button onClick={() => {this.showModal('acceptService',d.id,d.text  );}}>受理业务</Button>, <Button onClick={() => {this.showModal('flowexhibition',d.id);}}> 流程定义图</Button>]}
					hoverable="ture"
				>
					<Meta title={`${d.text}`} />

				</Card>
			)
		});
	}
	renderModal=()=>{
        if(this.state.modalName=='acceptService'){
			console.log(this.state);
            return (<FlowMsg packageDefineId = {this.state.packageDefineId} processDefineName = {this.state.processDefineName} onCancel={()=>{
                this.setState({
                    loading: false,
					modalName:'',
					packageId : null,
					packageDefineCode : null,
					packageDefineId : null,
					processDefineName : null
                })
            }} />)
        }

        if(this.state.modalName=='flowexhibition'){
			console.log(this.state);
			return (<FlowExhibition processDefineCode={this.state.packageDefineCode} onCancel={()=>{
				this.setState({
					loading: false,
					modalName:'',
					packageId : null,
					packageDefineCode : null,
					packageDefineId : null
				})
			}} />)
			
		}
		return null;
    }
	showModal = (modalName,packageId,processDefineName) => {

		http.post('/call/call.do', {
			bean: 'FormManagerServ',
			method: 'qryProcessPackageId',
			param: { 'packageId': packageId }
		}, {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then(processResult => {
			processResult = JSON.parse(processResult);
			if(processResult.length > 0){

				let packageDefineId = processResult[0].packageDefineId;
				let packageDefineCode = processResult[0].packageDefineCode;
				this.setState({
					modalName: modalName,
					packageId : packageId,
					packageDefineCode: packageDefineCode,
					packageDefineId : packageDefineId,
					processDefineName : processDefineName
				  });
			}else{
				message.warn("所选流程模板没有激活状态的版本");
			}

		}, res => {
			this.setState({
				loading: false,
				modalName:'',
				packageId : null
			});
			message.warn("所选流程模板没有激活状态的版本");
		});	
	}

	handleSearch = (err, values) => {
        //console.log('submit',err, values);
        if (err) return;
        this.setState({
            formValues: values
        });
        this.postGetServiceData(values);
	}
	 
	postGetServiceData = (formValues) => {

        let param = Object.assign({}, formValues);

        param.systemCode = 'FLOWPLAT';
        this.setState({
            loading: true
		});
		
        http.post('/call/call.do', {
            bean: 'FlowServ',
            method: 'queryPackageCatalogByAreaIdAndSystemCode',
            param: param
        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
                    this.setState({
                        flowData: returnData,
                    });
                    console.log(returnData, this.state.flowData)
                }
				if(returnData == ""){
					this.setState({
						flowData: [{ id: 1012, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1013, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1012, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1013, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }]
					});
				}
                this.setState({
                    loading: false
                });
            }, res => {
                const returnData = [{ id: 1012, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1013, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 },{ id: 1012, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }, { id: 1013, text: "上海公安流程", packageType: "COMP", parentId: 1011, type: 2 }]
                if (returnData) {
                    this.setState({
                        flowData: returnData,
                    });
                }
                this.setState({
                    loading: false
                });
                console.log('failed!!', res);
            });
    }

	render() {
		return (
			<div className={'flow-widget'} style={{ height: '100%', width: '100%' }}>
				<DynamicSearchForm  formConfig={formConfig} onSubmit={this.handleSearch} />
				<Divider/>
				<div style={{ height: '100%', position: 'relative', top: '0px', left: '2px', bottom: '0px', right: '0px', overflow: 'auto' }}>
					{this.renderCars(this.state.flowData)}
				</div>

				{
					this.renderModal()
				}
				
			</div>
		);
	}

}

export default AcceptFlow;