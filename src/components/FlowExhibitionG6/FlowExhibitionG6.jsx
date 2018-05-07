import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import utils from 'common/utils';
import http from 'common/http';
import moment from 'moment';
import G6 from '@antv/g6';
import Plugins from '@antv/g6-plugins';
import flowIamge from './images/configure_b.png';
import startIamge from './images/start.png';
import endIamge from './images/end.png';
import tacheIamge from './images/tache.png';
import controlIamge from './images/controlNode.png';
import mergeIamge from './images/mergeNode.png';
import parallelIamge from './images/parallelNode.png';
import abnormalIamge from './images/abnormal.png';
import G6Styles from './G6Styles.scss';

const PREFIX = 'flow-G6component';
const cx = utils.classnames(PREFIX, G6Styles);
let stateConfig = {
    "FFF": ["开始", "#5dbe16", false],
    "10I": ["未开始", "#cbcbcb", false],
    "10D": ["正在处理", "#51c6f7", false],
    "10F": ["按时完成", "#94e15a", false],
    "10O": ["超时完成", "#f6db56", false],
    "10E": ["超时未完成", "#f99847", false],
    "10X": ["执行异常", "#ff5453", false],
    "10A": ["作废", "#5c5c5c", false]
}
        // const xmlCode = '<?xml version="1.0" encoding="UTF-8"?><WorkflowProcess><Activities><Activity id="1130" name="开始节点" type="Start" state="10I" direction="1" isRuning="true"/><Activity id="1133" type="Tache" name="定单审核" state="10D" tacheCode="A85751_13_74821_285_25972" flowTips="处理人: 翼翮运维&lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:47:10&lt;br&gt;完成时间: 2017-12-27 18:47:11&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="3f3784fc-cfa5-43be-8bc1-355a5c3e5112"/><Activity id="1135" type="Tache" name="DCI云间高速云接入资源分配" state="10F" tacheCode="A83010_35_35586_47_85684" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:47:11&lt;br&gt;完成时间: 2017-12-27 18:49:07&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="ad043459-a724-4389-8670-602c3341989b"/><Activity id="1137" type="Tache" name="DCI网络二层VLL资源申请" state="10O" tacheCode="A33650_44_45719_970_42425" flowTips="处理人: 翼翮运维&lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:49:07&lt;br&gt;完成时间: 2017-12-27 18:50:02&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="0568ae05-96ed-4f2e-8139-83e19b0ff639"/><Activity id="1139" type="Tache" name="调单派发" state="10E" tacheCode="A4521_59_40978_570_22611" flowTips="处理人: 翼翮运维&lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:50:02&lt;br&gt;完成时间: 2017-12-27 18:50:02&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="eca6fadd-1059-438b-928e-f9753e452e9b" isParallel="true"/><Parallel><Branch><Activity id="1168" type="Tache" name="云端A端配置任务下发" state="10X" tacheCode="A85178_10_85076_588_10708" flowTips="处理人: 云公司运维&lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:50:03&lt;br&gt;完成时间: 2017-12-27 18:52:39&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="a0e59963-0934-496d-9894-12a70f6972a4"/><Activity id="1170" type="Tache" name="CE端A端单点报竣" state="10A" tacheCode="A45231_18_36439_477_38418" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:52:39&lt;br&gt;完成时间: 2017-12-27 18:52:39&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="1b45c7df-4978-48ce-aab2-3d97db1f552c"/></Branch><Branch><Activity id="1173" type="Tache" name="云端Z端配置任务下发" state="10D" tacheCode="A46605_5_87826_268_70641" flowTips="处理人: 云公司运维&lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:50:03&lt;br&gt;完成时间: 2017-12-27 18:52:35&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="1b52e848-b2af-48e9-a5d2-8fe4ee6877d5"/><Activity id="1175" type="Tache" name="CE端Z端单点报竣" state="10F" tacheCode="A24517_24_44911_725_2825" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:52:35&lt;br&gt;完成时间: 2017-12-27 18:52:35&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="e5b61c41-1f6d-47a1-befb-d675feaf3856"/></Branch><Branch><Activity id="1143" type="Tache" name="DCI网络二层VLL业务开通" state="10O" tacheCode="A86092_5_48646_951_62140" flowTips="处理人: 翼翮运维&lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:50:03&lt;br&gt;完成时间: 2017-12-27 18:51:01&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="87886e27-99a3-4434-a31b-dbc7f9fdea42"/><Activity id="1145" type="Tache" name="PE端A端单点报竣" state="10E" tacheCode="A55551_38_94863_766_53770" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:51:02&lt;br&gt;完成时间: 2017-12-27 18:51:02&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="41d11fd2-adde-402b-a02d-9d7af7f74580"/><Activity id="1147" type="Tache" name="PE端Z端单点报竣" state="10I" tacheCode="A5474_21_57580_733_43714" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:51:03&lt;br&gt;完成时间: 2017-12-27 18:51:02&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="4cdfe8e4-849a-473a-9877-3fd7de8735bc"/></Branch></Parallel><Activity id="1151" type="Tache" name="云全程调测发起" state="10A" tacheCode="A60764_46_77071_78_31498" flowTips="处理人: 云公司运维&lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:52:41&lt;br&gt;完成时间: 2017-12-27 18:53:36&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="7008c57e-f04b-4bd8-b8e3-8f677b2e6640" isJoin="true"/><Activity id="1153" type="Tache" name="云间高速云平台客户VPC资源查询" state="10D" tacheCode="A25541_53_60166_474_97281" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:53:37&lt;br&gt;完成时间: 2017-12-27 18:53:39&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="408ba83b-2ab1-4ebe-bc2c-e10e24137f6d" isParallel="true"/><Parallel><Branch><Activity id="1157" type="Tache" name="DCI 网络二层VLL完工报竣" state="10F" tacheCode="A47710_42_38247_795_66169" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:53:40&lt;br&gt;完成时间: 2017-12-27 18:53:39&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="632059cb-0993-4594-aa24-e72118a22659"/></Branch><Branch><Activity id="1165" type="Tache" name="DCI云间高速云调系统交维报竣信息通知" state="10O" tacheCode="A21083_52_96164_670_73168" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:53:39&lt;br&gt;完成时间: 2017-12-27 18:53:46&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="2073fc39-74cd-4866-8ce0-4c9d1dd18da3"/></Branch></Parallel><Activity id="1161" type="Tache" name="集团CRM接口全程报竣" state="10E" tacheCode="A41244_19_42331_702_94929" flowTips="处理人: &lt;br&gt;联系电话: &lt;br&gt;到达时间: 2017-12-27 18:53:47&lt;br&gt;完成时间: 2017-12-27 18:53:47&lt;br&gt;回单信息: 正常回单&lt;br&gt;" workItemId="47e7b507-1e13-46a4-b785-6ff0a31f7589" isJoin="true"/><Activity id="1189" name="结束节点" type="Finish" direction="1" state="10I" isRuning="true"/></Activities><Transitions><Transition id="1136" from="1133" to="1135"/><Transition id="1138" from="1135" to="1137"/><Transition id="1140" from="1137" to="1139"/><Transition id="1146" from="1143" to="1145"/><Transition id="1148" from="1145" to="1147"/><Transition id="1154" from="1151" to="1153"/><Transition id="1171" from="1168" to="1170"/><Transition id="1176" from="1173" to="1175"/><Transition id="1178" from="1130" to="1133"/><Transition id="1179" from="1139" to="1143"/><Transition id="1180" from="1139" to="1168"/><Transition id="1181" from="1139" to="1173"/><Transition id="1182" from="1147" to="1151"/><Transition id="1183" from="1170" to="1151"/><Transition id="1184" from="1175" to="1151"/><Transition id="1185" from="1153" to="1157"/><Transition id="1186" from="1153" to="1165"/><Transition id="1187" from="1157" to="1161"/><Transition id="1188" from="1165" to="1161"/><Transition id="1190" from="1161" to="1189"/></Transitions></WorkflowProcess>';
        
    class FlowExhibitionG6 extends Component {
        constructor(props) {
            super(props);
            this.state={
                data:{}
            }
        }
        
        stateColorShow=()=>{
            var stateArr = [];
            for (var Key in stateConfig){
                var obj = {};
                obj.text = stateConfig[Key][0];
                obj.col = stateConfig[Key][1];
                stateArr.push(obj)
              }
              return (
                <ul  className={`${cx('list')}`} >
                    {stateArr.map((item,index) =>
                        <li key={index}> 
                            <div style={{backgroundColor:item.col}} className={item.text=="正在处理"?`${cx('breathe_btn')}`:null}></div>
                            <div >
                                {item.text}
                            </div>
                        </li>
                    )}
                </ul>
            );
        }
       
        //解析xml字符串为DOM
        parseXML=(xmlString)=>{
            var xmlDoc = null;
            //判断浏览器的类型
            //支持IE浏览器
            if(!window.DOMParser && window.ActiveXObject) { //window.DOMParser 判断是否是非ie浏览器
                var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
                for(var i = 0; i < xmlDomVersions.length; i++) {
                    try {
                        xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                        break;
                    } catch(e) {}
                }

            }
            //支持Mozilla浏览器
            else if(window.DOMParser && document.implementation && document.implementation.createDocument) {
                try {
                    /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                    * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                    * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                    * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                    */
                    var domParser = new DOMParser();
                    xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
                } catch(e) {}
            } else {
                return null;
            }
            return xmlDoc;
        }
        loaderG6=(xmlData)=>{
            
            G6.registerNode('circle', {
                draw(cfg, group){
                let imgType;
                switch(cfg.label){
                    case "开始节点":
                        imgType = startIamge
                        break;
                    case "结束节点":
                        imgType = endIamge
                        break;
                    case "控制节点":
                        imgType = controlIamge
                        break;
                    case "合并节点":
                        imgType = mergeIamge
                        break;
                    case "并行节点":
                        imgType = parallelIamge
                        break;
                    case "未处理":
                        imgType = abnormalIamge
                        break;
                    default:
                        imgType = tacheIamge
                }
                group.addShape('text', {
                    attrs: {
                    x:0,
                    y: 40,
                    fill: '#333333',
                    text: cfg.label,
                    fontSize: 14,
                    textAlign: 'center',
                    }
                });
                
                if(cfg.origin.colorState== "10D"){
                    let an = group.addShape('circle', {
                        attrs: {
                        x: 0,
                        y: 0,
                        r: 20,
                        stroke:"#51C4F8 ",
                        shadowColor:"#51C4F8",
                        shadowBlur:10,
                        fill:cfg.color
                        }
                    }).animate({
                            stroke:"#45bff6",
                            shadowColor:"#45bff6",
                            shadowBlur:10,
                            repeat: true,
                          },800, 'easeOutBack')
                }else{
                    group.addShape('circle', {
                        attrs: {
                        x: 0,
                        y: 0,
                        r: 20,
                        fill:cfg.color
                        }
                    })
                }
                group.addShape('image', {
                    attrs: {
                        x: -13,
                        y: -13,
                        width:26,
                        height:26,
                        img:imgType
                    }
                });
    
                return group.addShape('circle', {
                    attrs: {
                    x: 0,
                    y: 0,
                    r: 24,
                    fill:'transparent'
                    }
                });
                }
            });
            const dagre = new Plugins['layout.dagre']({
                rankdir: 'LR',
                nodesep: 40,
                ranksep: 100,
                useEdgeControlPoint:false
            });
            const net = new G6.Net({
            id: 'flowExhibitionG6',
            height: 350,
            grid: null,
            useAnchor:true,
            fitView: 'lc',
            mode: 'drag',
            plugins: [dagre]
            });
            net.clear();
            net.tooltip(true);
            net.source(xmlData.nodes, xmlData.edges);
            net.node().tooltip('id');
            net.render();
            
        }
        loadData=()=>{
            const param = {
                processInstanceId:this.props.flowInstance.processInstanceId,
                "isHistory":false
            };
            http.post('/call/call.do',{
                bean: 'FlowInstServ',
                method: 'getFlowGraphXml',//'qryWorkItemByCond',
                param: param
                //{"processInstanceId":"","startDate":"2018-04-01 00:00","endDate":"2018-04-02 23:59","state":1,"pageIndex":1,"pageSize":20,"sortColumn":"assignedDate","sortOrder":"asc","tacheId":"","systemCode":"ITS"}
            },{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }).then(res => {
                const xmlCode = JSON.parse(res);
                // console.log(parseXML(xmlCode).getElementsByTagName('Transition'));
                console.log(xmlCode)
                const xmlDomNodes = this.parseXML(xmlCode).getElementsByTagName('Activity');
                const xmlDomEdges = this.parseXML(xmlCode).getElementsByTagName('Transition');
                const arrNodes =[];
                const arrEdges =[];
                
                for(let i =0;i<xmlDomNodes.length;i++){
                    // console.log(xmlDomNodes[i].getAttribute("state"))
                                let nodeColor;
                                switch(xmlDomNodes[i].getAttribute("name")){
                                    case "开始节点":
                                    nodeColor = "#5dbe16"
                                        break;
                                    case "结束节点":
                                    nodeColor = "#fe0200"
                                        break;
                                    case "控制节点":
                                        nodeColor = "#349bff"
                                        break;
                                    case "合并节点":
                                        nodeColor = "#349bff"
                                        break;
                                    case "并行节点":
                                        nodeColor = "#349bff"
                                        break;
                                    default:
                                    nodeColor = stateConfig[!xmlDomNodes[i].getAttribute("state")?'10I':xmlDomNodes[i].getAttribute("state")][1]
                                }
                            const nodesObj ={
                                    "shape":"circle",
                                    "label":xmlDomNodes[i].getAttribute("name"),
                                    "id":xmlDomNodes[i].getAttribute("id"),
                                    "colorState":!xmlDomNodes[i].getAttribute("state")?'10I':xmlDomNodes[i].getAttribute("state"),
                                    "color": nodeColor,
                                    // "color":"red"
                            }
                            arrNodes.push(nodesObj)
                }
                for(let i =0;i<xmlDomEdges.length;i++){
                            const edgesObj = {
                                    "shape": "thisEdge",
                                    "source": xmlDomEdges[i].getAttribute("from"),
                                    "target": xmlDomEdges[i].getAttribute("to"),
                                    "id": xmlDomEdges[i].getAttribute("id"),
                                    "size": 1,
                                    "color":"#333333"
                            }
                            arrEdges.push(edgesObj)
                }
                const xmlData ={
                    "nodes":arrNodes,
                    "edges":arrEdges
                }
        
                xmlData.nodes.map(function(e){
                        		console.log(e.colorState)
                                if(e.colorState=="10D"){
                        			console.log(e.id)
                        xmlData.edges.map(function(a){
                                        if(e.id == a.source){
                                            a.color =stateConfig['10I'][1]
                                        }
                                    })
                                }
                })       
                this.loaderG6(xmlData)
            },res => {

            });
        }

        componentDidMount() {
            this.loadData();
        }

        render(){
            //this.props.flowInstance为当前选择的流程实例
            return ( 
            <div id="flowExhibitionG6" >
                {this.stateColorShow()}
            </div>
            );
        }

}

export default FlowExhibitionG6;
