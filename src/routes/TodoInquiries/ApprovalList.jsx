import React from 'react';
import { List, Spin, Select, Input, Row, Col } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import reqwest from 'reqwest';
import PropTypes from 'prop-types';
import routeConfig from 'config/routeConfig';
import history from 'common/history';

const Option = Select.Option;

const Search = Input.Search;

@observer
class ApprovalList extends React.Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    data: [],
    url: '',
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
    reqwest({
      url: this.state.url,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }
  handleClick = () => {
    history.push({
      pathname: routeConfig.apiApplyView,
      query: { hi: '1' },
    });
  }
  @observable navType = this.props.navType;
  render() {
    const navType = this.navType;
    const title = (() => {
      switch (navType) {
        case '2':
          return '我的申请';
        case '3':
          return '处理完成';
        default:
          return '';
      }
    })();
    this.state.url = (() => {
      switch (navType) {
        case '2':
          return 'http://localhost:3000/record?_limit=5';
        case '3':
          return 'http://localhost:3000/record?_limit=2';
        default:
          return null;
      }
    })();
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
        <Row style={{ height: '52px', position: 'relative', borderBottom: '1px solid #DFE6EF' }} type="flex" align="middle">
          <Col style={{ position: 'absolute', left: 0 }}>{title}</Col>
          <Col style={{ position: 'absolute', right: 0 }}>
            <Select defaultValue="-1" style={{ width: 100, height: 30, marginRight: '10px' }}>
              <Option value="-1">时间区间</Option>
              <Option value="1">10天</Option>
              <Option value="2">30天</Option>
            </Select>
            <Select defaultValue="-1" style={{ width: 100, height: 30, marginRight: '10px' }}>
              <Option value="-1">任务类型</Option>
              <Option value="1">类型一</Option>
              <Option value="2">类型二</Option>
            </Select>
            <Search
              placeholder="搜索任务检索"
              style={{ width: 215 }}
            />
          </Col>
        </Row>
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={data}
          renderItem={item => (
            <List.Item actions={[(() => {
              switch (navType) {
                case '2':
                  return <div>{item.status}</div>;
                case '3':
                  return <div>{item.end}</div>;
                default:
                  return null;
              }
            })()]}
            >
              <List.Item.Meta
                avatar={<img alt="Avatar" style={{ width: '64px', height: '64px' }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<span style={{ fontSize: '18px' }} role="button" onClick={this.handleClick}>{item.title}</span>}
                description={<div>
                  <div style={{ height: 17, fontSize: '12px' }}>
                    <span style={{ marginRight: 10 }}>任务类型: {item.type}</span>
                    <span style={{ marginRight: 10 }}>发起时间: {item.start}</span>
                    <span style={{ marginRight: 10 }}>完成时间: {item.end}</span>
                  </div>
                </div>}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

ApprovalList.propTypes = {
  navType: PropTypes.string.isRequired,
};

export default ApprovalList;
