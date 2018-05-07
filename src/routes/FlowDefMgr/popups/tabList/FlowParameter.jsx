import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import http from 'common/http';
import utils from 'common/utils';
import AsynchronousLinkSelectTree from 'components/AsynchronousLinkSelectTree';




class FlowParameter extends Component {
    constructor(props) {
        super(props);
        // this.popupModel = popupModel;
        this.state={
            loading:true,
            data:[]
        }
       
    }
    onSelect=(value)=>{
      console.log(value)
    }
    onChange=(value,label)=>{
      console.log(value)
      console.log(label)
    }
    componentDidMount() {

    }

    render(){

        return (
        <div>
                    <AsynchronousLinkSelectTree
                     style={{ width: 300 }}
                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                     placeholder='请选择'
                     onChange={this.onChange}
                     onSelect= {this.onSelect}
                     size= 'small'

                    />
                  
          </div> 
          );
    }

}

export default FlowParameter;