import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { observer } from 'mobx-react';
import http from 'common/http';
import {extractPath} from 'common/path';
import FlowModal from './popups/FlowModal';

@observer
class FlowDefMgr extends Component {
    state = {
        modalName: '',
        modalIframeData:{}
    };



    renderModal=()=>{
        if(this.state.modalName=='FlowModal'){
            return <FlowModal modalIframeData = {this.state.modalIframeData} onCancel={()=>{
                this.setState({
                    modalName:'',
                    modalIframeData:{}
                })
            }} />
        }

        return null;
    }
    

    componentDidMount() {
        let _this = this;
        if(this.refs.flowDefManager !=null){
            window.addEventListener('message',function(e){
                const iframeData = JSON.parse(e.data)
                _this.setState({
                    modalName:'FlowModal',
                    modalIframeData:iframeData
                })
            },false);

        }
        //激活iframe页面传参使用
        document.getElementById("iframe").onload=()=>{
            window.frames[0].postMessage('active','*');
        }


    }




    render() {
        let url = '';
        if(location.hostname=='localhost'||location.hostname=='127.0.0.1'||location.hostname==''){
            if(location.pathname.startsWith('/'+extractPath)){
              url='/'+extractPath ;
            }else{
	            url = 'http://101.132.66.16:9079/uos-manager';
            }
            
          }else{
            url='/'+extractPath;
          }
          url+="/view/flow/design/flowDefManager.html"
        return (<div style={{height:'100%'}}>
            <iframe ref = {'flowDefManager'} id="iframe" scrolling={"no"} frameBorder={"0"} src={`${url}`} style={{width:'100%',height:'99%'}}>
            </iframe>

            {
                this.renderModal()
            }

        </div>)
    }
}

export default FlowDefMgr;

