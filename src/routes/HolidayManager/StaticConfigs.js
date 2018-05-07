import React, { Component } from 'react';
import moment from 'moment';
import {Icon} from 'antd';
import _ from 'lodash';

const renderdate = (arr,val)=>{
    const found =  _.find(arr,x=>x.value==val);
    return found?found.text:'';
}

const renderText = (arr,val)=>{
    const found =  _.find(arr,x=>x.value==val);
    return found?found.text:'';
}

const columns = [{
    title: '节假日规则',
    dataIndex: 'holidayRule',
    render:(value)=>{
      if(value.length>6){
        let newDate=value.substr(0,11);
        let firstDate=newDate.substr(0,5);
        let secondDate=newDate.substr(6);
        return moment(firstDate).format('M月D日')+' — '+moment(secondDate).format('M月D日');
     }else{
        let arr=value.split('-');
           let beginWeek = ""+new Number( arr[0] );
           let endWeek = ""+new Number( arr[1] );
           let retHolidayRule = "";
						switch(beginWeek){
							case "1":retHolidayRule+="周一";
							break;
							case "2":retHolidayRule+="周二";
							break;
							case "3":retHolidayRule+="周三";
							break;
							case "4":retHolidayRule+="周四";
							break;
							case "5":retHolidayRule+="周五";
							break;
							case "6":retHolidayRule+="周六";
							break;
							case "7":retHolidayRule+="周日";
							break;
						}
						retHolidayRule += " — ";
						switch(endWeek){
							case "1":retHolidayRule+="周一";
							break;
							case "2":retHolidayRule+="周二";
							break;
							case "3":retHolidayRule+="周三";
							break;
							case "4":retHolidayRule+="周四";
							break;
							case "5":retHolidayRule+="周五";
							break;
							case "6":retHolidayRule+="周六";
							break;
							case "7":retHolidayRule+="周日";
							break;
						}
						return retHolidayRule;
     }
    },
    sorter: true,
    width:140,
    metaFooter:true
  }, 
  {
    title: '类型',
    dataIndex: 'holidayRule',
    render:(value)=>{
      if(value.split(" ").length>1){
        return '部分休息';
      }else{
        return '休息';
      }
    },
    sorter: true,
    width:140,
    metaFooter:true
  }, {
    title: '流程实例名称',
    dataIndex: 'holidayName',
    width:120,
    metaHeader:true
  },
  {
    title: '备注',
    dataIndex: 'comments',
    width:150,
    footer:true
  }, {
    title: '生效时间',
    dataIndex: 'effDate',
    render: val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    width:150,
    metaContent:true
  }, {
    title: '失效时间', 
    dataIndex: 'expDate',
    render: val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    width:150,
    metaContent:true
  }];
export {columns}