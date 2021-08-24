export default {
  /**
   * 管道属性
   */
  pipeAttribute: [
    {
      idx: 0,
      displayName: "流量",
      fieldName: "Result_Flow_",
      type: "result",
      unit: "m³/h",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "流速",
      fieldName: "Result_Velocity_",
      type: "result",
      unit: "m/s",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "水头损失",
      fieldName: "Result_Headloss_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "起始点压力",
      fieldName: "StartNodePressure",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "终止点压力",
      fieldName: "EndNodePressure",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "实测压力",
      fieldName: "RealPressure",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "地址",
      fieldName: "位置",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 7,
      displayName: "分公司",
      fieldName: "分公司",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 8,
      displayName: "管径",
      fieldName: "管径",
      type: "attribute",
      unit: "mm",
      rounding: true,
      displayType: "input",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 9,
      displayName: "管材",
      fieldName: "Physical_PipeMaterial",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 10,
      displayName: "管长",
      fieldName: "HMIGeometryScaledLength",
      type: "attribute",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 11,
      displayName: "阻力系数",
      fieldName: "Physical_HazenWilliamsC",
      type: "attribute",
      unit: "",
      rounding: true,
      displayType: "input",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 12,
      displayName: "状态",
      fieldName: "PipeStatus",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "combox",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 13,
      displayName: "管龄",
      fieldName: "PipeAge",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 14,
      displayName: "安装年代",
      fieldName: "埋设时间",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 15,
      displayName: "24小时流向变化",
      fieldName: "Direction_Change_",
      type: "result",
      unit: "次",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 16,
      displayName: "模型ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 17,
      displayName: "GIS编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 18,
      displayName: "起始节点",
      fieldName: "StartNodeID",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 19,
      displayName: "终止节点",
      fieldName: "EndNodeID",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ],

  /**
   * 节点属性
   */
  junctionAttribute: [
    {
      idx: 0,
      displayName: "水压标高",
      fieldName: "Result_HydraulicGrade_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "压力",
      fieldName: "Result_Pressure_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "流量",
      fieldName: "Result_Demand_",
      type: "result",
      unit: "m³/h",
      rounding: true,
      displayType: "input",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "压力同比",
      fieldName: "Pressure_Change",
      type: "result",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "地址",
      fieldName: "位置",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "分公司",
      fieldName: "分公司",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "地面高程",
      fieldName: "Physical_NodeElevation",
      type: "attribute",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 7,
      displayName: "横坐标",
      fieldName: "HMIGeometryXCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 8,
      displayName: "纵坐标",
      fieldName: "HMIGeometryYCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 9,
      displayName: "模型ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 10,
      displayName: "GIS编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ],

  /**
   * 阀门属性
   */
  tcvAttribute: [
    {
      idx: 0,
      displayName: "水压标高",
      fieldName: "Result_FromHead_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "压力",
      fieldName: "Result_FromPressure_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "阀门编号",
      fieldName: "阀门编号",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "地址",
      fieldName: "位置",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "分公司",
      fieldName: "分公司",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "高程",
      fieldName: "Physical_NodeElevation",
      type: "attribute",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "口径",
      fieldName: "Physical_ValveDiameter",
      type: "attribute",
      unit: "mm",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 7,
      displayName: "开关状态",
      fieldName: "ValveSetting",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 8,
      displayName: "开度",
      fieldName: "InitialSettingsRelativeClosure",
      type: "attribute",
      unit: "%",
      rounding: false,
      displayType: "input",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 9,
      displayName: "安装年代",
      fieldName: "埋设时间",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 10,
      displayName: "横坐标",
      fieldName: "HMIGeometryXCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 11,
      displayName: "纵坐标",
      fieldName: "HMIGeometryYCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 12,
      displayName: "模型ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 13,
      displayName: "GIS编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ],

  /**
   * 减压阀属性
   */
  prvAttribute: [
    {
      idx: 0,
      displayName: "水压标高",
      fieldName: "Result_FromHead_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "压力",
      fieldName: "Result_FromPressure_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "阀门编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "控制压力",
      fieldName: "HGLSetting",
      type: "attribute",
      unit: "m",
      rounding: false,
      displayType: "input",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "开关状态",
      fieldName: "ValveSetting",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "combox",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "分公司",
      fieldName: "分公司",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "高程",
      fieldName: "Physical_NodeElevation",
      type: "attribute",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 7,
      displayName: "口径",
      fieldName: "Physical_ValveDiameter",
      type: "attribute",
      unit: "mm",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 8,
      displayName: "安装年代",
      fieldName: "埋设时间",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 9,
      displayName: "横坐标",
      fieldName: "HMIGeometryXCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 10,
      displayName: "纵坐标",
      fieldName: "HMIGeometryYCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 11,
      displayName: "模型ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 12,
      displayName: "GIS编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ],

  /**
   * 流量阀属性
   */
  fcvAttribute: [
    {
      idx: 0,
      displayName: "水压标高",
      fieldName: "Result_FromHead_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "压力",
      fieldName: "Result_FromPressure_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "阀门编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "阻力系数",
      fieldName: "Constituent_InialConcentration",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "input",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "分公司",
      fieldName: "分公司",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "高程",
      fieldName: "Physical_NodeElevation",
      type: "attribute",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "口径",
      fieldName: "Physical_ValveDiameter",
      type: "attribute",
      unit: "mm",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 7,
      displayName: "安装年代",
      fieldName: "埋设时间",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 8,
      displayName: "横坐标",
      fieldName: "HMIGeometryXCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 9,
      displayName: "纵坐标",
      fieldName: "HMIGeometryYCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 10,
      displayName: "模型ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 11,
      displayName: "GIS编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ],

  /**
   * 消火栓属性
   */
  hydrantAttribute: [
    {
      idx: 0,
      displayName: "地址",
      fieldName: "位置",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "分公司",
      fieldName: "分公司",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "地面高程",
      fieldName: "Physical_NodeElevation",
      type: "attribute",
      unit: "m",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "横坐标",
      fieldName: "HMIGeometryXCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "纵坐标",
      fieldName: "HMIGeometryYCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "模型ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "消火栓编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ],

  /**
   * 水泵属性
   */
  pumpAttribute: [
    {
      idx: 0,
      displayName: "阀前水压标高",
      fieldName: "Result_FromHead_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "阀前压力",
      fieldName: "Result_FromPressure_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "阀后水压标高",
      fieldName: "Result_ToHead_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "阀后压力",
      fieldName: "Result_ToPressure_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "流量",
      fieldName: "Result_Flow_",
      type: "result",
      unit: "m³/h",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "能耗",
      fieldName: "Result_Energy_",
      type: "result",
      unit: "",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "效率",
      fieldName: "Result_Efficiency_",
      type: "result",
      unit: "",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 7,
      displayName: "地址",
      fieldName: "位置",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 8,
      displayName: "分公司",
      fieldName: "分公司",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 9,
      displayName: "地面高程",
      fieldName: "Physical_NodeElevation",
      type: "attribute",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 10,
      displayName: "开关状态",
      fieldName: "PumpStatus",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "combox",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 11,
      displayName: "横坐标",
      fieldName: "HMIGeometryXCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 12,
      displayName: "纵坐标",
      fieldName: "HMIGeometryYCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 13,
      displayName: "模型ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 14,
      displayName: "水泵编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ],

  /**
   * 止回阀属性
   */
  checkValveAttribute: [
    {
      idx: 0,
      displayName: "阀门编号",
      fieldName: "阀门编号",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "地址",
      fieldName: "位置",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "分公司",
      fieldName: "分公司",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "地面高程",
      fieldName: "Physical_NodeElevation",
      type: "attribute",
      unit: "m",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "埋深",
      fieldName: "覆土深度",
      type: "attribute",
      unit: "m",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "横坐标",
      fieldName: "HMIGeometryXCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "纵坐标",
      fieldName: "HMIGeometryYCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 7,
      displayName: "GIS编号",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 8,
      displayName: "模型ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 9,
      displayName: "备注",
      fieldName: "备注",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ],

  /**
   * 水池属性
   */
  reservoirAttribute: [
    {
      idx: 0,
      displayName: "ID",
      fieldName: "ElementId",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 1,
      displayName: "名称",
      fieldName: "Label",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 2,
      displayName: "运行类型",
      fieldName: "",
      type: "attribute",
      unit: "",
      rounding: true,
      displayType: "combox",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 3,
      displayName: "横坐标",
      fieldName: "HMIGeometryXCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 4,
      displayName: "纵坐标",
      fieldName: "HMIGeometryYCoordinate",
      type: "attribute",
      unit: "",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 5,
      displayName: "底板高程",
      fieldName: "备注",
      type: "attribute",
      unit: "m",
      rounding: false,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 6,
      displayName: "水位",
      fieldName: "Result_HydraulicGrade_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "input",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 7,
      displayName: "流量",
      fieldName: "Result_Flow_",
      type: "result",
      unit: "m³/h",
      rounding: true,
      displayType: "input",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 8,
      displayName: "流量",
      fieldName: "Result_Flow_",
      type: "result",
      unit: "m³/h",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    },
    {
      idx: 9,
      displayName: "水位",
      fieldName: "Result_HydraulicGrade_",
      type: "result",
      unit: "m",
      rounding: true,
      displayType: "label",
      changeData: "",
      id: "",
      originalData: ""
    }
  ]
};
