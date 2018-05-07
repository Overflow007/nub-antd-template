import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { observer } from 'mobx-react';
import utils from 'common/utils';
import { Table, Modal, Row, Col, Switch, Radio, Icon } from 'antd';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

class Home extends Component {
  constructor(props) {
    super(props);
    // this.popupModel = popupModel;
    // console.log(this.popupModel.showDistributionRules)
  }

  state = {
    treeData: [
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ],
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 1000);
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }


  render() {
    //this.props.flowInstance为当前选择的流程实例

    return (<div>124
      <Tree loadData={this.onLoadData}>
        {this.renderTreeNodes(this.state.treeData)}
      </Tree>
    </div>);
  }


}

export default Home;