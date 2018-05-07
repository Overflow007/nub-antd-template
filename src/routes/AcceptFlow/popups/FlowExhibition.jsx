import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Modal } from 'antd';
import popupModel from '../models/FlowInstanceModel';
import FlowExhibitionG6 from '../../../components/FlowExhibitionG6/FlowExhibitionG6.1';

@observer
class FlowExhibition extends Component {
    constructor(props) {
        super(props);
        this.popupModel = popupModel;
        
    }
    


    render(){
        
        return ( <Modal
            title="流程定义图"
            mask={true}
            width={'90%'}
            maskClosable={true}
            footer={null}
            onCancel={this.props.onCancel}
            visible={true}
          >
            <FlowExhibitionG6 processDefineCode={this.props.processDefineCode}></FlowExhibitionG6>
          </Modal>);
    }

}

export default FlowExhibition;