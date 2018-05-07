import React, { Component } from 'react';
import { Modal, Tabs } from 'antd';
import PropTypes from 'prop-types';
import utils from 'common/utils';
import FlowExhibition from './FlowExhibition';
import FlowMsg from './FlowMsg';
import FlowWorkItems from './FlowWorkItems';
import FlowInsRet from './FlowInsRet';
import styles from './FlowDetailTab.scss';

const TabPane = Tabs.TabPane;
const PREFIX = 'flow-detail-tab';
const cx = utils.classnames(PREFIX, styles);

class FlowDetailTab extends Component {

    onCancel = () => {
        if (this.props.onCancel){
            this.props.onCancel();
        }
    }

    render = () => {
        const { flowInstance, onCancel } = this.props;
        return (
            <Modal className={`${PREFIX}`} title={flowInstance.name} footer={null} visible={true} width="80%" onCancel={onCancel}>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="流程展示" key="1"><FlowExhibition flowInstance={flowInstance} /></TabPane>
                    <TabPane tab="流程信息" key="2"><FlowMsg processInstance={flowInstance} /></TabPane>
                    <TabPane tab="查看工作项" key="3"><FlowWorkItems flowInstance={flowInstance} /></TabPane>
                    <TabPane tab="回填信息" key="4"><FlowInsRet flowInstanceId={flowInstance.processInstanceId}/></TabPane>
                </Tabs>
            </Modal>
        );
    }
}

/**
 * 参数类型限制
 * flowInstance 流程实例
 */
FlowDetailTab.propTypes = {
    flowInstance: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
}

/**
 * 参数默认值
 */
FlowDetailTab.defaultProps = {

}


export default FlowDetailTab;