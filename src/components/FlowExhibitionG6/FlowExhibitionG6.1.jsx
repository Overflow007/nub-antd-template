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
                processDefineCode:this.props.processDefineCode
                
            };
            http.post('/call/call.do',{
                bean: 'FlowServ',
                method: 'qryProcessDefineByCode',
                param: param
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
