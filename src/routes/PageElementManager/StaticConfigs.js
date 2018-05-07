import React, { Component } from 'react';
import moment from 'moment';
import { Icon } from 'antd';
import _ from 'lodash';


/**表格标题部分 */
const tableColumnsTitle = [
    { title: '元素编码', dataIndex: 'elementCode', width: 150, sortable: true },
    { title: '元素名称', dataIndex: 'elementName', width: 150 },
    { title: '元素类型', dataIndex: 'elementTypeName', width: 95 },
    { title: '弹出页面URL', dataIndex: 'popPageUrl', width: 150 },
    { title: '页面宽度', dataIndex: 'popPageWidth', width: 80 },
    { title: '页面高度', dataIndex: 'popPageHeight', width: 80 },
    { title: '文本框高度', dataIndex: 'textRow', width: 90 },
    { title: '按钮事件', dataIndex: 'buttonFunc', width: 150 },
    { title: '按钮调用类', dataIndex: 'buttonClass', width: 150 },
    { title: '按钮调用方法', dataIndex: 'buttonMethod', width: 150 },
    { title: '选项数据类', dataIndex: 'optionDataClass', width: 150 },
    { title: '选项数据方法', dataIndex: 'optionDataMethod', width: 150 },
    { title: '初值生成类', dataIndex: 'initDataClass', width: 150 },
    { title: '初值生成方法', dataIndex: 'initDataMethod', width: 150 },
    { title: '备注', dataIndex: 'comments', width: 150 }
    // ,{ title: 'id', dataIndex: 'id', hidden: true },
    // { title: 'elementType', dataIndex: 'elementType', hidden: true }
];

/**页面初始化查询请求参数（只执行一次）*/
const intiTableDefaultParam = {
    rows: [],//表格行数据，没查询条件前肯定是没有数数据的
    /**表格底部的分页信息栏配置对象 */
    pagination: {
        "showSizeChanger": true,//是否支持变更页面展示条数
        "showQuickJumper": true,//是否支持快速跳页
        "current": 1,//当前所在页数
        "pageSize": 10,//默认页面展示行数
        "total": 0 //是否当页完全展示所有项，0-否；1-是
    }
};

/**查询表单输入栏标签配置信息 */
const searchFormTagConfig = {
    layout: 'inline',//布局成一排
    fields: [{
        rowId: 1,
        col: 6,
        orderNum: 1,
        label: '元素编码',
        showLabel: false,//不展示标签名
        key: 'eleCode',//元素编码key值
        type: 'input',//标签类型input
        props: {
            placeholder: '请输入元素编码',
            defaultValue: '',//默认值
            //addonAfter:(<button type="submit"><Icon type="search" /></button>)
        },
        needExpend: false,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 1,
        col: 6,
        orderNum: 1,
        label: '元素名称',
        showLabel: false,//不展示标签名
        key: 'eleName',//元素编码key值
        type: 'input',//标签类型input
        props: {
            placeholder: '请输入元素名称',
            defaultValue: '',//默认值
            addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: false,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }],
    // 提交按钮的属性
    submitButtonProps: {}
}

/**元素类型下拉框选项 */
const elementType = [{
    value: '',
    text: ''
}, {
    value: 'LABEL',
    text: '文本标签'
}, {
    value: 'OPTION',
    text: '单选下拉框'
}, {
    value: 'DATE',
    text: '日期选择'
}, {
    value: 'POP',
    text: '弹出页面选择'
}, {
    value: 'TEXT',
    text: '文本输入框'
}, {
    value: 'INPUT',
    text: '单行输入框'
}, {
    value: 'BUTTON',
    text: '按钮'
}];
/**按钮点击事件下拉框*/
const buttonEvent = [
    {
        value: 'closePage',
        text: '关闭事件'
    }, {
        value: 'popPage',
        text: '弹出事件'
    }, {
        value: 'ok',
        text: '提交'
    }];

const initShowItemArray = [1, 2, 3, 15];//初始展示表单项
const initAllItemArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];//初始所有表单项（包括未展示出来的）

/**查询表单输入栏标签配置信息 */
const addFormTagConfig = {
    fields: [{
        rowId: 1,
        col: 24,//格栅宽度
        orderNum: 1,
        label: '元素类型',
        showLabel: true,//不展示标签名
        key: 'elementType',//元素编码key值
        type: 'select',//标签类型select
        rules: [{ required: true, whitespace: true, message: '请选择元素类型' }],
        props: {
            placeholder: '请选择元素类型',
            defaultValue: '',//默认值
            style: { width: '70%' }
            //addonAfter:(<button type="submit"><Icon type="search" /></button>)
        },
        options: elementType,
        needExpend: false,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 2,
        col: 24,
        orderNum: 1,
        label: '元素编码',
        showLabel: true,//展示标签名
        key: 'elementCode',//元素编码key值
        type: 'input',//标签类型input
        rules: [{ required: true, whitespace: true, message: '请输入元素编码' }],
        props: {
            placeholder: '请输入元素编码',
            defaultValue: '',//默认值
            style: { width: '70%', 'backgroundColor': '#fff3f3' }
            //addonAfter:(<button type="submit"><Icon type="search" /></button>)
        },
        needExpend: false,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 3,
        col: 24,
        orderNum: 1,
        label: '元素名称',
        showLabel: true,//不展示标签名
        key: 'elementName',//元素编码key值
        type: 'input',//标签类型input
        rules: [{ required: true, whitespace: true, message: '请输入元素名称' }],
        props: {
            placeholder: '请输入元素名称',
            defaultValue: '',//默认值
            style: { width: '70%', 'backgroundColor': '#fff3f3' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: false,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 4,
        col: 24,
        orderNum: 1,
        label: '选项数据类',
        showLabel: true,//不展示标签名
        key: 'optionDataClass',//元素编码key值
        type: 'input',//标签类型input
        rules: [{ required: true, whitespace: true, message: '请输入选项数据类' }],
        props: {
            placeholder: '请输入选项数据类',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 5,
        col: 24,
        orderNum: 1,
        label: '选项数据方法',
        showLabel: true,//不展示标签名
        key: 'optionDataMethod',//元素编码key值
        type: 'input',//标签类型input
        rules: [{ required: true, whitespace: true, message: '请输入选项数据方法' }],
        props: {
            placeholder: '选项数据方法',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }
        , {
        rowId: 6,
        col: 24,
        orderNum: 1,
        label: '初值生成类',
        showLabel: true,//不展示标签名
        key: 'initDataClass',//元素编码key值
        type: 'input',//标签类型input
        //rules: [{ required: true, whitespace: true, message: '请输入备注' }],
        props: {
            type: 'textarea',
            placeholder: '请输入初值生成类',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 7,
        col: 24,
        orderNum: 1,
        label: '初值生成方法',
        showLabel: true,//不展示标签名
        key: 'initDataMethod',//元素编码key值
        type: 'input',//标签类型input
        //rules: [{ required: true, whitespace: true, message: '请输入备注' }],
        props: {
            type: 'textarea',
            placeholder: '请输入元素名称',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 8,
        col: 24,
        orderNum: 1,
        label: '弹出页面宽度',
        showLabel: true,//不展示标签名
        key: 'popPageWidth',//元素编码key值
        type: 'input',//标签类型input
        rules: [{ required: true, whitespace: true, message: '请输入弹出页面宽度' }],
        props: {
            placeholder: '请输入弹出页面宽度',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 9,
        col: 24,
        orderNum: 1,
        label: '弹出页面高度',
        showLabel: true,//不展示标签名
        key: 'popPageHeight',//元素编码key值
        type: 'input',//标签类型input
        rules: [{ required: true, whitespace: true, message: '请输入弹出页面高度' }],
        props: {
            placeholder: '请输入弹出页面高度',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 10,
        col: 24,
        orderNum: 1,
        label: '弹出页面URL',
        showLabel: true,//不展示标签名
        key: 'popPageUrl',//元素编码key值
        type: 'input',//标签类型input
        rules: [{ required: true, whitespace: true, message: '请输入弹出页面URL' }],
        props: {
            placeholder: '请输入弹出页面URL',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 11,
        col: 24,
        orderNum: 1,
        label: '文本框高度',
        showLabel: true,//不展示标签名
        key: 'textRow',//元素编码key值
        type: 'input',//标签类型input
        rules: [{ required: true, whitespace: true, message: '请输入文本框高度' }],
        props: {
            placeholder: '请输入文本框高度',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 12,
        col: 24,
        orderNum: 1,
        label: '按钮点击事件',
        showLabel: true,//不展示标签名
        key: 'buttonFunc',//元素编码key值
        type: 'select',//标签类型select
        rules: [{ required: true, whitespace: true, message: '请输入按钮点击事件' }],
        props: {
            placeholder: '请输入元素名称',
            defaultValue: 'closePage',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        options: buttonEvent,//按钮事件下拉框枚举
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 13,
        col: 24,
        orderNum: 1,
        label: '按钮调用类',
        showLabel: true,//不展示标签名
        key: 'buttonClass',//元素编码key值
        type: 'input',//标签类型input
        //rules: [{ required: true, whitespace: true, message: '请输入备注' }],
        props: {
            placeholder: '请输入按钮调用类',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }, {
        rowId: 14,
        col: 24,
        orderNum: 1,
        label: '按钮调用方法',
        showLabel: true,//不展示标签名
        key: 'buttonMethod',//元素编码key值
        type: 'input',//标签类型input
        //rules: [{ required: true, whitespace: true, message: '请输入备注' }],
        props: {
            type: 'textarea',
            placeholder: '请输入按钮调用方法',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: true,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    },
    {
        rowId: 15,
        col: 24,
        orderNum: 1,
        label: '备注',
        showLabel: true,//不展示标签名
        key: 'comments',//元素编码key值
        type: 'input',//标签类型input
        //rules: [{ required: true, whitespace: true, message: '请输入备注' }],
        props: {
            placeholder: '请输入元素名称',
            defaultValue: '',//默认值
            style: { width: '70%' }
            // addonAfter: (<button type="submit"><Icon type="search" />查询</button>)
        },
        needExpend: false,//不隐藏
        //表单标签项布局实现
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
    }

    ]
}
export { tableColumnsTitle, intiTableDefaultParam, searchFormTagConfig, addFormTagConfig,initShowItemArray,initAllItemArray }