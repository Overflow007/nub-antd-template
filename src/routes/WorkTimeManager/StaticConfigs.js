import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

const workTimeCols = [
    { title: '名称', dataIndex: 'workTimeName', width: 120 },
    { title: '工作时间段', dataIndex: 'workTimeRule', width: 200 },
    { title: '生效时间', dataIndex: 'effDate', width: 200 },
    { title: '失效时间', dataIndex: 'expDate', width: 200 },
    { title: '备注', dataIndex: 'comments', width: 200 }
];

export { workTimeCols};