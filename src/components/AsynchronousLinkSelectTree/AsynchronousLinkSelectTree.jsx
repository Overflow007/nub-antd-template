import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import {Tree,TreeSelect} from 'antd';
import http from 'common/http';
import utils from 'common/utils';

const TreeNode = Tree.TreeNode;


class AsynchronousLinkSelectTree extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading:true,
            selectTreeData: []
        }
       
    }
      //更换属性
    changeAttr = (data)=>{
      data.forEach((item)=>{
        item.label=item.text;
        item.value = item.text;
        item.key = item.id;
        if(item.children){
          this.changeAttr(item.children)
        }
      })
    }
    initSelectTree = () =>{
      http.post('/call/call.do', {
        bean: 'TacheServ',
        method: 'qryTacheCatalogTree',
        param: {"systemCode":"ITS"}
    }, {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }).then(res => {
            const data = JSON.parse(res);
            this.changeAttr(data)
            this.setState({
              selectTreeData: [...data],
              });
        }, res => {
        });


    }

    onLoadData=(treeNode)=>{
      const node = treeNode.props;
      if(!node.loaded && node.type==1){
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
                                  })
                                  const loop = (data) => {
                                      data.forEach((item) => {
                                          if(item.children) {
                                              loop(item.children);
                                            }
                                          if(item.id == treeNode.props.id){
                                            item.loaded =true
                                            if(item.children){
                                              item.children=item.children.concat(treeData);
                                              return
                                            }else{
                                              item.children = treeData;
                                              return
                                            }
                                          }
                                      });
                                    };
                                    loop(this.state.selectTreeData)
                                      this.setState({
                                          loading: true,
                                      });
                              }, res => {
          
          });
      }else{
        return new Promise(function(resolve, reject) {
          resolve();
          return;
      });
      }
    }
    componentDidMount() {
      this.initSelectTree()
    }

    render(){
        const loop = data => data.map((item) => {
          if (item.children) {
            return <TreeNode title={item.text} value={item.id} key={item.id} id={item.id} type={item.type} loaded={item.loaded} disabled={item.type? true:false} isLeaf={item.type? false:true}>{loop(item.children)}</TreeNode>;
          }
          return <TreeNode title={item.text} value={item.id} key={item.id}  id={item.id} type={item.type} loaded={item.loaded} disabled={item.type? true:false} isLeaf={item.type? false:true}/>;
        });
        const treeNodes = loop(this.state.selectTreeData);
        return (<div>
                    <TreeSelect
                      style={this.props.style}
                      dropdownStyle={this.props.dropdownStyle}
                      placeholder={this.props.placeholder}
                      treeDefaultExpandAll={this.props.treeDefaultExpandAll}
                      allowClear = {this.props.allowClear}
                      onChange={this.props.onChange}
                      onSelect={this.props.onSelect}
                      size={this.props.size}

                      loadData={this.onLoadData}
                    >
                      {treeNodes}
                    </TreeSelect>
          </div> );
    }

}

export default AsynchronousLinkSelectTree;