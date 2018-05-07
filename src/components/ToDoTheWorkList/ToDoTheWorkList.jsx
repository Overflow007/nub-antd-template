import React, { PureComponent, Fragment } from 'react';
import { List, Spin, Select, Input, Row, Col, Icon, Checkbox,Card,Switch } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import utils from 'common/utils';
import styles from './ToDoTheWorkList.scss';


const PREFIX = 'ToDoTheWorkList';

const cx = utils.classnames(PREFIX, styles);


class ToDoTheWorkList extends PureComponent {
    constructor(props) {
        super(props);
        const { columns,key } = props;

        this.state = {
            data:props.data?props.data:{ rows:[], pagination:false },
            loading:props.loading,
            selectType: props.selectType,//'multi',//single,false
            allowChangeSelectType: props.allowChangeSelectType,
            selectedRowKeys: props.selectedRowKeys?props.selectedRowKeys:[],
            selectAll: false,
            expandKey:null,
            workState:1,
        };
    }

    componentWillReceiveProps(nextProps) {
     // console.log('nextProps',nextProps);
        const {selectedRowKeys,loading,data} = nextProps;
        if(selectedRowKeys!=null){
            this.setState({selectedRowKeys});
        }

        if(!nextProps.loadData){
          this.setState({loading});
        }     

        if(!nextProps.loadData&&data!=null){
          this.setState({data});
        }  
        
    }

    componentDidMount(){
      this.tryReloadData();
    }

    getStateShow=(e)=>{
      this.setState({
        workState:e
      })
      this.ReloadDatatoPage(1,e);
    }
    getSelectedRowKeys=()=>{
      return this.state.selectedRowKeys;
    }

    getRowsbyKeys=(keys,data2fil)=>{
      if(keys==null)return [];
      let { data: { rows }} = this.state;
      if(data2fil){
        rows=data2fil.rows?data2fil.rows:[];
      }
      if(!rows||rows.length<=0)return [];
      return _.filter(rows,x=> (keys.indexOf(this.getRecordRowKeyVal(x))>-1));
    }

    getSelectedRecords=()=>{
      const { data: { rows }} = this.state;
      if(!rows||rows.length<=0||this.state.selectedRowKeys==null||this.state.selectedRowKeys.length<0)return [];
      
      return _.filter(rows,x=> (this.state.selectedRowKeys.indexOf(this.getRecordRowKeyVal(x))>-1));
    }

    getData=()=>{
      return this.state.data;
    }

    changeAllSeletion = (selectAll) => {
      
        let srks = this.state.selectedRowKeys.concat();
        if (selectAll) {
          const { data: { rows }} = this.state;
          srks = rows?_.map(rows, this.props.rowKey):[];
          this.setState({
            selectAll: true,
            selectedRowKeys: srks
          });
        } else {
          srks = [];
          this.setState({
            selectAll: false,
            selectedRowKeys: srks
          });
        }
      //  console.log('changeAllSeletion',srks);
        if(this.props.onSelectChange){
          this.props.onSelectChange(srks,this.getRowsbyKeys(srks));
        }
      }
    
      getItemSelection = (record) => {
        if (this.state.selectAll) return true;
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
    
      changeItemSelection = (record, checked) => {
        if (!checked) {
          this.setState({
            selectAll: false
          });
        }
        let srks = this.state.selectedRowKeys.concat();
        const k = this.getRecordRowKeyVal(record);
        if (checked) {
          if (srks.indexOf(k) > -1) {
    
          } else {
            srks.push(k);
    
          }
          this.setState({
            selectedRowKeys: srks
          });
        } else {
    
          if (srks.indexOf(k) > -1) {
    
            _.pull(srks, k);
          } else {
    
          }
          this.setState({
            selectedRowKeys: srks
          });
        }
       // console.log('changeItemSelection',srks);
        if(this.props.onSelectChange){
          this.props.onSelectChange(srks,this.getRowsbyKeys(srks));
        }
    
      }
    
      renderExtra = () => {
        return [this.props.extra,(
        null
        )];
      }
    
      renderTitle = () => {
        if (this.state.selectType == 'multi') {
          return (<Checkbox checked={this.state.selectAll} onChange={(e) => {
            this.changeAllSeletion(e.target.checked);
          }}>{this.props.title}</Checkbox>);
        }
        return `${this.props.title}`;
      }
      renderCheckBox = (item) => {
        if (this.state.selectType == 'multi') {
          return (<div style={{ flex: '0 0 auto', paddingRight: '10px' }}>
            <Checkbox checked={this.getItemSelection(item)} onChange={(e) => {
    
              this.changeItemSelection(item, e.target.checked);
            }}></Checkbox>
          </div>);
        }
        return null;
      }
    
      handleRowClick=(record,e)=>{
        
        if (this.state.selectType !== false) {
    
          const k = this.getRecordRowKeyVal(record);
          let srks = this.state.selectedRowKeys.concat();
          if (srks.indexOf(k) > -1) {
            if(this.state.selectType == 'multi'){
              _.pull(srks,k);
            }else{
              //srks=[];
            }
    
          } else {
            if(this.state.selectType == 'multi'){
              srks.push(k);
            }else{
              srks=[k];
            }
           
    
          }
          
          if(this.props.onSelectChange){
            this.props.onSelectChange(srks,this.getRowsbyKeys(srks));
          }
           
           this.setState({
            selectedRowKeys: srks
          });
        }
    
        if(this.props.onRowClick){
          this.props.onRowClick(record,e);
        }
      }
    
      getIsExpand=(item)=>{
        if(this.state.expandKey==null){
          return false;
        }else{
          const k = this.getRecordRowKeyVal(item);
          return this.state.expandKey==k;    
        }
      }
    
      renderDetails=(item)=>{
        if(this.getIsExpand(item)){
          const { columns } = this.props;
          const detailCols = _.filter(columns,x=>(!x.metaFooter)&&(!x.metaContent)&&(!x.metaFooter)&&(!x.content)&&(!x.footer))
          if(detailCols==null||detailCols.length<=0)return null;
          const divColsby4 = [];
          let tmpArr = null,index=0;
          detailCols.map(x=>{
            if(index==0){
              tmpArr=[];
              divColsby4.push(tmpArr);
            }
    
            tmpArr.push(x);
    
            if(index==3){
              index=0;
            }
            else{
              index++;
              
            }
          });
    
          return (<div style={{ paddingTop: '12px' }}>
          <div style={{ borderTop: '1px solid #e8e8e8', width: '100%', padding: '22px 20px', backgroundColor: '#FCFCFC', color: '#A6A6A6', marginBottom: '-12px' }}>
            <table style={{ tableLayout: 'fixed', width: '100%' }}>
              <tbody>
                {
                  divColsby4.map((x,ii)=>{
                    return (<tr key={`details_tr_${ii}`}>
                      {x.map(y=>{
                         return (
                         <td key={`details_td_${y.dataIndex}`} style={{overflow: 'hidden', whiteSpace: 'nowrap',textOverflow: 'ellipsis'}}>
                         <label style={{ marginRight: '9px' }}>{y.title}:</label>
                         <span style={{ marginRight: '17px' }}>{this.getColumnVal(y,item)}</span>
                       </td>
                       )
                      })}
                    </tr>)
    
                  })
                }
              </tbody>
            </table>
    
          </div>
    
        </div>)
        }else{
          return null;
        }
      }
    
      getColumnVal=(col,record)=>{
        if(col==null) return null;
        const val = record[col.dataIndex];
        if(col.render){
          return col.render(val,record,col);
        }
    
        return val;
      }
    
      getMetaContents=(item)=>{
        const { columns } = this.props;
        const metaContents = _.filter(columns, { 'metaContent': true }); 
        if(metaContents==null||metaContents.length<=0)return null;
        return metaContents.map(x=>{
          let val = item[x.dataIndex];
          if(x.render){
            val = x.render(val,item,x);
          }
          return [<label key={`${this.getRecordRowKeyVal(item)}_metacontent_${x.dataIndex}_label`} style={{ marginRight: '9px' }}>{x.title}:</label>,<span key={`${this.getRecordRowKeyVal(item)}_metacontent_${x.dataIndex}_val`} style={{ marginRight: '17px' }}>{val}</span>]
        })
      }
    
      getMetaFooters=(item)=>{
        const { columns } = this.props;
        const metaFooters = _.filter(columns, { 'metaFooter': true }); 
        if(metaFooters==null||metaFooters.length<=0)return null;
        return metaFooters.map(x=>{
          let val = item[x.dataIndex];
          if(x.render){
            val = x.render(val,item,x);
          }
          return [<label key={`${this.getRecordRowKeyVal(item)}_metafooter_${x.dataIndex}_label`} style={{ marginRight: '9px' }}>{x.title}:</label>,<span key={`${this.getRecordRowKeyVal(item)}_metafooter_${x.dataIndex}_val`} style={{ marginRight: '17px' }}>{val}</span>]
        })
      }
    
      renderMeta=(item)=>{
        const { columns } = this.props;
        const metaHeader = _.find(columns, { 'metaHeader': true }); 
        
        
        return (<div style={{ flex: '3' }}>
        <h4 style={{ fontSize: '18px' }}>{this.getColumnVal(metaHeader,item)}</h4>
        <div style={{ color: '#BAC2C5' }}>
          {this.getMetaContents(item)}
          
        </div>
        <div style={{ color: '#F9AD7C' }}>{this.getMetaFooters(item)}</div>
      </div>)
      }
      
      renderContent=(item)=>{
        const { columns } = this.props;
        const metaHeader = _.find(columns, { 'metaHeader': true }); 
        const listContent = _.find(columns, { 'content': true }); 
    
        return (<div style={{ flex: '1', textAlign: 'right' }}>
        <h4 style={{ fontSize: '18px', visibility: 'hidden',height:'' }}>流程</h4>
        <span style={{ display: 'inline-block', width: ((listContent&&listContent.width!=null)?(listContent.width+'px'):'auto'), textAlign: 'left' }}>{this.getColumnVal(listContent,item)}</span>
        <p style={{ visibility: 'hidden' }}><a>展开更多</a></p>
      </div>);
      }
    
      renderFooter=(item)=>{
        const { columns } = this.props;
        const metaHeader = _.find(columns, { 'metaHeader': true }); 
        const listFooter = _.find(columns, { 'footer': true }); 
    
        return (<div style={{ flex: '0 0 auto', width: ((listFooter&&listFooter.width!=null)?(listFooter.width+'px'):'auto'), textAlign: 'right' }}>
        <h4 style={{ fontSize: '18px', visibility: 'hidden' }}>流程</h4>
        <span>{this.getColumnVal(listFooter,item)}</span>
        
        {/* <p style={{ position: 'relative', top: '15px' }}><a onClick={(e) => { 
          e.stopPropagation();
          const k = this.getRecordRowKeyVal(item);
          if(this.state.expandKey==k){
         this.setState({expandKey:null});
        }else{
          this.setState({expandKey:k});
        } 
          }}><Icon style={{ marginRight: '5px' }} type={this.getIsExpand(item) ? 'up' : 'down'} />{this.getIsExpand(item) ? '收起详情' : '展开更多'}</a></p> */}

      </div>);
      }

      tryReloadDatatoPage(current){
       // console.log('current',current);
        const { loadData } = this.props;
        if(loadData){
          const {data } = this.state;
          const pagination =data.pagination;
          const pageSize=pagination?pagination.pageSize:null;
          const {workState}=this.state;
        //  console.log(pagination);
          this.setState({
            loading:true,
            workState
          });
         // alert(" tryReloadDatatoPage(current)"+workState);
          loadData(current,pageSize,pagination,workState).then(res=>{
            const { data,selectedRowKeys} = res;
            const newSRKs = selectedRowKeys?selectedRowKeys:[];
            this.setState({
              loading:false,
              data,
              selectedRowKeys:newSRKs,
              workState,
            });
            if(this.props.onSelectChange){
              this.props.onSelectChange(newSRKs,this.getRowsbyKeys(newSRKs,data));
            }
          },res=>{
            this.setState({
              loading:false
            })
            console.log('加载ToDoTheWorkList数据失败');
          })
        }
      }

      ReloadDatatoPage(current,workState){
        //console.log('current',current);
        const { loadData } = this.props;
        if(loadData){
          const {data } = this.state;
          const pagination =data.pagination;
          const pageSize=pagination?pagination.pageSize:null;
          //const {workState}=this.state;
         // console.log(pagination);
          this.setState({
            loading:true,
            workState
          });
          //("ToDoTheWorkList.jsx"+workState);
        //  alert(" ReloadDatatoPage(current,workState)");
          loadData(current,pageSize,pagination,workState).then(res=>{
            const { data,selectedRowKeys} = res;
            const newSRKs = selectedRowKeys?selectedRowKeys:[];
            this.setState({
              loading:false,
              data,
              selectedRowKeys:newSRKs,
              workState,
            });
            // if(this.props.onSelectChange){
            //   this.props.onSelectChange(newSRKs,this.getRowsbyKeys(newSRKs,data));
            // }
          },res=>{
            this.setState({
              loading:false
            })
            console.log('加载ToDoTheWorkList数据失败');
          })
        }
      }


      tryReloadData=(current,pageSize,pagination,workState)=>{
        const { loadData } = this.props;
        if(loadData){
          this.setState({
            loading:true
          });
          if(current==null&&this.state.data&&this.state.data.pagination){
            current = this.state.data.pagination.current;
            pagination = this.state.data.pagination;
            pageSize = this.state.data.pagination.pageSize;
          }
         // alert(" tryReloadData(current,workState)"+workState);
          if(workState==undefined||!workState){
            workState=1;
          }
         // alert(" tryReloadData(current,workState)sssssss"+workState);
          loadData(current,pageSize,pagination,workState).then(res=>{
            const { data,selectedRowKeys} = res;
            const newSRKs = selectedRowKeys?selectedRowKeys:[];
            this.setState({
              loading:false,
              data,
              selectedRowKeys:newSRKs
            });
            if(this.props.onSelectChange){
              this.props.onSelectChange(newSRKs,this.getRowsbyKeys(newSRKs,data));
            }
          },res=>{
            this.setState({
              loading:false
            })
            console.log('加载ToDoTheWorkList数据失败');
          })
        }
      }

      handlePaginationChange = (current,pageSize) => {
        const { data: { rows, pagination }} = this.state;
        const {workState}=this.state;
       // alert("handlePaginationChange"+workState);
        this.tryReloadData(current,pageSize,pagination,workState);
        if(pagination&&pagination.onChange){
          pagination.onChange(current,pageSize);
        }
      }

      handleShowSizeChange = (current,pageSize) => {
        const { data: { rows, pagination}} = this.state;
        const {workState}=this.state;
       // alert("handleShowSizeChange"+workState);
        this.tryReloadData(current,pageSize,pagination,workState);
        if(pagination&&pagination.onShowSizeChange){
          pagination.onShowSizeChange(current,pageSize);
        }
      }

    render() {
        const { data: { rows, pagination },selectedRowKeys,selectType, loading } = this.state;
        const { columns,key, title } = this.props;

        let truePagination = {
          ...pagination,
          onChange: this.handlePaginationChange,
          onShowSizeChange: this.handleShowSizeChange
        }

        if((rows==null||rows.length<=0)&&(pagination==null||pagination.total==null||pagination.total<=0)){
          truePagination=false
        }

        return (
            <Card title={this.renderTitle()} className={this.props.className} style={this.props.styles} bordered={false}
              extra={this.renderExtra()}
            >
            {this.props.children}
              <List
                className={`${PREFIX}`}
                loading={loading}
                itemLayout="horizontal"
                pagination={truePagination}
                dataSource={rows}
                renderItem={item => (
                  <List.Item className={this.getItemSelection(item)?`${cx('row_selected')}`:`${cx('row')}`} key={`${this.getRecordRowKeyVal(item)}`}>
                    <div style={{ width: '100%', }}>
                      <div onClick={(e)=>{
                          this.handleRowClick(item,e);
                        }} style={{ display: 'flex', alignItems: 'center', fontSize: '13px', width: '100%', padding: '0px 10px', height: '90px' }} >
                        {this.renderCheckBox(item)}
                        {this.renderMeta(item)}
                        {this.renderContent(item)}
                        {this.renderFooter(item)}
      
                      </div>
                      {this.renderDetails(item)}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          );
    }

}

export default ToDoTheWorkList;
