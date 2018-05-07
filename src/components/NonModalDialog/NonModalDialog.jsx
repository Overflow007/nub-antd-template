import React, { Component } from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';
import utils from 'common/utils';
import styles from './NonModalDialog.scss';

const PREFIX = 'dialog_nonmodal';

const cx = utils.classnames(PREFIX, styles);

class NonModalDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            dragStarting: false,
            dragging: false,
            downX: 0,
            downY: 0,
            moveX: 0,
            moveY: 0
        }

        this.dragParam = {
            dragStarting: false,
            dragging: false,
            downX: 0,
            downY: 0,
            moveX: 0,
            moveY: 0
        }
    }

    componentWillReceiveProps(nextProp) {
        this.setState({
            visible: nextProp.visible
        })
    }

    refCb = (instance) => {
        this.ins = instance;
        if(this.ins){

        }
    }

    getDivProps = () => {
        const p = {
            ...this.props
        }

        delete p.children;
        delete p.visible;
        delete p.onCancel;

        return p;
    }
    mouseUp = (e) => {
        console.log('onMouseUp')
        e.stopPropagation();
        //e.preventDefault();
        _.merge(this.dragParam,{
            dragStarting: false,
            dragging: false,
            downX: 0,
            downY: 0,
            moveX: 0,
            moveY: 0
        });
        
    }

    mouseMove=(e) => {
        e.stopPropagation();
        //e.preventDefault();
        if(this.dragParam.dragStarting){
            //e.persist();

            _.merge(this.dragParam,{
                dragging: true,
                moveX: e.clientX,
                moveY: e.clientY
            });
            
            
            if(this.ins){
                const ot = this.dragParam.downY-this.dragParam.offsetTop;
                const ol = this.dragParam.downX-this.dragParam.offsetLeft;
                this.ins.style.right='auto';
                this.ins.style.top= (e.clientY - ot) +'px';
                this.ins.style.left=(e.clientX - ol) +'px';
                
            }
        }
        

    };
    componentDidMount() {
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseup", this.mouseUp);
      }

      componentWillUnmount() {
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseUp);
        
      }

    render() {
        return (
            <div className={`${PREFIX}`}  ref={this.refCb}  
            
            onMouseDown={(e) => {
                e.stopPropagation();
                //e.preventDefault();
                console.log('onMouseDown')
                _.merge(this.dragParam,{
                    //dragStarting: true,
                    downX: e.clientX,
                    downY: e.clientY
                });

                if(this.ins){
                    _.merge(this.dragParam,{
                        dragStarting: true,
                        offsetTop: this.ins.offsetTop ,
                        offsetLeft: this.ins.offsetLeft
                    });
                    
                    
                }
            }}
                style={_.merge({
                    display: (this.state.visible ? 'block' : 'none')
                },this.props.style)} {...this.getDivProps()}>
                <span>
                    <div className={"ant-notification-notice ant-notification-notice-closable"}>
                        <div className={"ant-notification-notice-content"}>
                            <div >
                                <div className={"ant-notification-notice-message"}>{(this.props.title ? this.props.title : '')}</div>
                                <div className={"ant-notification-notice-description"} 
                                style={{ cursor: 'auto' }}
                                onMouseDown = {(e) => {
                                    e.stopPropagation();
                                    }}
                                onMouseUp = {(e) => {
                                    e.stopPropagation();
                                    }}
                                onMouseMove = {(e) => {
                                    e.stopPropagation();
                                    }}
                                >

                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                        <a className={"ant-notification-notice-close"} onClick={(e) => {
                            if (this.props.onCancel) {
                                this.props.onCancel(e);
                            } else {
                                this.setState({
                                    visible: false
                                })
                            }
                        }}>
                            <span className={"ant-notification-notice-close-x"}></span>
                        </a>
                    </div>
                </span>
            </div>
        );
    }
}

export default NonModalDialog;