import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import styles from './StandardTable.scss';
const $ = require('jquery');

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      data:props.data?props.data:{ rows:[], pagination:false },
      loading:props.loading,
      selectedRowKeys: props.selectedRowKeys || [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {selectedRowKeys,loading,data} = nextProps;

    if (nextProps.selectedRows!=null) {
      const needTotalList = initTotalList(nextProps.columns);
      const nSRKs = nextProps.selectedRows;
      this.setState({
        selectedRowKeys: nSRKs,
        needTotalList,
      });
      this.handleRowSelectChange(nSRKs,this.getRowsbyKeys(nSRKs));
    }

    if(!nextProps.loadData){
      this.setState({loading});
    }     

    if(!nextProps.loadData&&data!=null){
      this.setState({data});
    }  

    if(nextProps.scroll&&nextProps.scroll.y&&this.refs.standardTableContainer){
      console.log('setting body height of standardTable:',nextProps.scroll.y)
      $(this.refs.standardTableContainer).find('.ant-table-body').eq(0).height(nextProps.scroll.y);
    }
  }

  componentDidMount(){
    this.tryReloadData();
    if(this.props.scroll&&this.props.scroll.y&&this.refs.standardTableContainer){
      console.log('setting body height of standardTable:',this.props.scroll.y)
      $(this.refs.standardTableContainer).find('.ant-table-body').eq(0).height(this.props.scroll.y);
    }
  }

  tryReloadDatatoPage(current){
        
    const { loadData } = this.props;
    if(loadData){
      const {data,filters, sorter } = this.state;
      const pagination =data.pagination;
      const pageSize=pagination?pagination.pageSize:null;
      this.setState({
        loading:true
      });

      loadData(current,pageSize,pagination).then(res=>{
        const { data,selectedRowKeys} = res;
        const newSRKs = selectedRowKeys?selectedRowKeys:[];
        this.setState({
          loading:false,
          data:res.data,
          selectedRowKeys:newSRKs
        });
        this.handleRowSelectChange(newSRKs, this.getRowsbyKeys(newSRKs,res.data));
      },res=>{
        this.setState({
          loading:false
        })
        console.log('加载StandardTable数据失败');
      })
    }
  }

  tryReloadData=(current,pageSize,pagination, filters, sorter)=>{
    const { loadData } = this.props;
    if(loadData){
      this.setState({
        loading:true
      });
      if(current==null&&this.state.data&&this.state.data.pagination){
        current = this.state.data.pagination.current;
        pagination = this.state.data.pagination;
        pageSize = this.state.data.pagination.pageSize;
        filters = this.state.filters; 
        sorter = this.state.sorter; 
      }
      loadData(current,pageSize,pagination, filters, sorter).then(res=>{
        const { data, selectedRowKeys} = res;
        const newSRKs = selectedRowKeys?selectedRowKeys:[];
        this.setState({
          loading:false,
          data:res.data,
          selectedRowKeys:newSRKs
        });
            this.handleRowSelectChange(newSRKs, this.getRowsbyKeys(newSRKs,data));
      },res=>{
        this.setState({
          loading:false
        })
        console.log('加载StandardTable数据失败');
      })
    }
  }

  clearSelectedRows=()=>{
    this.handleRowSelectChange([], []);
  }

  getSelectedRowKeys=()=>{
    return this.state.selectedRowKeys;
  }

  getSelectedRecords=()=>{
    const { data: { rows }} = this.state;
    if(!rows||rows.length<=0||this.state.selectedRowKeys==null||this.state.selectedRowKeys.length<0)return [];
    
    return _.filter(rows,x=> (this.state.selectedRowKeys.indexOf(this.getRecordRowKeyVal(x))>-1));
  }

  getItemSelection = (record) => {
    
    const k = this.getRecordRowKeyVal(record);
    if (this.state.selectedRowKeys.indexOf(k) > -1) {
      return true;
    }
    return false;

  }

  getRecordRowKeyVal = (record) => {
    if(record==null) return null;
    if(_.isFunction(this.props.rowKey)){
      return this.props.rowKey(record);
    }
    return record[this.props.rowKey]
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    //console.log('handleRowSelectChange',selectedRowKeys, selectedRows);
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });
    //console.log('handleRowSelectChange:needTotalList',needTotalList);
    

    this.setState({ selectedRowKeys, needTotalList });
    if (this.props.onSelectChange) {
      this.props.onSelectChange(selectedRowKeys,selectedRows);
    }
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filters, 
      sorter
    });
    const { current,pageSize } = pagination;
    this.tryReloadData(current,pageSize,pagination, filters, sorter);
    if(pagination){
      if(pagination.onChange){
        pagination.onChange(current,pageSize);
      }
      if(pagination.onShowSizeChange){
        pagination.onShowSizeChange(current,pageSize);
      }
    }

    if(this.props.onChange){
      this.props.onChange(pagination, filters, sorter);
    }
    
  };

  handleRowClick = (record, index,e)=>{
    //console.log('handleRowClick',record, index);
    let needTriggerSelect = false,newSelectedRowKeys=[];
    if(this.props.clicktoSelect){
      const rowKey = record[this.props.rowKey];
      console.log('clicktoSelect',this.isSingleSelection());
      if(this.isSingleSelection()){
        newSelectedRowKeys = [rowKey];
        console.log('clicktoSelect',newSelectedRowKeys);
        this.setState({ selectedRowKeys: newSelectedRowKeys });
        needTriggerSelect = true;
        
      }
      else{
        if(_.find(this.state.selectedRowKeys, x=>x[this.props.rowKey]==rowKey)==null){
          this.state.selectedRowKeys.push(rowKey);
          this.setState({ selectedRowKeys:this.state.selectedRowKeys });
          needTriggerSelect = true;
          newSelectedRowKeys = this.state.selectedRowKeys;
        }
      }
    }

    if(this.props.onRowClick){
      this.props.onRowClick(record, index,e);
    }

    if(needTriggerSelect){
      const rows = this.getRowsbyKeys(newSelectedRowKeys);
      this.handleRowSelectChange(newSelectedRowKeys,rows);
    }
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  isSingleSelection=()=>{
    if(this.props.rowSelection&&(this.props.rowSelection.type=='radio'||this.props.rowSelection.type=='single')){
      return true;
    }
    return false;
  }
  
  getRowsbyKeys=(keys,data2fil)=>{
    const { rowKey } = this.props;
    let { data: { rows }} = this.state;
    if(data2fil){
      rows=data2fil.rows?data2fil.rows:[];
    }
    return _.filter(rows, r=>
      _.find(keys, x=>r[rowKey]==x)!=null
    );
  }

  showAlert=()=>{
     return !this.isSingleSelection()&&this.props.rowSelection!==false
  }

  onRow = (record,index) => {
    let ret = {}
    if(this.props.onRow){
      ret= this.props.onRow(record,index)
    }
    const preOnclick = ret.onClick;

    return {
      ...ret,
      onClick: (e) => {
        this.handleRowClick(record,index,e);
        if(preOnclick){
          preOnclick(e);
        }
      },       // 点击行
      //onMouseEnter: () => {},  // 鼠标移入行
      //onXxxx...
    };
  };
  

  render() {
    const { data: { rows, pagination }, loading,selectedRowKeys, needTotalList } = this.state;
    const { columns } = this.props;

    let paginationProps = false;
    if(pagination!==false){
      paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      };
    }

    let rowSelection = null;
    if(this.props.rowSelection!==false){
      
      rowSelection = _.merge({
        selectedRowKeys,
        onChange: this.handleRowSelectChange,
        getCheckboxProps: record => ({
          disabled: record.disabled,
        }),
      },this.props.rowSelection);
    }
    if(rowSelection!=null&&rowSelection.type=='single'){
      rowSelection=null;
    }
    
    

    return (
      <div ref="standardTableContainer" className={'standardTable'} style={this.props.style}>
        <div className={'tableAlert'} style={{display:(this.showAlert()?'block':'none') }}>
          <Alert
            message={
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {needTotalList.map(item => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    {item.title}总计&nbsp;
                    <span style={{ fontWeight: 600 }}>
                      {item.render ? item.render(item.total) : item.total}
                    </span>
                  </span>
                ))}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table ref="standardTable"
               bordered={this.props.bordered}
          loading={loading}
          rowClassName={(record, index)=>{
            if(this.getItemSelection(record))return 'standardTable-row_selected';
            return 'standardTable-row';
          }}
          rowKey={(record) => this.getRecordRowKeyVal(record)}
          rowSelection={rowSelection}
          dataSource={rows}
          columns={columns}
          scroll={this.props.scroll}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          onRow={this.onRow}
        />
      </div>
    );
  }
}

export default StandardTable;
