import { observable, action, toJS, computed } from 'mobx';
import _ from 'lodash';


class FlowInstanceModel{
    @observable 
    showFlowExhibition = false;

    @observable
    showReturnOrder = false;

    @observable
    showProcessJump = false;

    @observable
    showWorkitemOperations = false;

    @observable
    workitemOperationsTop = '0px';

    @observable
    showFlowMsg = false;
    
    @observable
    workitemOperationsLeft = '464.531px';

    @observable
    workItem = {};

    triggerReload = null;

    clear=()=>{
        this.triggerReload=null;
        this.workItem={};
        this.showReturnOrder=false;
        this.showProcessJump=false;
        this.showFlowExhibition=false;
        this.showWorkitemOperations=false;
        this.showFlowMsg = false;
    }
}

const model = new FlowInstanceModel();

export default model;