import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, message } from 'antd';
import http from 'common/http';
import session from 'models/Session';
import StandardTable from 'components/StandardTable';

/**
 * 流程实例回填信息
 */
class FlowInsRet extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            selectedRetRowKeys: [],
            selectedRetDetailRowKeys: [],
            selectedRetDetailRows: [],
        }
    }

    componentDidMount = () => {

    }

    /**
     * 查看回填详情附件
     */
    showFile = () => {
        
        const { selectedRetDetailRowKeys, selectedRetDetailRows } = this.state;
        if(selectedRetDetailRows.length == 0) {
            message.warning('请选择回填详情');
            return;
        }
        
        const selectedRetDetailRow = this.state.selectedRetDetailRows[0];
        const { elementCode, retValue } = selectedRetDetailRow;
        if (elementCode != 'POP_UPLOAD_FILE' || !retValue) {
            message.warning('此回填实例没有附件');
            return;
        }
        
        let left = (window.screen.width - 620)/2;  
        let top = (window.screen.height - 400)/2;
        let url = 'fileUploadServlet?docId='+retValue+'&processinstanceId='+this.props.flowInstanceId;
        window.open(url, 'AfficDoc', 'toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no, height=400, width=620, top='+top+', left='+left);

    }

    /****************************** 流程实例回填列表 BEGIN ******************************/
    /**
     * 加载流程实例回填数据
     * 
     * @returns promise实例
     */
    loadFlowInsRetData = (current, pageSize, pagination, filters, sorter) => {
        const param = {
            processinstanceId: this.props.flowInstanceId,
            systemCode: session.currentTendant.tenantCode,
        }

        const promise = http.post('/call/call.do', { bean: 'FormManagerServ', method: 'qryPageRetInst', param }, { 'Content-Type': 'application/x-www-form-urlencoded'})
        .then(res => {
            const resData = JSON.parse(res);
            if(resData.length > 0){
                return { data: { rows: resData, pagination: false }, selectedRowKeys: [resData[0].acceptNo]};
            } else {
                Modal.warning({ title: '提示', content: '没有数据' });
            }
            return { data: { rows: [], pagination: false }, selectedRowKeys: [] };
        }, err => {
            console.error('failed!!!', err);
        });

        return promise;
    }

    /**
     * 流程实例回填列表 - 行选择改变时触发
     */
    handleRetSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRetRowKeys: selectedRowKeys }, () => {
            this.refs.flowInsRetDetailTable.tryReloadData(1);
        });
    }
    /******************************* 流程实例回填列表 END *******************************/


    /****************************** 回填详情列表 BEGIN *******************************/
    
    handleDetailTableChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRetDetailRowKeys: selectedRowKeys, selectedRetDetailRows: selectedRows });
    }

    /**
     * 加载回填详情数据
     */
    loadRetDetailData = (current, pageSize, pagination, filters, sorter) => {
        
        const emptyData = { data: { rows: [], pagination: { pageSize: 30 } }, selectedRowKeys: [] };
        
        // 1. 没有回填数据时，表格加载空数据
        if(this.state.selectedRetRowKeys.length == 0){
            return new Promise(function(resolve, reject) {
                resolve(emptyData);
            });
        }

        // 2. 存在选中回填数据时，异步查询回填详情数据
        const param = {
            acceptNo: this.state.selectedRetRowKeys[0],
            systemCode: session.currentTendant.tenantCode,
            processinstanceId: this.props.flowInstanceId
        }

        const promise = http.post('/call/call.do', { bean: 'FormManagerServ', method: 'qryPageRetInstDetail', param }, { 'Content-Type': 'application/x-www-form-urlencoded'})
        .then(res => {
            const resData = JSON.parse(res);
            if(resData.rows.length > 0){
                const firstRetDetail = resData.rows[0];
                return { data: { rows: resData.rows, pagination: { pageSize: 30 } }, selectedRowKeys: [resData.rows[0].retValue]};
            } 
            
            return emptyData;
        }, err => {
            message.error('查询回填详情数据失败');
            console.error('failed!!!', err);
        });

        return promise;
    }
    /****************************** 回填详情列表 END *******************************/

    render = () => {
        return (
            <div>
                {/* 流程实例回填信息列表 BEGIN */}
                <div style={{float:'left',width:'calc(40% - 1px)',height:'100%', paddingRight:'15px'}}>
                    
                    <StandardTable 
                        bordered
                        style={{ marginTop: '52px' }}
                        ref={"flowInsRetTable"} 
                        rowKey={'acceptNo'} 
                        columns={flowInsRetColumns}
                        data={{ rows:[], pagination: false }}
                        loadData={this.loadFlowInsRetData}
                        clicktoSelect={true}
                        rowSelection={{ type: 'single' }}
                        onSelectChange={this.handleRetSelectChange}
                        scroll={{ x: true, y: (document.querySelector('body').clientHeight-381) }}
                    />
                    
                </div>
                {/* 流程实例回填信息列表 END */}

                {/* 流程实例回填信息详情列表 BEGIN */}
                <div style={{float:'left', width:'60%', height:'100%', borderLeft: '1px solid #e6e6e6' }}>
                    <Button type="primary" onClick={this.showFile} style={{ margin: '10px' }}>查看附件</Button>
                    <StandardTable 
                        bordered
                        style={{ margin: '0 10px' }}
                        ref={"flowInsRetDetailTable"} 
                        rowKey={'retInstId'} 
                        data={{ rows:[], pagination: { pageSize: 30 } }}
                        onSelectChange={this.handleDetailTableChange}
                        columns={flowInsRetDetailColumns}
                        loadData={this.loadRetDetailData}
                        clicktoSelect={true}
                        rowSelection={{ type: 'single' }}
                        scroll={{ x: true, y: (document.querySelector('body').clientHeight-380) }}
                    />
                </div>
                {/* 流程实例回填信息详情列表 BEGIN */}
            </div>
        );
    }
}

/**
 * 流程实例回填列表 - 列配置
 */
const flowInsRetColumns = [
    { title: '受理编号', dataIndex: 'acceptNo', width: '120px'},
    { title: '功能', dataIndex: 'funcName', width: '100px' },
    { title: '环节', dataIndex: 'tacheName', width: '120px' },
    { title: '工作项', dataIndex: 'workitemId', width: '120px' }
];

/**
 * 流程实例回填详情列表 - 列配置
 */
const flowInsRetDetailColumns = [
    { title: '回填项名称', dataIndex: 'retName', width: 120 },
    { title: '回填值', dataIndex: 'retValue', width: 150 },
    { title: '回填值名称', dataIndex: 'retValueName', width: 120 },
    { title: '流程参数', dataIndex: 'proinsparamName', width: 120 },
    { title: '回填日期', dataIndex: 'createDate', width: 150 },
    { title: '回填项编码', dataIndex: 'retCode', width: 120 },
    { title: '元素名称', dataIndex: 'elementName', width: 120 },
    { title: '流程实例', dataIndex: 'processinstanceId', width: 120 },
    { title: '功能', dataIndex: 'funcName', width: 120 },
    { title: '环节', dataIndex: 'tacheName', width: 120 },
    { title: '工作项', dataIndex: 'workitemId', width: 120 },
    { title: '受理编号', dataIndex: 'acceptNo', width: 120 },
    { title: '回填实例ID', dataIndex: 'retInstId', width: 120 },
];

FlowInsRet.propTypes = {
    flowInstanceId: PropTypes.any.isRequired,
    flowInstanceId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

export default FlowInsRet;