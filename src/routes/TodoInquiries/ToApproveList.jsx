import React from 'react';
import { List, Button, Spin, Select, Input, Row, Col } from 'antd';
import reqwest from 'reqwest';
import routeConfig from 'config/routeConfig';
import history from 'common/history';
import TimeRelatedForm from './TimeRelatedForm';
import http from 'common/http';

// import DynamicSearchForm from 'components/DynamicSearchForm';
// import {formConfig} from './StaticConfigs'

const Option = Select.Option;

const Search = Input.Search;

class ToApproveList extends React.Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    data: [],
  }
  componentDidMount() {
    this.getData((res) => {
      this.setState({
        loading: false,
        data: res,
      });
    });
  }
  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
    this.getData((res) => {
      const data = this.state.data.concat(res);
      this.setState({
        data,
        loadingMore: false,
      }, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
    });
  }
  getData = (callback) => {
       http.post('/call/call.do',{
                bean: 'FlowInstServ',
                method: 'qryWorkItemByCond',
                param: {"processInstanceId":"","startDate":"","endDate":"","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"FLOWPLAT"}
            },{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
              console.log('param',param);
              const returnData = JSON.parse(res);
                if(returnData){
                  callback(returnData.rows);
                }
                
            },res => {
                
              
            });
  }
  handleClick = () => {
    history.push({
      pathname: routeConfig.apiApplyCheck,
      state: { hi: '1' },
    });
  }
  render() {
    const {
      loading, loadingMore, showLoadingMore, data,
    } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{
        textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
      }}
      >
        {loadingMore && <Spin />}
        {!loadingMore && <a role="button" onClick={this.onLoadMore}>加载更多</a>}
      </div>
    ) : null;
    return (
      <div>
        {/* 待我处理 */}
       <TimeRelatedForm></TimeRelatedForm>

        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={data}
          renderItem={item => (
            <List.Item actions={[<Button onClick={this.handleClick}>审批处理</Button>]}>
              <List.Item.Meta
                avatar={<img alt="Avatar" style={{ width: '64px', height: '64px' }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<span style={{ fontSize: '18px' }}>{item.partyName}</span>}
                description={<div>
                  <div style={{ height: 17, fontSize: '12px' }}>
                    <span style={{ marginRight: 10 }}>发起人: {item.processInstanceName}</span>
                    <span style={{ marginRight: 10 }}>任务类型: {item.name}</span>
                    <span style={{ marginRight: 10 }}>发起时间: {item.startedDate}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'red' }}>{item.partyType}</div>
                </div>}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default ToApproveList;
