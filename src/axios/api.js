/**
 * api接口统一管理
 */
import { get, post } from './http';
/**
 *
 * @param {string} params
 * 我们定义了一个topics方法
 * 这个方法有一个参数params
 * params是我们请求接口时携带的参数对象
 * 而后调用了我们封装的post方法
 * post方法的第一个参数是我们的接口地址
 * 第二个参数是topics的params参数
 * 即请求接口时携带的参数对象
 * 最后通过export导出topics。
 */
//admin ------api
export default {
      getADMIN:{
          //登录
          login:params => post('/Login', params),
          //修改
          set : params => post('/UpdatePassword', params),
      },
      getData:{
        //本地Json
        getData : params => post('/PipeBurstNew' , params),
      },
      getHome:{//废弃
        //模型参数汇总
        GetModelStatistic : params => post('/GetModelStatistic' , params),
        //管网运行参数汇总
        // GetRunningStateInfo : params => post('/GetRunningStateInfo' , params),
        //当前模型精度
        GetModelAccuracyInfo : params => post('/GetModelAccuracyInfo' , params),
        //管网运行参数汇总
        GetWaterFactoryInfo : params => post('/GetWaterFactoryInfo' , params),
        //获取运行状态信息
        GetRunningStateInfo : params => post('/GetRunningStateInfo' , params),
        //模型总供水量变化曲线
        GetAreaTypeDemand : params => post('/GetAreaTypeDemand' , params),
      },
      getIntelligence:{
        GetIsolateNodeMorePoint : params => post('/IsolateNodeMorePoint' , params),
        GetCloseModel : params => post('/CloseModel' , params),
        GetPlanTempGetResultData : params => post('/PlanTempGetResultData' , params),
        GetJudgeUpdateGlobalFinishTime : params => post('/JudgeUpdateGlobalFinishTime' , params),
      },
      GetTubeBurst:{
        GetWorkingConditionSimulationNode : params => post('/WorkingConditionSimulationNode' , params),
        GetWorkingConditionSimulationPipe : params => post('/WorkingConditionSimulationPipe' , params),
        GetPipeDiameterByJunctionId : params => post('/GetPipeDiameterByJunctionId' , params),
      },
      GetProgramme:{
        GetOnePlanInfo : params => post('/GetOnePlanInfo' , params),
      }
}
