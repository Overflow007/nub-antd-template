import {
  observable,
  action,
  toJS,
  computed
} from 'mobx';
import history from 'common/history';
import _ from 'lodash';
import {
  extractPath
} from 'common/path';
import http from 'common/http';

/**
 * 会话模型
 */
class SessionModel {

  /**
   * token字符串
   */
  @observable
  token = '';

  @action
  setToken = t => {
    this.token = t;
  };

  /**
   * 用户信息
   * Examples:
   *
   *    {
   *      "staff":{
   *                "userId":"311",
   *                "userSex":"20",
   *                "userCode":"320322199201160642",
   *                "userType":"10",
   *                "userPoliceId":"202012",
   *                "userMobileLong":"15996212305",
   *                "userMobileShort":"",
   *                "userMobileLongDianxin":"",
   *                "userMobileShortDianxin":"",
   *                "userMobileOther":"",
   *                "officeEmail":"",
   *                "userPartType":"30","orgId":"8","orgCode":"320000323100","fullName":"政工一处","phone":"025-89883117","officeAddress":"金盾饭店312","userJobDesc":"在职","userStatus":"2000","orderIndex":"311","userMainId":"92c64653419f44579a8fb7fed8879e1f","userIndate":"2018-03-31 11:17:57",
   *                "userBaseStatus":"2000",
   *                "gacn":"尹晴 320322199201160642",
   *                "staffId":0,
   *                "userName":"尹晴"
   *        },
   *        "org":{
   *              "orgId":"8","orgCode":"320000323100","oldOrgCode":"320000323100","orgName":"政工一处","fullName":"政工一处","orgShortName":"政工一处","dictionaryName":"","otherName":"","orgNameAlias":"","orgFullNameAlias":"","orgType":"10","orgKindPropStr":"","orgStartDate":"2018-03-31 10:54:11","parentCode":"320000320000","fullCode":"320000000000.320000000000.320000320000.320000323100","orgStatus":"2000","orderCode":"320000323100","orgIndate":"2018-03-31 10:54:11","parentId":"7","routeId":0
   *        },
   *        "tenantCode":"ITS",
   *        "roleCodes":["ZTEFlowModelAdmin","FlowAdmin","Staff"],
   *        "authCodesMap":{
   *            "other":["flow_menu","flow_button","bdgl","xtgl","ten"],
   *            "menu":["acceptFlow","pmessageMonitHis","lcjk","pmessageMonit","menuManage","errorManage","errorManageHis","processInstManageHis","flowLimitManage","lccs","pageElementManage","undoWorkItemManager","dispatchRuleManage","package","messageMonit","workTimeManage","orgManage","batchDealManage","lslcjk","lcgl","reasonManage","processInstManage","privManage","staffManage","tacheManage","stressTest","lcpz","holidayManage","tacheLimitManage","cacheManage","sxgl","pageTemplateManage"],
   *            "ten":["ITS"],
   *            "btn":["editFlowDispatchRule","disableVersion","deleteTache","editFlowParams","openVersion","enableVersion","editVersion","deleteVersion","saveAsVersion"]
   *        }
   * }
   * 
   */
  @observable
  profile = {};

  /**
   * 获取当前的角色编码列表
   * 
   * Examples:
   * ["ZTEFlowModelAdmin","FlowAdmin","Staff"]
   * 
   * @api public
   */
  @computed get roles() {
    if (this.profile && this.profile.roleCodes) {
      return this.profile.roleCodes;
    }
    return [];
  }

  /**
   * 获取当前的按钮权限
   * 
   * Examples:
   * ["editFlowDispatchRule","disableVersion","deleteTache","editFlowParams","openVersion","enableVersion","editVersion","deleteVersion","saveAsVersion"]
   * 
   * @api public
   */
  @computed get buttonPrivCodes() {
    if (this.profile && this.profile.authCodesMap && this.profile.authCodesMap.btn) {
      return this.profile.authCodesMap.btn;
    }
    return [];
  }

  @action
  setProfile = p => {
    this.profile = p;
  };

  /**
   * 租户信息数组
   */
  @observable
  tendants = [];

  /**
   * 预登陆标识，用于预登陆动画，系统自用
   * 
   * @api private
   */
  @observable
  preLogin = false;

  @action
  setPreLogin = p => {
    this.preLogin = p;
  };

  /**
   * 是否已向后台查询Session信息
   */
  @observable
  hasQrySession = false;

  /**
   * 查询是否有菜单信息
   * 
   * @api public
   */
  @computed get hasMenus() {
    return this.menus != null;
  }

  /**
   * 查询是否已登录
   * 
   * @api public
   */
  @computed get hasLogin() {
    return this.token != null && this.token != '';
  }

  /**
   * 从sessionStorage里同步session信息
   * 
   * @api public
   */
  @action
  syncSession = () => {
    if (global.sessionStorage.getItem('token') != null) {

      this.setToken(global.sessionStorage.getItem('token'));
      this.setProfile(JSON.parse(global.sessionStorage.getItem('profile')));

      this.tendants = JSON.parse(global.sessionStorage.getItem('tendants'));

      return true;
    }
    return false;
  }

  /**
   * 获取当前的租户信息
   * 
   * @api public
   */
  @computed get currentTendant() {
    if (this.profile && this.profile.tenantCode) {
      return {
        'tenantCode': this.profile.tenantCode
      }
    }
    return {
      'tenantCode': 'ITS'
    }
  }

  /**
   * 前端js登录，用于渲染
   * 
   * @api public
   */
  @action
  login = (
    token,
    profile,
    tendants
  ) => {
    this.setToken(token);
    this.setProfile(profile);
    this.tendants = tendants;
    this.setMenus(null);
    this.hasQrySession = true;
    this.preLogin = false;
    global.sessionStorage.setItem('token', token);
    global.sessionStorage.setItem('profile', JSON.stringify(profile));
    global.sessionStorage.setItem('tendants', JSON.stringify(tendants));

    http.get('/user/qryMenus.qry').then(res => {

      let ret = [];
      try {
        ret = JSON.parse(res);
      }
      catch (e) {

      }
      console.log('qryMenus.qry', ret);
      if (ret == null) ret = [];
      ret.push({
        id: 2,
        parentId: 0,
        menuName: "主页",
        "pathname": "/home",
        "entry": "routes/Home/index",
        show: false,
        icon: 'mail'
      });
      this.setMenus(ret);


    }, ret => {
      console.log('查询菜单失败');
      this.setMenus([{
        id: 2,
        parentId: 0,
        menuName: "主页",
        "pathname": "/home",
        "entry": "routes/Home/index",
        show: false,
        icon: 'mail'
      }]);

    });

  }

  /**
   * 前端js登出，用于渲染
   * 
   * @api public
   */
  @action
  logout = () => {
    this.token = '';
    this.profile = {};
    this.tendants = [];
    this.setMenus(null);
    this.preLogin = false;
    this.hasQrySession = false;
    global.sessionStorage.setItem('token', this.token);
    global.sessionStorage.setItem('profile', JSON.stringify(this.profile));
    global.sessionStorage.setItem('tendants', JSON.stringify(this.tendants));

    if (this.hasBasicAppName) {
      history.push('/' + extractPath);
    } else {
      history.push('');
    }

  }

  /**
   * 菜单数组
   * 
   * @api public
   */
  @observable
  menus = null;

  /**
   * 遍历菜单项根据填充父子菜单id填充菜单的menuPath
   * 
   * Examples:
   * 0.201.300
   * 
   * @api private
   */
  fillMenuPath = (arr, m) => {
    let parentId = 0,
      parentMenuPath = '0';
    if (m != null) {
      parentId = m.id;
      parentMenuPath = m.menuPath;
    }

    const children = _.filter(arr, x => {
      const isMatch = (x.show !== false && x.parentId == parentId);

      if (isMatch) {
        x.menuPath = parentMenuPath + '.' + x.id;
      }

      return isMatch;
    });

    if (children && children.length > 0) {
      _.each(children, c => this.fillMenuPath(arr, c));
    }

  }

  /**
   * 设置菜单数组
   * 
   * @api public
   */
  @action
  setMenus = c => {
    if (c) {
      this.fillMenuPath(c);
    }

    this.menus = c;
  };

  /**
   * url是否有带uos-manager的前缀
   * 
   * @api public
   */
  hasBasicAppName = null;
}

const session = new SessionModel();

export default session;