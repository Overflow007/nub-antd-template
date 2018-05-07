import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import { Table , Modal, Button, Popover,Icon,Select} from 'antd';
import moment from 'moment';
// import popupModel from './models/FlowInstanceModel'
// import FlowExhibition from './Popups/FlowExhibition'
// import WorkitemOperations from './Popups/WorkitemOperations'
// import DynamicSearchForm from 'components/DynamicSearchForm';
// import StandardTable from 'components/StandardTable';
// import {columns,workitemColumns,formConfig} from './StaticConfigs'
import './TemplateMgr.scss';

const PREFIX = 'template-mgr';

//console.log('columns',columns);

// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');

const cx = utils.classnames(PREFIX);

@observer
class TemplateMgr extends Component {

    state = {
        // showOperations:false,
        // expandWorkitem:false,
        // selectedRows: [],
        // formValues: {},
        // pagination:{
        //     "showSizeChanger":true,
        //     "showQuickJumper":true,
        //     "current":1,
        //     "pageSize":10,
        //     total:0
        // },
        // instanceGridResult:{"total":0,"rows":[]},
         
        // workItems:{"total":2,
        // "rows":[{"workItemId":301609,"processDefineId":"106","processInstanceId":2009,"processInstanceName":"API申请","tacheId":28,"name":"API申请","activityDefinitionId":"A22842-48-4041-990-18085","activityInstanceId":503409,"state":4,"priority":1,"participantId":-1,"participantPositionId":-1,"organizationId":-1,"assignedDate":"2018-04-02 11:04:20","startedDate":"2018-04-02 11:04:24","completedDate":"2018-04-02 11:04:25","dueDate":"2018-04-02 11:04:20","areaId":"1","tacheCode":"ITS_APISQ","subFlowCount":0,"finishSubFlowCount":0,"isAuto":0,"direction":"1","areaName":"默认"},{"workItemId":301709,"processDefineId":"106","processInstanceId":2009,"processInstanceName":"API申请","tacheId":29,"name":"API审核","activityDefinitionId":"A51371-52-71225-141-57100","activityInstanceId":503509,"state":1,"priority":1,"participantId":-1,"participantPositionId":-1,"organizationId":-1,"assignedDate":"2018-04-02 11:04:25","startedDate":"2018-04-02 11:04:25","completedDate":"2018-04-02 11:04:21","dueDate":"2018-04-02 11:04:21","areaId":"1","tacheCode":"ITS_APISH","subFlowCount":0,"finishSubFlowCount":0,"isAuto":0,"direction":"1","areaName":"默认"}]
        // }
      };

    constructor(props) {
        super(props);
        // this.popupModel = popupModel;
    }

  

  render() {
    
    return (
        <div style={{'padding':'15px'}}>
      <div className={PREFIX}>
         

      </div>
      </div>
    );
  }
}

TemplateMgr.propTypes = {};

TemplateMgr.defaultProps = {};

export default TemplateMgr;
