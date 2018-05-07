import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import {Input,Row, Col,Switch,Radio,Icon,Form,Button,Select,Tree,Modal,message} from 'antd';
import http from 'common/http';
import utils from 'common/utils';
import StandardTable from 'components/StandardTable';
import AsynchronousLinkSelectTree from 'components/AsynchronousLinkSelectTree';
import { columns, workitemColumns, formConfig } from '../../StaticConfigs'


const PREFIX = 'flow-flowDefModal';
const cx = utils.classnames(PREFIX);

const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;


  



class DispatchRule extends Component {
    constructor(props) {
        super(props);
        // this.popupModel = popupModel;
        this.state={
            loading:true,
            selectedRows:[],
            data:[],
            selectedKeys: [],
            executorModal:true,
            treeData: []
        }

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
        })
        
      }
    
    loadData=(current,pageSize,pagination, filters, sorter)=>{

       return http.post('/call/call.do', {
            bean: 'FlowServ',
            method: 'qryDispatchRuleByCond',//'qryWorkItemByCond',
            param: {"systemCode":"ITS","page":1,"pageSize":15}
        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const returnData = JSON.parse(res);
                if (returnData) {
                    returnData.pagination=false;
                    if(returnData.rows.length == 0){
                        return {data:returnData,selectedRowKeys:[]}
                    }else{
                        return {data:returnData,selectedRowKeys:[returnData.rows[0].ruleId]}
                    }
                }
                return {data:{rows:[],pagination: false},selectedRowKeys:[]}
                //console.log('success!!',res);
            }, res => {
                // this.setState({
                //     loading: false
                // });
                console.log('failed!!', res);
            });
    }
    handleSelectInstancesChange = (keys,rows) => {

        this.setState({
            selectedRows: rows,
        });
    };













      addType = ()=>{
          alert('add')
      }
      editType = () =>{
          alert('edit')
      }
      deleteType = () =>{
          const _this = this;
          
        confirm({
            title: '提示',
            content: '确认要删除这个环节吗?',
            onOk() {
                // _this.setState({
                //     confirmLoading: true,
                //     loading:true
                //   });
                http.post('/call/call.do',{
                        bean: 'FlowServ',
                        method: 'delDispatchRule',//'qryWorkItemByCond',
                        param: {id:_this.state.selectedRows[0].ruleId}
                        
                    },{
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }).then(res => {
                        const returnData = JSON.parse(res);
                        if(returnData.isSuccess){
                            // _this.setState({
                            //     confirmLoading: false,
                            //     loading:false
                            //   });
                              message.success('成功删除');
                              _this.refs.workitemTable.tryReloadData()
                        }
                      
                       
                    },res => {
                        // _this.setState({
                        //     confirmLoading: false,
                        //   });
                        message.error('删除失败');
                        
                    });

            },
            onCancel() {},
          });
      }


      onSelect = (info) => {
        console.log('selected', info);
      }
      onLoadData = (treeNode) => {
        if(treeNode.props.children){
            console.log(treeNode.props.children)
            return new Promise(function(resolve, reject) {
                resolve();
                return;
            });
        }

        return  http.post('/call/call.do', {
            bean: 'TacheServ',
            method: 'qryTaches',
            param: {"tacheCatalogId":treeNode.props.id,"state":"10A","currentDate":1,"systemCode":"ITS"}
        }, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => { 
                const treeData = JSON.parse(res).rows;
                treeData.forEach((item)=>{
                    item.text = item.tacheName;
                    if(item.tacheCatalogId){
                        item.isLeaf =true;
                    }
                })
                const loop = (data) => {
                    data.forEach((item) => {
                        if(item.children) {
                            loop(item.children);
                          }
                        if(item.id == treeNode.props.id){
                            item.children = treeData;
                            return
                        }
                    });
                  };
                  loop(this.state.treeData)

                    this.setState({
                        loading: true,
                    });


            }, res => {
            
            });








      }
      executorModal=()=>{
        if(this.state.executorModal){
            // this.initTreeData();
                const loop = data => data.map((item) => {
                if (item.children) {
                  return <TreeNode title={item.text} id={item.id}>{loop(item.children)}</TreeNode>;
                }
                return <TreeNode title={item.text} id={item.id} isLeaf={item.isLeaf} />;
              });
              const treeNodes = loop(this.state.treeData);
            return (
                <Row style={{height:'100%',width:'100%',position:'absolute',top:'0px',backgroundColor:'rgba(255, 255, 255, 0.7)',zIndex:'10',paddingTop:'100px'}}>
                            <Col span="14" style={{lineHeight:'40px',height:'40px',backgroundColor:'#ebebeb',paddingLeft:'15px',}}>
                                    选择执行人
                            </Col>
                            <Col span="10" style={{backgroundColor:'#ebebeb',height:'40px'}}>
                                        <FormItem style={{float:'right'}}>
                                            <Button type="primary"  size ="small">确认</Button>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                <Button type="ghost"  size ="small" onClick={()=>{this.setState({executorModal: false})}}>关闭</Button>
                                        </FormItem>
                                </Col>
                            <Col span="14" style={{lineHeight:'22px',height:'22px',padding:'5px 0 0 15px'}}>
                                    选择组织/用户组/用户
                            </Col>
                            <Col span="10" style={{height:'22px',paddingTop:'5px'}}>
                                <Switch checkedChildren="显示全部" unCheckedChildren="显示全部"  style={{float:'right'}}/>
                            </Col>
                            <Col span="24" style={{height:'162px',overflowY:'auto',marginTop:'10px'}}>
                            <Tree onSelect={this.onSelect} loadData={this.onLoadData}>
                                {treeNodes}
                            </Tree>
                                    
                            </Col>
                </Row>

            )
        }
      }
      initTreeData = () => {

        http.post('/call/call.do', {
                bean: 'TacheServ',
                method: 'qryTacheCatalogTree',
                param: {"systemCode":"ITS"}
            }, {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }).then(res => {
                    const treeData = JSON.parse(res);
                    // this.treeDataReset(treeData)
    
                    this.setState({
                        treeData: [...treeData],
                      });
                }, res => {
                });
          }
      



    componentDidMount() {
        this.initTreeData()
    }
    componentWillUnmount(){
        
    }

    render(){
        //this.props.flowInstance为当前选择的流程实例
        console.log(this.props.modalIframeData)
        const {getFieldDecorator} = this.props.form;
        return ( <div>
            <div style={{float:'left',width:'calc(60% - 1px)',height:'100%',borderRight:'1px solid #e6e6e6',paddingRight:'15px'}}>
                <div>
                    派发规则列表
                    <div style={{width:'215px',float:"right",}}>
                            <Search
                                placeholder="搜索关键字"
                                onSearch={value => console.log(value)}
                                default
                                enterButton
                                size ="small"
                                />
                    </div>
                </div>
                    <StandardTable ref={"workitemTable"} rowKey={'ruleId'} 
                                data={{ rows:[], pagination: false }}
                                onSelectChange={this.handleSelectInstancesChange}
                                columns={workitemColumns}
                                loadData={this.loadData}
                                clicktoSelect={true}
                                rowSelection={{ type: 'single' }}
                                scroll={{x:true, y: (document.querySelector('body').clientHeight-300) }}
                                
                            />

            </div>

            <div style={{float:'left',width:'40%',height:'100%'}}>
            <Row>
                                <Col span="6" style={{lineHeight:'30px',paddingLeft:'16px'}}>新增派发规则</Col>
                                <Col span="18">
                                    <RadioGroup style={{ borderRadius: 10 ,float:"right"}}>
                                        <RadioButton style={{ borderBottomLeftRadius: 10,borderTopLeftRadius: 10}} value="add" onClick={this.addType}><Icon type="plus"/>新建</RadioButton>
                                        <RadioButton value="edit"  onClick={this.editType}><Icon type="edit" />修改</RadioButton>
                                        <RadioButton style={{ borderBottomRightRadius: 10,borderTopRightRadius: 10}} value="delete" onClick={this.deleteType}><Icon type="delete" />删除</RadioButton>
                                    </RadioGroup>
                                </Col>
                                
                           </Row>
            <Form onSubmit={this.handleSubmit}>
                            
                           <Row style={{minHeight:'375px',position:'relative'}}>

                                {this.executorModal()}
                                
                                <Col span="12">
                                <FormItem
                                    label="流程版本"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    style={{marginBottom:5}}
                                    >
                                    {getFieldDecorator('flowVersion', {
                                        initialValue:'yiminghe',
                                        rules: [{required: true, message: '名称不能为空'}],
                                    })(
                                        <Select size ="small">
                                            <Option value="jack">jack</Option>
                                            <Option value="lucy">lucy</Option>
                                            <Option value="disabled" disabled>disabled</Option>
                                            < Option value="yiminghe">yiminghe</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                </Col>
                                <Col span="12">
                                <FormItem
                                    label="环节"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    style={{marginBottom:5}}
                                    >
                                    {getFieldDecorator('link', {
                                        initialValue:'yiminghe',
                                        rules: [{required: true, message: '名称不能为空'}],
                                    })(
                                        <AsynchronousLinkSelectTree
                                        placeholder='请选择'
                                        size= 'small'
                                        />
                                       
                                    )}
                                </FormItem>
                                </Col>
                                <Col span="12">
                                <FormItem
                                    label="方向"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    style={{marginBottom:5}}
                                    >
                                    {getFieldDecorator('direction', {
                                        initialValue:'yiminghe',
                                        rules: [{required: true, message: '名称不能为空'}],
                                    })(
                                        <Select size ="small">
                                            <Option value="jack">jack</Option>
                                            <Option value="lucy">lucy</Option>
                                            <Option value="disabled" disabled>disabled</Option>
                                            < Option value="yiminghe">yiminghe</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                </Col>
                                <Col span="12">
                                <FormItem
                                    label="匹配方式"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    style={{marginBottom:5}}
                                    >
                                    {getFieldDecorator('matching', {
                                        initialValue:'yiminghe',
                                        rules: [{required: true, message: '名称不能为空'}],
                                    })(
                                        <Select size ="small">
                                            <Option value="jack">jack</Option>
                                            <Option value="lucy">lucy</Option>
                                            <Option value="disabled" disabled>disabled</Option>
                                            < Option value="yiminghe">yiminghe</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                </Col>
                                <Col span="12">
                                <FormItem
                                    label="执行人类型"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    style={{marginBottom:5}}
                                    >
                                    {getFieldDecorator('type', {
                                        initialValue:'yiminghe',
                                        rules: [{required: true, message: '名称不能为空'}],
                                    })(
                                        <Select size ="small">
                                            <Option value="jack">jack</Option>
                                            <Option value="lucy">lucy</Option>
                                            <Option value="disabled" disabled>disabled</Option>
                                            < Option value="yiminghe">yiminghe</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                </Col>
                                <Col span="12">
                                <FormItem
                                    label="执行人"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    style={{marginBottom:5}}
                                    >
                                    {getFieldDecorator('executor', {
                                        initialValue:'yiminghe',
                                        rules: [{required: true, message: '名称不能为空'}],
                                    })(
                                        <Select size ="small">
                                            <Option value="jack">jack</Option>
                                            <Option value="lucy">lucy</Option>
                                            <Option value="disabled" disabled>disabled</Option>
                                            < Option value="yiminghe">yiminghe</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                </Col>
                                

                                <FormItem style={{float:'right',marginBottom:0,position:'absolute',bottom:'0px',right:'0px'}}>
                                            <Button type="ghost" htmlType="submit" size ="small">取消</Button>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <Button type="primary" size ="small">保存</Button>
                                </FormItem>
                              
                            </Row>
                    </Form>
            </div>
        </div>);
    }

}

export default Form.create()(DispatchRule);
