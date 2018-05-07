import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import moment from 'moment';
import { Form, DatePicker, LocaleProvider,Row, Col , Button,Input,TreeSelect } from 'antd';
import session from 'models/Session';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

const treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    label: 'Child Node1',
    value: '0-0-1',
    key: '0-0-1',
  }, {
    label: 'Child Node2',
    value: '0-0-2',
    key: '0-0-2',
  }],
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
}];



class TimeRelatedForm extends Component {
    state={
      linkData:[],
      addressData:[],
      Elments:[],
      startValue: new Date(),
      endValue: new Date(),
      nowValue:new Date(),
      startJudge:false,
      endJudge:false,
      showState:"我的申请"
    };
  constructor(props) {
    super(props);

}

//  changeStates=()=>{
//   alet('1');
//   this.props.changeStateValue(e);
//  }

  findMsg=()=>{
       let startDate ='';
       if(this.state.startJudge&&(this.state.startValue!=null&this.state.startValue!='')){
       startDate=moment(this.state.startValue._d).format('YYYY-MM-DD HH:mm:ss');
      }
       let endDate ='';
       if(this.state.endJudge&&(this.state.endValue!=null&this.state.endValue!='')){
       endDate= moment(this.state.endValue._d).format('YYYY-MM-DD HH:mm:ss');
       }
        var param={
          processInstanceId:this.props.form.getFieldsValue().flowId==undefined?'':this.props.form.getFieldsValue().flowId,
          startDate:startDate,
          endDate:endDate,
          state:this.props.superState,
          pageIndex:1,
          pageSize:10,
          sortColumn:"assignedDate",
          sortOrder:"asc",
          tacheId:this.props.form.getFieldsValue().Link==undefined?'':this.props.form.getFieldsValue().Link,
         // areaId:this.props.form.getFieldsValue().Area,地址这个参数，接口没有这个参数，暂时隐藏
          systemCode:session.currentTendant.tenantCode
        }
          http.post('/call/call.do',{
            bean: 'FlowInstServ',
            method: 'qryWorkItemByCond',
            param: param
        },{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
          const returnData = JSON.parse(res);
            if(returnData){
             console.log('>>>>param',param); 
              this.props.getDataMsg(returnData,param);
            }
        },res => {
      });


  }

  handleSubmit = (e) => {
    e.preventDefault();
    //console.log('表单值：', this.props.form.getFieldsValue());
  }
  
  onAddress=()=>{
    http.post('/call/call.do',{
      bean: 'AreaServ',
      method: 'getAreaJsonTree',
      param: {"areaId":"1"}
    },{
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }).then(res => {
      const returnData = JSON.parse(res);
      console.log('returnData',returnData);
      if(returnData){
      let Elements = [] // 保存渲染以后 JSX 的数组
        for (let msg of returnData) {
          let obj = {
              label: '' + msg.text + '',
              value: '' + msg.id + '',
              key: '' + msg.id + '',
              children:[]
          };
          if(msg.children){
            for(let date of msg.children) {
                  let obj1= {
                      label: '' + date.text + '',
                      value: '' + date.id + '',
                      key: '' + date.id + '',
                      children:[]
                  }
                  if(date.children){ 
                    for (let date2 of date.children) {
                        let obj2 = {
                            label: '' + date2.text + '',
                            value: '' + date2.id + '',
                            key: '' + date2.id + '',
                            children:[]
                        }
                        if(date2.children){ 
                          for (let date3 of date2.children) {
                              let obj3 = {
                                  label: '' + date3.text + '',
                                  value: '' + date3.id + '',
                                  key: '' + date3.id + '',
                                  children:[]
                              }
                              if(date3.children){ 
                                for (let date4 of date3.children) {
                                    let obj4 = {
                                        label: '' + date4.text + '',
                                        value: '' + date4.id + '',
                                        key: '' + date4.id + '',
                                        children:[]
                                    }
                                    if(date4.children){ 
                                      for (let date5 of date4.children) {
                                          let obj5 = {
                                              label: '' + date5.text + '',
                                              value: '' + date5.id + '',
                                              key: '' + date5.id + '',
                                              children:[]
                                          }
                                          if(date5.children){ 
                                            for (let date6 of date5.children) {
                                                let obj6 = {
                                                    label: '' + date6.text + '',
                                                    value: '' + date6.id + '',
                                                    key: '' + date6.id + '',
                                                    children:[]
                                                }
                                                if(date6.children){ 
                                                  for (let date7 of date6.children) {
                                                      let obj7 = {
                                                          label: '' + date7.text + '',
                                                          value: '' + date7.id + '',
                                                          key: '' + date7.id + '',
                                                          children:[]
                                                      }
                                                      obj6.children.push(obj7)
                                                  }
                                              }
                                                obj5.children.push(obj6)
                                            }
                                        }
                                          obj4.children.push(obj5)
                                      }
                                  }
                                    obj3.children.push(obj4)
                                }
                            }
                              obj2.children.push(obj3)
                          }
                      }
                        obj1.children.push(obj2)
                    }
                }
                  obj.children.push(obj1)
              }
            }
          Elements.push(obj)
      }
           console.log('Elements',Elements);
           this.setState({
            addressData:Elements
          });
        }
      })
}
onLink=(tacheCatalogId,state)=>{
  http.post('/call/call.do',{
    bean: 'TacheServ',
    method: 'qryTacheCatalogTree',
    param: {"systemCode":"ITS"}
  },{
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }).then(res => {
    const returnData = JSON.parse(res);
    console.log('TimeRelateForm',returnData);
    if(returnData){
    let Elements = [] // 保存渲染以后 JSX 的数组
      for (let msg of returnData) {
        let isJudge='false';
        if(msg.children){
          isJudge='true';
        }              
        Elements.push({
            label: '' + msg.text + '',
            value: '' + msg.id + '',
            key: '' + msg.id + '',
            //disabled:msg.children?true:false,
          })
        }
        // console.log('Elements',Elements);
         this.setState({
          linkData:Elements
        });
      }
    })
}
onSelect=(a,b,c)=>{
  console.log('this',this);
}

  // onLink=(tacheCatalogId,state)=>{
  //     http.post('/call/call.do',{
  //       bean: 'TacheServ',
  //       method: 'qryTacheCatalogTree',
  //       param: {"systemCode":"ITS"}
  //     },{
  //       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  //     }).then(res => {
  //       const returnData = JSON.parse(res);
  //       console.log('returnData',returnData);
  //       if(returnData){
  //       let Elements = [] // 保存渲染以后 JSX 的数组
  //         for (let msg of returnData) {
  //           let isJudge='false';
  //           if(msg.children){
  //             isJudge='true';
  //           }              
  //           let obj = {
  //               label: '' + msg.text + '',
  //               value: '' + msg.id + '',
  //               key: '' + msg.id + '',
  //               disabled:msg.children?true:false,
  //               //onClick:this.onSelect(msg.text,msg.id,msg.id),
  //               children:[]
  //           };
  //           if(msg.children){
  //             for(let date of msg.children) {
  //                   let obj1= {
  //                       label: '' + date.text + '',
  //                       value: '' + date.id + '',
  //                       key: '' + date.id + '',
  //                       disabled:date.children?true:false,
  //                       //onClick:this.onSelect(date.text,date.id,date.id),
  //                       children:[]
  //                   }
  //                   if(date.children){ 
  //                     for (let date2 of date.children) {
  //                         let obj2 = {
  //                             label: '' + date2.text + '',
  //                             value: '' + date2.id + '',
  //                             key: '' + date2.id + '',
  //                             disabled:date2.children?true:false,
  //                            // onClick:this.onSelect(date2.text,date2.id,date2.id),  
  //                             children:[]
  //                         }
  //                         if(date2.children){ 
  //                           for (let date3 of date2.children) {
  //                               let obj3 = {
  //                                   label: '' + date3.text + '',
  //                                   value: '' + date3.id + '',
  //                                   key: '' + date3.id + '',
  //                                   disabled:date3.children?true:false,
  //                                   children:[]
  //                               }
  //                               if(date3.children){ 
  //                                 for (let date4 of date3.children) {
  //                                     let obj4 = {
  //                                         label: '' + date4.text + '',
  //                                         value: '' + date4.id + '',
  //                                         key: '' + date4.id + '',
  //                                         disabled:date4.children?true:false,
  //                                         children:[]
  //                                     }
  //                                     if(date4.children){ 
  //                                       for (let date5 of date4.children) {
  //                                           let obj5 = {
  //                                               label: '' + date5.text + '',
  //                                               value: '' + date5.id + '',
  //                                               key: '' + date5.id + '',
  //                                               disabled:date5.children?true:false,
  //                                               children:[]
  //                                           }
  //                                           if(date5.children){ 
  //                                             for (let date6 of date5.children) {
  //                                                 let obj6 = {
  //                                                     label: '' + date6.text + '',
  //                                                     value: '' + date6.id + '',
  //                                                     key: '' + date6.id + '',
  //                                                     disabled:date6.children?true:false,
  //                                                     children:[]
  //                                                 }
  //                                                 if(date6.children){ 
  //                                                   for (let date7 of date6.children) {
  //                                                       let obj7 = {
  //                                                           label: '' + date7.text + '',
  //                                                           value: '' + date7.id + '',
  //                                                           key: '' + date7.id + '',
  //                                                           disabled:date7.children?true:false,
  //                                                           children:[]
  //                                                       }
  //                                                       obj6.children.push(obj7)
  //                                                   }
  //                                               }
  //                                                 obj5.children.push(obj6)
  //                                             }
  //                                         }
  //                                           obj4.children.push(obj5)
  //                                       }
  //                                   }
  //                                     obj3.children.push(obj4)
  //                                 }
  //                             }
  //                               obj2.children.push(obj3)
  //                           }
  //                       }
  //                         obj1.children.push(obj2)
  //                     }
  //                 }
  //                   obj.children.push(obj1)
  //               }
  //             }
  //           Elements.push(obj)
  //       }
  //            console.log('Elements',Elements);
  //            this.setState({
  //             linkData:Elements
  //           });
  //         }
  //       })
  // }
 
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue; 
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() >= this.state.nowValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= this.state.nowValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
   this.setState({
    startJudge:true,
   });
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.setState({
      endJudge:true
     });
    this.onChange('endValue', value);
  }

  handleOpenChange = () => {
    if(this.state.endValue==null & this.state.startValue==null){
      this.setState({
        endValue:new Date(),
        startValue:new Date()
      });
    }
   
  }

  render() {
    if(this.props.superState){
      if(this.props.superState=='1'){
        this.state.showState='我的申请'
      }else if(this.props.superState=='2'){
        this.state.showState='待我处理'
      }else if(this.props.superState=='4'){
        this.state.showState='我的完成'
      }else{
        this.state.showState='我的申请'
      }
    }
    const { getFieldProps,getFieldDecorator} = this.props.form;
    const dateFormat = 'YYYY-MM-DD HH:mm:SS';
    const formItemLayout= {
      labelCol: {
        xs: { span: 20 }
      },
    }
    return (
      <Form onSubmit={this.handleSubmit}>
      <Row type="flex"  justify="space-between">
      <Col col="1" style={{float:'left'}}>
      <h3>{this.state.showState}</h3>
      </Col>
      <Col col="4">
      <FormItem
      {...formItemLayout}
          // label="环节"
        >
          <TreeSelect
                  style={{ width: 150}}
                  dropdownStyle={{ maxHeight: 800}}
                  treeData={this.state.linkData}
                  placeholder="环节"//设置默认值
                  treeDefaultExpandAll
                  onClick={this.onLink}
                  onSelect={this.onSelect}
                  {...getFieldProps('Link')}
                />
        </FormItem>
      </Col>
      <Col col="4">
      <FormItem
      {...formItemLayout}
          // label="区域"
        >
          <TreeSelect
                  style={{ width: 150 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.addressData}
                  placeholder="区域"//设置默认值
                  treeDefaultExpandAll
                  onClick={this.onAddress}
                  {...getFieldProps('Area')}
                />
        </FormItem>
      </Col>
      <Col col="4">
        <FormItem
        {...formItemLayout}
          // label="开始时间"
          >
           {getFieldDecorator("start",{
                // initialValue:moment('YYYY-MM-DD', dateFormat)
                })(
                  <DatePicker showTime   disabledDate={this.disabledStartDate}    onChange={this.onStartChange}
                     placeholder="开始时间" onOpenChange={this.handleOpenChange}    format={dateFormat} />
          )}
        </FormItem>
      </Col>
      <Col  col="4">  
      <FormItem
      {...formItemLayout}
          // label="结束时间"
        >
           {getFieldDecorator("end",{
                // initialValue:moment('YYYY-MM-DD', dateFormat)
                })(
                  <DatePicker showTime   onOpenChange={this.handleOpenChange}  disabledDate={this.disabledEndDate}     onChange={this.onEndChange}
                       placeholder="结束时间"   format={dateFormat} />
          )}
        </FormItem>
      </Col>
      <Col col="4" >
        <FormItem
        {...formItemLayout}
        >
            <Input   placeholder="流程实例ID" {...getFieldProps('flowId')}/>
        </FormItem>{/*placeholder=‘’设置默认值*/}
      </Col>
        <FormItem>
          <Button type="primary" htmlType="submit" onClick={this.findMsg}>查看</Button>
        </FormItem>
        </Row>
      </Form>
    
    );
  }
}



export default Form.create()(TimeRelatedForm)
