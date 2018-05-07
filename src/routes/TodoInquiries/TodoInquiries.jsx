// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import utils from 'common/utils';
// import './TodoInquiries.scss';
// import { Table, Icon, Divider, Form, Row, Col, Input, Button, DatePicker,Select} from 'antd';

// const PREFIX = 'flow-TodoInquiries';
// const cx = utils.classnames(PREFIX);
// const RangePicker = DatePicker.RangePicker;
// const FormItem = Form.Item;

// class AdvancedSearchForm extends React.Component {
//   constructor(props) {
//     　　　　super(props);
//     　　　　this.state = {
//                 value: "",
//                 timeValue:"",
//                 linkValue:"",
//                 regionValue:""
              
//               };
//     　　};

//   handleChange = (e) =>{
//     this.setState({value: e.target.value});
//   }
//   timeChange = (e) =>{
//     this.setState({timeValue: e});                  
//   }
//   linkChange =(e) =>{
//     this.setState({linkValue: e});   
//   }
//   regionChange =(e) =>{
//     this.setState({regionValue: e});   
//   }


//   handleSearch = (e) => {
//     // e.preventDefault();
//     // this.props.form.validateFields((err, values) => {
//     //   console.log(values);
//     // });
//     console.log(this.state)
//   }

//   handleReset = () => {
//     this.setState({
//       value: '',
//       timeValue:"",
//       linkValue:"",
//       regionValue:""
//     });
//     // this.props.form.resetFields();
//   }

//   render() {
//     return (
//       <Form
//         className="ant-advanced-search-form"
        
//       >
//         <Row>
//           <Col span={8}>
//             <FormItem
//               label="流程实例"
//               labelCol={{ span: 10 }}
//               wrapperCol={{ span: 14 }}
//             >
//               <Input placeholder="流程实例ID" size="default" value={this.state.value} onChange={this.handleChange}/>
//             </FormItem>
//           </Col>
//           <Col span={8}>
//              <FormItem
//               label="日期"
//               labelCol={{ span: 10 }}
//               wrapperCol={{ span: 14 }}
//             >
//               <RangePicker span={8} onChange={this.timeChange}/>
//             </FormItem>
//           </Col>
//         </Row>
//         <Row>
//           <Col span={8}>
//           <FormItem
//                 label="环节"
//                 labelCol={{ span: 10 }}
//                 wrapperCol={{ span: 14 }}
//               >
//             <Select placeholder="请选择环节" onSelect={this.linkChange}>
//               <Option value="a">a</Option>
//               <Option value="b">b</Option>
//               <Option value="c">c</Option>
//             </Select>
//             </FormItem>
//           </Col> 
//           <Col span={8}>
//           <FormItem
//                 label="区域"
//                 labelCol={{ span: 10 }}
//                 wrapperCol={{ span: 14 }}
//               >
//             <Select placeholder="请选择区域" onSelect={this.regionChange}>
//               <Option value="a">a</Option>
//               <Option value="b">b</Option>
//               <Option value="c">c</Option>
//             </Select>
//             </FormItem>
//           </Col> 
//           <Col span={2}>
//           </Col>
//           <Col span={6} style={{paddingTop:4}}>
//             <Button type="primary" htmlType="submit" onClick={this.handleSearch} style={{width:150}}>查询</Button>
//             {/* <Button style={{ marginLeft: 10 }} onClick={this.handleReset}> */}
//               {/* 重置 */}
//             {/* </Button> */}
//           </Col>
//         </Row>
//       </Form>
//     );
//   }
// }

// const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);
// // ReactDOM.render(
// //   <div>
// //     <WrappedAdvancedSearchForm />
// //     <div className="search-result-list">Search Result List</div>
// //   </div>,
// //   mountNode
// // );
// const columns = [{
//   title: '姓名',
//   dataIndex: 'name',
//   render: text => <a href="#">{text}</a>,
// }, {
//   title: '年龄',
//   dataIndex: 'age',
// }, {
//   title: '住址',
//   dataIndex: 'address',
// }];
// const data = [{
//   key: '1',
//   name: '胡彦斌',
//   age: 32,
//   address: '西湖区湖底公园1号',
// }, {
//   key: '2',
//   name: '胡彦祖',
//   age: 42,
//   address: '西湖区湖底公园1号',
// }, {
//   key: '3',
//   name: '李大嘴',
//   age: 32,
//   address: '西湖区湖底公园1号',
// }];

// // 通过 rowSelection 对象表明需要行选择
// const rowSelection = {
//   onChange(selectedRowKeys, selectedRows) {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   onSelect(record, selected, selectedRows) {
//     console.log(record, selected, selectedRows);
//   },
//   onSelectAll(selected, selectedRows, changeRows) {
//     console.log(selected, selectedRows, changeRows);
//   },
// };

// class TodoInquiries extends Component {
//   render() {
//     return (
//       <div className={PREFIX}>
//         <WrappedAdvancedSearchForm />
//         <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
//       </div>
//     );
//   }
// }



// ``````````````````````````````````````````````

import React, { Component} from 'react';
import { Layout, Menu } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import ToApproveList from './ToApproveList';
import ApprovalList from './ApprovalList';
import utils from 'common/utils';
import './TodoInquiries.scss';

const PREFIX = 'flow-TodoInquiries';
const cx = utils.classnames(PREFIX);


const { Sider, Content } = Layout;

const MenuItemGroup = Menu.ItemGroup;

@observer
class TodoInquiries extends React.Component {
  @observable navType = '1';
  render() {
    const navType = this.navType;
    return (
      <div className={`${cx('ctn')}`}>
        <Layout style={{ padding: '20px 100px' }}>
          <Sider width={180} style={{ background: 'none' }}>
            <Menu
              style={{ width: '180px', lineHeight: '40px', background: '#fff' }}
              defaultSelectedKeys={['1']}
    
            >
              <MenuItemGroup title="我的审批">
                <Menu.Item key="1">待我处理</Menu.Item>
                <Menu.Item key="2">我的申请</Menu.Item>
                <Menu.Item key="3">处理完成</Menu.Item>
              </MenuItemGroup>
            </Menu>
          </Sider>
          <Layout style={{ background: '#fff', marginLeft: '20px' }}>
            <Content>
              <div style={{ padding: '0 25px' }}>
                {(() => {
                  switch (navType) {
                    case '1':
                      return <ToApproveList navType={navType} />;
                    default:
                      return <ApprovalList navType={navType} />;
                  }
                })()}
              </div>
            </Content>
          </Layout>
        </Layout>

      </div>
    );
  }
}

TodoInquiries.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    navType: PropTypes.string,
  }),
};

// export default ApprovalManage;


// class TodoInquiries extends Component {
//   render() {
//     return (
//       <div className={PREFIX}>
//         主页
//       </div>
//     );
//   }
// }


// TodoInquiries.propTypes = {};

// TodoInquiries.defaultProps = {};

export default TodoInquiries;
