import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Modal } from 'antd';
import popupModel from '../models/FlowInstanceModel'

@observer
class WorkitemOperations extends Component {
    constructor(props) {
        super(props);
        this.popupModel = popupModel;
        
    }


    render(){
        //this.props.flowInstance为当前选择的流程实例
        return ( <div style={{position:'fixed',top:'0px',left:'0px',display:(this.popupModel.showWorkitemOperations?'block':'none')}}>
        <div id={`flow-instance-mgr-workitem_operations`} className={"ant-popover ant-popover-placement-bottom"} style={{left: this.popupModel.workitemOperationsLeft, top: this.popupModel.workitemOperationsTop}}>
            <div className={"ant-popover-content"}>
                <div className={"ant-popover-arrow"}>
                </div>
                <div className={"ant-popover-inner"}>
                    <div>
                        <div className={"ant-popover-inner-content"}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </div>);
    }

}

export default WorkitemOperations;