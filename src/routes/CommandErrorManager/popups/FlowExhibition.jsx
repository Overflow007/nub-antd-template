import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Modal } from 'antd';
import popupModel from '../models/FlowInstanceModel';
import FlowExhibitionG6 from '../../../components/FlowExhibitionG6/FlowExhibitionG6';

@observer
class FlowExhibition extends Component {
    constructor(props) {
        super(props);
        this.popupModel = popupModel;
        
    }
    


    render(){
        //this.props.flowInstance为当前选择的流程实例
        return ( 
            <FlowExhibitionG6 flowInstance={this.props.flowInstance}></FlowExhibitionG6>
        );
    }

}

export default FlowExhibition;