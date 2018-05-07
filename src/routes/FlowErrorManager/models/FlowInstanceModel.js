import { observable, action, toJS, computed } from 'mobx';
import _ from 'lodash';


class FlowInstanceModel{
    @observable 
    showFlowExhibition = false;

    @observable
    workitemOperationsTop = '0px';
    
    @observable
    workitemOperationsLeft = '464.531px';

    @observable
    workItem = {};

    triggerReload = null;

    clear=()=>{
        this.triggerReload=null;
        this.workItem={};
        this.showFlowExhibition=false;
    }
}

const model = new FlowInstanceModel();

export default model;