const mockData = {
  // GET POST or nothing

  /* 在库人员统计 */
  'GET /home/stats': {
    czrk: 14358475, //常住人口
    zzrk: 9432213, //暂住人口
    wjzh: 232234, //外籍在沪
    wlhcz: 23342, //未落户常住
    zdrk: 3223, //重点人口
    total: 14353475 + 9432213 + 232234 + 23342 + 3223, //所有人口总数
  },
  'GET /user/getTenants.qry': (type,typeArg,req,res)=>{
    res.setHeader('content-type', 'text/html;charset=UTF-8');
    
    if (type === 'proxy'&&typeArg.statusCode==200) {
      let body = new Buffer('');
      typeArg.on('data', function (data) {
        body = Buffer.concat([body, data]);
      });
      typeArg.on('end', function (event) {
        body = body.toString();

        if (body == 'null') {
          body = '[{"tenantName":"IT服务平台","tenantCode":"ITS"},{"tenantName":"4A管理平台","tenantCode":"4A"}]';
        }
        res.end(body);
        
      });
    }else{
      res.end('[{"tenantName":"IT服务平台","tenantCode":"ITS"},{"tenantName":"4A管理平台","tenantCode":"4A"}]');
    }
  }, 
  'POST /user/setTenant.do':(type,typeArg,req,res)=>{
    
    res.setHeader('content-type', 'text/html;charset=UTF-8');
    if (type === 'proxy'&&typeArg.statusCode==200) {
     
      let body = new Buffer('');
      typeArg.on('data', function (data) {
        body = Buffer.concat([body, data]);
      });
      typeArg.on('end', function (event) {
        body = body.toString();

        if (body == 'null') {
          body = '{"staff":{"userId":"311","userSex":"20","userCode":"320322199201160642","userType":"10","userPoliceId":"202012","userMobileLong":"15996212305","userMobileShort":"","userMobileLongDianxin":"","userMobileShortDianxin":"","userMobileOther":"","officeEmail":"","userPartType":"30","orgId":"8","orgCode":"320000323100","fullName":"政工一处","phone":"025-89883117","officeAddress":"金盾饭店312","userJobDesc":"在职","userStatus":"2000","orderIndex":"311","userMainId":"92c64653419f44579a8fb7fed8879e1f","userIndate":"2018-03-31 11:17:57","userBaseStatus":"2000","gacn":"尹晴 320322199201160642","staffId":0,"userName":"尹晴"},"org":{"orgId":"8","orgCode":"320000323100","oldOrgCode":"320000323100","orgName":"政工一处","fullName":"政工一处","orgShortName":"政工一处","dictionaryName":"","otherName":"","orgNameAlias":"","orgFullNameAlias":"","orgType":"10","orgKindPropStr":"","orgStartDate":"2018-03-31 10:54:11","parentCode":"320000320000","fullCode":"320000000000.320000000000.320000320000.320000323100","orgStatus":"2000","orderCode":"320000323100","orgIndate":"2018-03-31 10:54:11","parentId":"7","routeId":0},"tenantCode":"ITS","roleCodes":["ZTEFlowModelAdmin","FlowAdmin","Staff"],"authCodesMap":{"other":["flow_menu","flow_button","bdgl","xtgl","ten"],"menu":["acceptFlow","pmessageMonitHis","lcjk","pmessageMonit","menuManage","errorManage","errorManageHis","processInstManageHis","flowLimitManage","lccs","pageElementManage","undoWorkItemManager","dispatchRuleManage","package","messageMonit","workTimeManage","orgManage","batchDealManage","lslcjk","lcgl","reasonManage","processInstManage","privManage","staffManage","tacheManage","stressTest","lcpz","holidayManage","tacheLimitManage","cacheManage","sxgl","pageTemplateManage"],"ten":["ITS"],"btn":["editFlowDispatchRule","disableVersion","deleteTache","editFlowParams","openVersion","enableVersion","editVersion","deleteVersion","saveAsVersion"]}}';
        }
        res.end(body);
        
      });
    }else{
      res.end('{"staff":{"userId":"311","userSex":"20","userCode":"320322199201160642","userType":"10","userPoliceId":"202012","userMobileLong":"15996212305","userMobileShort":"","userMobileLongDianxin":"","userMobileShortDianxin":"","userMobileOther":"","officeEmail":"","userPartType":"30","orgId":"8","orgCode":"320000323100","fullName":"政工一处","phone":"025-89883117","officeAddress":"金盾饭店312","userJobDesc":"在职","userStatus":"2000","orderIndex":"311","userMainId":"92c64653419f44579a8fb7fed8879e1f","userIndate":"2018-03-31 11:17:57","userBaseStatus":"2000","gacn":"尹晴 320322199201160642","staffId":0,"userName":"尹晴"},"org":{"orgId":"8","orgCode":"320000323100","oldOrgCode":"320000323100","orgName":"政工一处","fullName":"政工一处","orgShortName":"政工一处","dictionaryName":"","otherName":"","orgNameAlias":"","orgFullNameAlias":"","orgType":"10","orgKindPropStr":"","orgStartDate":"2018-03-31 10:54:11","parentCode":"320000320000","fullCode":"320000000000.320000000000.320000320000.320000323100","orgStatus":"2000","orderCode":"320000323100","orgIndate":"2018-03-31 10:54:11","parentId":"7","routeId":0},"tenantCode":"ITS","roleCodes":["ZTEFlowModelAdmin","FlowAdmin","Staff"],"authCodesMap":{"other":["flow_menu","flow_button","bdgl","xtgl","ten"],"menu":["acceptFlow","pmessageMonitHis","lcjk","pmessageMonit","menuManage","errorManage","errorManageHis","processInstManageHis","flowLimitManage","lccs","pageElementManage","undoWorkItemManager","dispatchRuleManage","package","messageMonit","workTimeManage","orgManage","batchDealManage","lslcjk","lcgl","reasonManage","processInstManage","privManage","staffManage","tacheManage","stressTest","lcpz","holidayManage","tacheLimitManage","cacheManage","sxgl","pageTemplateManage"],"ten":["ITS"],"btn":["editFlowDispatchRule","disableVersion","deleteTache","editFlowParams","openVersion","enableVersion","editVersion","deleteVersion","saveAsVersion"]}}');
    }
    
    
  },
  'GET /user/getSession.qry':(type,typeArg,req,res)=>{
    
    res.setHeader('content-type', 'text/html;charset=UTF-8');
    if (type === 'proxy'&&typeArg.statusCode==200) {
     
      let body = new Buffer('');
      typeArg.on('data', function (data) {
        body = Buffer.concat([body, data]);
      });
      typeArg.on('end', function (event) {
        body = body.toString();

        if (body == 'null') {
          body = '{"staff":{"userId":"311","userSex":"20","userCode":"320322199201160642","userType":"10","userPoliceId":"202012","userMobileLong":"15996212305","userMobileShort":"","userMobileLongDianxin":"","userMobileShortDianxin":"","userMobileOther":"","officeEmail":"","userPartType":"30","orgId":"8","orgCode":"320000323100","fullName":"政工一处","phone":"025-89883117","officeAddress":"金盾饭店312","userJobDesc":"在职","userStatus":"2000","orderIndex":"311","userMainId":"92c64653419f44579a8fb7fed8879e1f","userIndate":"2018-03-31 11:17:57","userBaseStatus":"2000","gacn":"尹晴 320322199201160642","staffId":0,"userName":"尹晴"},"org":{"orgId":"8","orgCode":"320000323100","oldOrgCode":"320000323100","orgName":"政工一处","fullName":"政工一处","orgShortName":"政工一处","dictionaryName":"","otherName":"","orgNameAlias":"","orgFullNameAlias":"","orgType":"10","orgKindPropStr":"","orgStartDate":"2018-03-31 10:54:11","parentCode":"320000320000","fullCode":"320000000000.320000000000.320000320000.320000323100","orgStatus":"2000","orderCode":"320000323100","orgIndate":"2018-03-31 10:54:11","parentId":"7","routeId":0},"tenantCode":"ITS","roleCodes":["ZTEFlowModelAdmin","FlowAdmin","Staff"],"authCodesMap":{"other":["flow_menu","flow_button","bdgl","xtgl","ten"],"menu":["acceptFlow","pmessageMonitHis","lcjk","pmessageMonit","menuManage","errorManage","errorManageHis","processInstManageHis","flowLimitManage","lccs","pageElementManage","undoWorkItemManager","dispatchRuleManage","package","messageMonit","workTimeManage","orgManage","batchDealManage","lslcjk","lcgl","reasonManage","processInstManage","privManage","staffManage","tacheManage","stressTest","lcpz","holidayManage","tacheLimitManage","cacheManage","sxgl","pageTemplateManage"],"ten":["ITS"],"btn":["editFlowDispatchRule","disableVersion","deleteTache","editFlowParams","openVersion","enableVersion","editVersion","deleteVersion","saveAsVersion"]}}';
        }
        res.end(body);
        
      });
    }else{
      res.end('{"staff":{"userId":"311","userSex":"20","userCode":"320322199201160642","userType":"10","userPoliceId":"202012","userMobileLong":"15996212305","userMobileShort":"","userMobileLongDianxin":"","userMobileShortDianxin":"","userMobileOther":"","officeEmail":"","userPartType":"30","orgId":"8","orgCode":"320000323100","fullName":"政工一处","phone":"025-89883117","officeAddress":"金盾饭店312","userJobDesc":"在职","userStatus":"2000","orderIndex":"311","userMainId":"92c64653419f44579a8fb7fed8879e1f","userIndate":"2018-03-31 11:17:57","userBaseStatus":"2000","gacn":"尹晴 320322199201160642","staffId":0,"userName":"尹晴"},"org":{"orgId":"8","orgCode":"320000323100","oldOrgCode":"320000323100","orgName":"政工一处","fullName":"政工一处","orgShortName":"政工一处","dictionaryName":"","otherName":"","orgNameAlias":"","orgFullNameAlias":"","orgType":"10","orgKindPropStr":"","orgStartDate":"2018-03-31 10:54:11","parentCode":"320000320000","fullCode":"320000000000.320000000000.320000320000.320000323100","orgStatus":"2000","orderCode":"320000323100","orgIndate":"2018-03-31 10:54:11","parentId":"7","routeId":0},"tenantCode":"ITS","roleCodes":["ZTEFlowModelAdmin","FlowAdmin","Staff"],"authCodesMap":{"other":["flow_menu","flow_button","bdgl","xtgl","ten"],"menu":["acceptFlow","pmessageMonitHis","lcjk","pmessageMonit","menuManage","errorManage","errorManageHis","processInstManageHis","flowLimitManage","lccs","pageElementManage","undoWorkItemManager","dispatchRuleManage","package","messageMonit","workTimeManage","orgManage","batchDealManage","lslcjk","lcgl","reasonManage","processInstManage","privManage","staffManage","tacheManage","stressTest","lcpz","holidayManage","tacheLimitManage","cacheManage","sxgl","pageTemplateManage"],"ten":["ITS"],"btn":["editFlowDispatchRule","disableVersion","deleteTache","editFlowParams","openVersion","enableVersion","editVersion","deleteVersion","saveAsVersion"]}}');
    }
    
    
  },
  'GET /user/qryMenus.qry':(type,typeArg,req,res)=>{
    res.setHeader('content-type', 'text/html;charset=UTF-8');
    if (type === 'proxy'&&typeArg.statusCode==200) {
      
      let body = new Buffer('');
      typeArg.on('data', function (data) {
        body = Buffer.concat([body, data]);
      });
      typeArg.on('end', function (event) {
        body = body.toString();
        if (body == 'null'||body == '') {
          body = '[{"urlString":"","icon":"schedule","iconColor":"rgb(86, 74","show":true,"menuName":"流程管理","id":201,"parentId":0,"pathname":""},{"urlString":"","icon":"appstore","iconColor":"#564aa3","show":true,"menuName":"流程配置","id":204,"parentId":0,"pathname":""},{"urlString":"","icon":"eye","iconColor":"#1797be","show":true,"menuName":"流程监控","id":205,"parentId":0,"pathname":""},{"urlString":"","icon":"wallet","iconColor":"rgb(39, 19","show":true,"menuName":"历史流程监控","id":206,"parentId":0,"pathname":""},{"urlString":"","icon":"schedule","iconColor":"#51c6ea","show":true,"menuName":"时限管理","id":207,"parentId":0,"pathname":""},{"urlString":"","icon":"exception","show":false,"menuName":"流程测试","id":211,"parentId":0,"pathname":""},{"entry":"routes/AcceptFlow/index","urlString":"../flow/accept/acceptFlow.html","show":true,"menuName":"业务受理","id":361,"iconFileName":"(null)","parentId":201,"pathname":"/acceptflow"},{"entry":"routes/DispatchRule/index","urlString":"../flow/dispatchrule/dispatchRule.html","show":true,"menuName":"派发规则管理","id":382,"iconFileName":"(null)","parentId":361,"pathname":"/dispatchrule"},{"entry":"routes/PageElementManager/index","urlString":"../form/formmanager/pageElementManager.html","show":true,"menuName":"元素管理","id":315,"parentId":202,"pathname":"/pageelementmanager"},{"entry":"routes/TemplateManager/index","urlString":"../form/formmanager/templateManager.html","show":true,"menuName":"模板管理","id":316,"parentId":202,"pathname":"/templatemanager"},{"entry":"routes/MenuManager/index","urlString":"../oaas/menu/menuManager.html","show":true,"menuName":"菜单管理","id":318,"parentId":203,"pathname":"/menumanager"},{"entry":"routes/PrivManager/index","urlString":"../oaas/priv/privManager.html","show":true,"menuName":"权限管理","id":321,"parentId":203,"pathname":"/privmanager"},{"entry":"routes/OrgManager/index","urlString":"../oaas/org/orgManager.html","show":true,"menuName":"组织管理","id":362,"iconFileName":"(null)","parentId":203,"pathname":"/orgmanager"},{"entry":"routes/StaffManager/index","urlString":"../oaas/staff/staffManager.html","show":true,"menuName":"人员管理","id":381,"iconFileName":"(null)","parentId":203,"pathname":"/staffmanager"},{"entry":"routes/TacheMgr/index","urlString":"../flow/tache/tacheManager.html","show":true,"menuName":"环节管理","id":301,"parentId":204,"pathname":"/tachemanager"},{"entry":"routes/ExceptionManager/index","urlString":"../flow/exception/exceptionManager.html","show":true,"menuName":"异常原因管理","id":302,"parentId":204,"pathname":"/exceptionmanager"},{"entry":"routes/FlowDefMgr/index","urlString":"../flow/design/flowDefManager.html","show":true,"menuName":"流程建模","id":303,"parentId":204,"pathname":"/flowdefmanager"},{"entry":"routes/CacheManager/index","urlString":"../flow/cache/cacheManager.html","show":true,"menuName":"缓存管理","id":384,"iconFileName":"(null)","parentId":204,"pathname":"/cachemanager"},{"entry":"routes/FlowInstanceMgr/index","urlString":"../flow/instmanager/flowInstManager.html","show":true,"menuName":"流程实例管理","id":304,"parentId":205,"pathname":"/flowinstancemgr"},{"entry":"routes/FlowErrorManager/index","urlString":"../flow/flowerror/flowErrorManager.html","show":true,"menuName":"流程异常管理","id":305,"parentId":205,"pathname":"/flowerrormanager"},{"entry":"routes/CommandErrorManager/index","urlString":"../flow/command/commandErrorManager.html","show":true,"menuName":"流程消息监控","id":306,"parentId":205,"pathname":"/commanderrormanager"},{"entry":"routes/FQueueMonitor/index","urlString":"../queue/fQueueMonitor.html","show":true,"menuName":"消息监控","id":307,"parentId":205,"pathname":"/foueuemonitor"},{"entry":"routes/BatchDealManager/index","urlString":"../flow/flowerror/batchDealManager.html","show":true,"menuName":"消息批量重投","id":317,"parentId":205,"pathname":"/batchdealmanager"},{"entry":"routes/UndoWorkItemManager/index","urlString":"../flow/instmanager/undoWorkItemManager.html","show":true,"menuName":"待办工作项查询","id":383,"iconFileName":"(null)","parentId":205,"pathname":"/undoworkitemmgr"},{"entry":"routes/flowInstMgrHis/index","urlString":"../flow/instmanager/flowInstManagerHis.html","show":true,"menuName":"流程实例管理（历史）","id":308,"parentId":206,"pathname":"/flowinstmanagerhis"},{"entry":"routes/FlowErrorManagerHis/index","urlString":"../flow/flowerror/flowErrorManagerHis.html","show":true,"menuName":"流程异常管理（历史）","id":309,"parentId":206,"pathname":"/flowerrormanagerhis"},{"entry":"routes/CommandErrMgrHis/index","urlString":"../flow/command/commandErrorManagerHis.html","show":true,"menuName":"流程消息监控（历史）","id":310,"parentId":206,"pathname":"/commanderrormanagerhis"},{"entry":"routes/TacheLimitManager/index","urlString":"../flow/timelimit/tacheLimitManager.html","show":true,"menuName":"环节时限管理","id":311,"parentId":207,"pathname":"/tachelimitmanager"},{"entry":"routes/FlowLimitManager/index","urlString":"../flow/timelimit/flowLimitManager.html","show":true,"menuName":"流程时限管理","id":312,"parentId":207,"pathname":"/flowLimitmanager"},{"entry":"routes/WorkTimeManager/index","urlString":"../flow/timelimit/workTimeManager.html","show":true,"menuName":"工作时间管理","id":313,"parentId":207,"pathname":"/worktimemanager"},{"entry":"routes/HolidayManager/index","urlString":"../flow/timelimit/holidayManager.html","show":true,"menuName":"节假日管理","id":314,"parentId":207,"pathname":"/holidaymanager"},{"entry":"routes/FlowStressTest/index","urlString":"../flow/test/flowStressTest.html","show":true,"menuName":"性能测试","id":343,"parentId":211,"pathname":"/flowstresstest"}]';
        }
        res.end(body);//现版本的webpack-dev-server所依赖的http-proxy-middleware依赖的http-proxy版本是0.16是不支持的，当是http-proxy升级到0.17就支持了
        
      });
    }else{
      res.end('[{"urlString":"","icon":"schedule","iconColor":"rgb(86, 74","show":true,"menuName":"流程管理","id":201,"parentId":0,"pathname":""},{"urlString":"","icon":"appstore","iconColor":"#564aa3","show":true,"menuName":"流程配置","id":204,"parentId":0,"pathname":""},{"urlString":"","icon":"eye","iconColor":"#1797be","show":true,"menuName":"流程监控","id":205,"parentId":0,"pathname":""},{"urlString":"","icon":"wallet","iconColor":"rgb(39, 19","show":true,"menuName":"历史流程监控","id":206,"parentId":0,"pathname":""},{"urlString":"","icon":"schedule","iconColor":"#51c6ea","show":true,"menuName":"时限管理","id":207,"parentId":0,"pathname":""},{"urlString":"","icon":"exception","show":false,"menuName":"流程测试","id":211,"parentId":0,"pathname":""},{"entry":"routes/AcceptFlow/index","urlString":"../flow/accept/acceptFlow.html","show":true,"menuName":"业务受理","id":361,"iconFileName":"(null)","parentId":201,"pathname":"/acceptflow"},{"entry":"routes/DispatchRule/index","urlString":"../flow/dispatchrule/dispatchRule.html","show":true,"menuName":"派发规则管理","id":382,"iconFileName":"(null)","parentId":361,"pathname":"/dispatchrule"},{"entry":"routes/PageElementManager/index","urlString":"../form/formmanager/pageElementManager.html","show":true,"menuName":"元素管理","id":315,"parentId":202,"pathname":"/pageelementmanager"},{"entry":"routes/TemplateManager/index","urlString":"../form/formmanager/templateManager.html","show":true,"menuName":"模板管理","id":316,"parentId":202,"pathname":"/templatemanager"},{"entry":"routes/MenuManager/index","urlString":"../oaas/menu/menuManager.html","show":true,"menuName":"菜单管理","id":318,"parentId":203,"pathname":"/menumanager"},{"entry":"routes/PrivManager/index","urlString":"../oaas/priv/privManager.html","show":true,"menuName":"权限管理","id":321,"parentId":203,"pathname":"/privmanager"},{"entry":"routes/OrgManager/index","urlString":"../oaas/org/orgManager.html","show":true,"menuName":"组织管理","id":362,"iconFileName":"(null)","parentId":203,"pathname":"/orgmanager"},{"entry":"routes/StaffManager/index","urlString":"../oaas/staff/staffManager.html","show":true,"menuName":"人员管理","id":381,"iconFileName":"(null)","parentId":203,"pathname":"/staffmanager"},{"entry":"routes/TacheMgr/index","urlString":"../flow/tache/tacheManager.html","show":true,"menuName":"环节管理","id":301,"parentId":204,"pathname":"/tachemanager"},{"entry":"routes/ExceptionManager/index","urlString":"../flow/exception/exceptionManager.html","show":true,"menuName":"异常原因管理","id":302,"parentId":204,"pathname":"/exceptionmanager"},{"entry":"routes/FlowDefMgr/index","urlString":"../flow/design/flowDefManager.html","show":true,"menuName":"流程建模","id":303,"parentId":204,"pathname":"/flowdefmanager"},{"entry":"routes/CacheManager/index","urlString":"../flow/cache/cacheManager.html","show":true,"menuName":"缓存管理","id":384,"iconFileName":"(null)","parentId":204,"pathname":"/cachemanager"},{"entry":"routes/FlowInstanceMgr/index","urlString":"../flow/instmanager/flowInstManager.html","show":true,"menuName":"流程实例管理","id":304,"parentId":205,"pathname":"/flowinstancemgr"},{"entry":"routes/FlowErrorManager/index","urlString":"../flow/flowerror/flowErrorManager.html","show":true,"menuName":"流程异常管理","id":305,"parentId":205,"pathname":"/flowerrormanager"},{"entry":"routes/CommandErrorManager/index","urlString":"../flow/command/commandErrorManager.html","show":true,"menuName":"流程消息监控","id":306,"parentId":205,"pathname":"/commanderrormanager"},{"entry":"routes/FQueueMonitor/index","urlString":"../queue/fQueueMonitor.html","show":true,"menuName":"消息监控","id":307,"parentId":205,"pathname":"/foueuemonitor"},{"entry":"routes/BatchDealManager/index","urlString":"../flow/flowerror/batchDealManager.html","show":true,"menuName":"消息批量重投","id":317,"parentId":205,"pathname":"/batchdealmanager"},{"entry":"routes/UndoWorkItemManager/index","urlString":"../flow/instmanager/undoWorkItemManager.html","show":true,"menuName":"待办工作项查询","id":383,"iconFileName":"(null)","parentId":205,"pathname":"/undoworkitemmgr"},{"entry":"routes/flowInstMgrHis/index","urlString":"../flow/instmanager/flowInstManagerHis.html","show":true,"menuName":"流程实例管理（历史）","id":308,"parentId":206,"pathname":"/flowinstmanagerhis"},{"entry":"routes/FlowErrorManagerHis/index","urlString":"../flow/flowerror/flowErrorManagerHis.html","show":true,"menuName":"流程异常管理（历史）","id":309,"parentId":206,"pathname":"/flowerrormanagerhis"},{"entry":"routes/CommandErrMgrHis/index","urlString":"../flow/command/commandErrorManagerHis.html","show":true,"menuName":"流程消息监控（历史）","id":310,"parentId":206,"pathname":"/commanderrormanagerhis"},{"entry":"routes/TacheLimitManager/index","urlString":"../flow/timelimit/tacheLimitManager.html","show":true,"menuName":"环节时限管理","id":311,"parentId":207,"pathname":"/tachelimitmanager"},{"entry":"routes/FlowLimitManager/index","urlString":"../flow/timelimit/flowLimitManager.html","show":true,"menuName":"流程时限管理","id":312,"parentId":207,"pathname":"/flowLimitmanager"},{"entry":"routes/WorkTimeManager/index","urlString":"../flow/timelimit/workTimeManager.html","show":true,"menuName":"工作时间管理","id":313,"parentId":207,"pathname":"/worktimemanager"},{"entry":"routes/HolidayManager/index","urlString":"../flow/timelimit/holidayManager.html","show":true,"menuName":"节假日管理","id":314,"parentId":207,"pathname":"/holidaymanager"},{"entry":"routes/FlowStressTest/index","urlString":"../flow/test/flowStressTest.html","show":true,"menuName":"性能测试","id":343,"parentId":211,"pathname":"/flowstresstest"}]');
    }
    
    
  },
  'POST /login.do': {
    'token':'888888',
    profile:{"staff":{"userId":"311","userSex":"20","userCode":"320322199201160642","userType":"10","userPoliceId":"202012","userMobileLong":"15996212305","userMobileShort":"","userMobileLongDianxin":"","userMobileShortDianxin":"","userMobileOther":"","officeEmail":"","userPartType":"30","orgId":"8","orgCode":"320000323100","fullName":"政工一处","phone":"025-89883117","officeAddress":"金盾饭店312","userJobDesc":"在职","userStatus":"2000","orderIndex":"311","userMainId":"92c64653419f44579a8fb7fed8879e1f","userIndate":"2018-03-31 11:17:57","userBaseStatus":"2000","gacn":"尹晴 320322199201160642","staffId":0,"userName":"尹晴"},"org":{"orgId":"8","orgCode":"320000323100","oldOrgCode":"320000323100","orgName":"政工一处","fullName":"政工一处","orgShortName":"政工一处","dictionaryName":"","otherName":"","orgNameAlias":"","orgFullNameAlias":"","orgType":"10","orgKindPropStr":"","orgStartDate":"2018-03-31 10:54:11","parentCode":"320000320000","fullCode":"320000000000.320000000000.320000320000.320000323100","orgStatus":"2000","orderCode":"320000323100","orgIndate":"2018-03-31 10:54:11","parentId":"7","routeId":0},"tenantCode":"ITS","roleCodes":["ZTEFlowModelAdmin","FlowAdmin","Staff"],"authCodesMap":{"other":["flow_menu","flow_button","bdgl","xtgl","ten"],"menu":["acceptFlow","pmessageMonitHis","lcjk","pmessageMonit","menuManage","errorManage","errorManageHis","processInstManageHis","flowLimitManage","lccs","pageElementManage","undoWorkItemManager","dispatchRuleManage","package","messageMonit","workTimeManage","orgManage","batchDealManage","lslcjk","lcgl","reasonManage","processInstManage","privManage","staffManage","tacheManage","stressTest","lcpz","holidayManage","tacheLimitManage","cacheManage","sxgl","pageTemplateManage"],"ten":["ITS"],"btn":["editFlowDispatchRule","disableVersion","deleteTache","editFlowParams","openVersion","enableVersion","editVersion","deleteVersion","saveAsVersion"]}},
    tendants:[{
      "tenantId":"FLOWPLAT",
      "tenantName":"流程平台"
    },{
      "tenantId":"IOM",
      "tenantName":"开通系统"
    }]
  },
  'GET /menus': [{
    id:1,
    parentId:0,
    menuName:"编辑",
    "pathname": '',//"/flow/edit/(?<id>[\\d]+)",
    "entry":"",
    show:false,
    icon:'mail'
  },{
    id:2,
    parentId:0,
    menuName:"主页",
    "pathname": "/home",
    "entry":"routes/Home/index",
    show:false,
    icon:'mail'
  },{
    id:3,
    parentId:0,
    menuName:"登录",
    "pathname": "/login",
    "entry":"",
    show:false,
    icon:'mail'
  },{
    id:4,
    parentId:0,
    menuName:"流程配置",
    "pathname": "",
    "entry":"",
    icon:'appstore',
    iconColor:'#564aa3'
  },{
    id:5,
    parentId:4,
    menuName:"环节管理",
    "pathname": "/flowconfig/tachemgr",
    "entry":"",
    icon:'mail'
  },{
    id:6,
    parentId:4,
    menuName:"异常原因管理",
    "pathname": "/flowconfig/errorreasonmgr",
    "entry":"",
    icon:'mail'
  },{
    id:7,
    parentId:4,
    menuName:"流程建模",
    "pathname": "/flowconfig/flowmodel",
    "entry":"routes/PageNotFound/index",
    icon:'mail'
  },{
    id:11,
    parentId:4,
    menuName:"待办工作项查询",
    "pathname": "/flowconfig/TodoInquiries",
    "entry":"routes/TodoInquiries/index"
  },{
    id:8,
    parentId:0,
    menuName:"流程监控",
    "pathname": "/flowmonitor",
    "entry":"",
    icon:'eye',
    iconColor:'#1797be'
  },{
    id:151,
    parentId:8,
    menuName:"流程监控",
    "pathname": "/flowinstancemgr",
    "entry":"routes/FlowInstanceMgr/index",
    icon:'eye',
    iconColor:'#1797be'
  },{
    id:9,
    parentId:0,
    menuName:"历史流程监控",
    "pathname": "/hisflowmonitor",
    "entry":"",
    icon:'mail',
    iconColor:'#51c6ea'
  },{
    id:10,
    parentId:0,
    menuName:"时限管理",
    "pathname": "/deadlinemgr",
    "entry":"",
    icon:'mail',
    iconColor:'#27c24c'
  },{
    id:10011,
    parentId:0,
    menuName:"表单管理",
    "pathname": "",
    "entry":"",
    icon:'bars',
    iconColor:'#564aa3'
  },{
    id:10012,
    parentId:11,
    menuName:"模板管理",
    "pathname": "/templateMgr",
    "entry":"routes/TemplateMgr/index",
    icon:'copy',
    iconColor:'#564aa3'
  },{
    id:10086,
    parentId:0,
    "pathname": "",
    "search": "?key=value",
    "hash": "#extra-information",
    "state": { "modal": true },
    "key": "abc123",
    show:false,
    icon:'mail'
  }]
};

/* *********************************** */
/* wrap the mock data in data attibute */
const wrappedMockData = mockData;

/* for (const key in mockData) {
  if(typeof mockData[key]==='function'){
    wrappedMockData[key] = mockData[key];
    continue;
  }
  wrappedMockData[key] = {};
  wrappedMockData[key].success = true;
  wrappedMockData[key].errCode = 0;
  wrappedMockData[key].data = mockData[key];
} */

module.exports = wrappedMockData;
// module.exports = {};