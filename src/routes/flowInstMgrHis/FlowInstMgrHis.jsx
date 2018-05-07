import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import { Select } from 'antd';
import utils from 'common/utils';
import { Table, Modal, Button, Popover, Icon, message } from 'antd';
import moment from 'moment';
import { extractPath } from 'common/path';
import styles from './FlowInstMgrHis.scss';


const PREFIX = 'flow-flowerrormgrhis';

const cx = utils.classnames(PREFIX,styles);

/**
 * 流程实例管理（历史）
 */
@observer
class FlowInstMgrHis extends Component {

    state = {}

	render() {
		let url = '';
		if(location.hostname == 'localhost' || location.hostname == '127.0.0.1' || location.hostname == ''){
			if(location.pathname.startsWith('/' + extractPath)){
				url = '/' + extractPath;
			} else {
				url = 'http://101.132.66.16:9079/uos-manager';
			}
		} else {
			url = '/' + extractPath;
		}
		url += '/view/flow/instmanager/flowInstManagerHis.html';

		return (
            <div style={{height:'100%'}}>
                <iframe scrolling={"no"} frameBorder={"0"} src={`${url}`} style={{width:'100%',height:'99%'}}>
                </iframe>
            </div>
		);
	}

}

export default FlowInstMgrHis;