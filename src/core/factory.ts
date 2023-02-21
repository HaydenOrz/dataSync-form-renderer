import { FormInstance } from "antd";
import { FormServicePool } from './services/serviceType'

/**
 * @description 生成字段联动处理函数
 * @param form form 实例
 * @param effectField 被影响的字段
 * 目前字段联动只做清空处理
 */
export function fieldValueInteractionFactory (form: FormInstance, effectField: string[]) {
    return form.resetFields(effectField)
}

interface IActionConf {
    serviceName: string;
    fieldInExtraData: string;
    immediate: boolean;
}

/**
 * @description 生成字段值变更触发的 action 函数
 * @param servicePool 服务池
 * @param updateExtra extraData 更新函数
 * @param triggerAction 触发的 action 信息
 * @returns 
 */
export function triggerServiceFactory (servicePool: FormServicePool, updateExtra, triggerAction: IActionConf) {
    const {
        serviceName,
        fieldInExtraData,
    } = triggerAction;

    const service = servicePool?.[serviceName];

    return (formData, extraData) => {
        service.call(null, formData, extraData)
        .then((res) => {
            updateExtra((extraData) => ({ ...extraData, [fieldInExtraData]: res }))
        })
    }
}