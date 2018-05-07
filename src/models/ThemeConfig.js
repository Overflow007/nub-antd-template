import { observable, action, toJS, computed } from 'mobx';
import _ from 'lodash';
import history from 'common/history';

class ThemeConfigModel{
    @observable 
    collapsed = false;

    @action
    setCollapsed = c => {
      this.collapsed = c;
    };

    @observable 
    tabs = [];

    @observable 
    activeTabIndex = 0;

    @action
    addTab = c => {
      this.tabs.push(c);

      this.setActiveTabIndex(this.tabs.length - 1);
    };

    getTab= (id)=>_.find(this.tabs,x=>x.id==id);

    @action
    removeTab = id => {
      let idx = _.findIndex(this.tabs,x=>x.id==id);
      if(idx>-1){
        _.pull(this.tabs, this.tabs[idx]);
        idx--;
        if (idx < 0){
          idx = 0;
        }
        this.setActiveTabIndex(this.tabs[idx]?this.tabs[idx].id:0);
      }
    };

    @computed get activeIndex() {
      return this.activeTabIndex.toString();
    }

    @action
    setActiveTabIndex = index => {
      const newActiveTab = this.getTab(index);
      if(newActiveTab != null){
        const {location} = global;
        if(location.pathname!=newActiveTab.pathname){
          history.push(newActiveTab.pathname);
        }

        document.title='流程平台-'+newActiveTab.title;
      }
      this.activeTabIndex = index;
    }
   
    containTab = (pathname) => {
      const t = _.find(this.tabs, x => x.pathname == pathname);
      return t != null && t.id;
    }
    
    clear=()=>{
      this.tabs=[];
      this.activeTabIndex=0;
      this.collapsed=false;
    }
}

const themeConfig = new ThemeConfigModel();

export default themeConfig;