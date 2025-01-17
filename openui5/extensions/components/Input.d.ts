﻿/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace sap {
    namespace extension {
        namespace m {
            /**
             * 输入框
             */
            class Input extends sap.m.Input {
                /**
                 * 构造
                 * @param {string} sId 唯一标记
                 * @param {any} mSettings 绑定值属性：bindingValue； showValueHelp时不可输入除非（valueHelpOnly=false）
                 */
                constructor(sId?: string, mSettings?: any);
                /**
                 * 设置属性值
                 * @param sPropertyName 属性名称
                 * @param oValue 值
                 * @param bSuppressInvalidate 立即
                 */
                protected setProperty(sPropertyName: string, oValue: any, bSuppressInvalidate?: boolean): this;
                /**
                 * 绑定属性
                 * @param sName 属性名称
                 * @param oBindingInfo 绑定信息
                 */
                bindProperty(sName: string, oBindingInfo: any): this;
                /**
                 * 获取绑定值
                 */
                getBindingValue(): string;
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value: string): this;
            }
            /**
             * 业务仓库数据-输入框
             */
            class RepositoryInput extends Input {
                /**
                 * 获取业务仓库实例
                 */
                getRepository(): ibas.BORepositoryApplication;
                /**
                 * 设置业务仓库
                 * @param value 业务仓库实例；业务仓库名称
                 */
                setRepository(value: ibas.BORepositoryApplication | string): this;
                /**
                 * 获取数据信息
                 */
                getDataInfo(): repository.IDataInfo;
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value: repository.IDataInfo | any): this;
            }
            /**
             * 业务仓库数据-输入框
             */
            class SelectionInput extends RepositoryInput {
                /**
                 * 获取选择类型
                 */
                getChooseType(): ibas.emChooseType;
                /**
                 * 设置选择类型
                 * @param value 选择类型
                 */
                setChooseType(value: ibas.emChooseType): this;
                /**
                 * 获取查询条件
                 */
                getCriteria(): ibas.ICriteria;
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setCriteria(value: ibas.ICriteria | ibas.ICondition[]): this;
            }
            /**
             * 超级文本框
             */
            class TextArea extends sap.m.TextArea {
                /**
                 * 构造
                 * @param {string} sId 唯一标记，不要赋值
                 * @param {any} mSettings 绑定值属性：bindingValue
                 */
                constructor(sId?: string, mSettings?: any);
                /**
                 * 设置属性值
                 * @param sPropertyName 属性名称
                 * @param oValue 值
                 * @param bSuppressInvalidate 立即
                 */
                protected setProperty(sPropertyName: string, oValue: any, bSuppressInvalidate?: boolean): this;
                /**
                 * 获取绑定值
                 */
                getBindingValue(): string;
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value: string): this;
            }
            /**
             * 用户数据-输入框
             * 未指定dataInfo.key时，根据绑定的type为数值类型或允许多选时使用DocEntry否则Code
             */
            class UserInput extends SelectionInput {
            }
            /**
             * 组织数据-输入框
             */
            class OrganizationInput extends SelectionInput {
            }
            /**
             * 角色数据-输入框
             */
            class RoleInput extends SelectionInput {
            }
            /**
             * 业务对象数据-输入框
             */
            class BusinessObjectInput extends SelectionInput {
            }
            /**
             * 图标-输入框
             */
            class IconInput extends Input {
            }
            /**
             * 数据所有者-输入框
             */
            class DataOwnerInput extends UserInput {
            }
            /**
             * 数据所属组织-输入框
             */
            class DataOrganizationInput extends OrganizationInput {
            }
            /**
             * 对象属性可选值-输入框
             */
            class PropertyInput extends Input {
                /**
                 * 获取数据信息
                 */
                getDataInfo(): { code: string, name?: string } | string | Function;
                /**
                 * 设置数据信息
                 * @param value 值
                 */
                setDataInfo(value: { code: string, name?: string } | string | Function): this;
                /**
                 * 获取属性名称
                 */
                getPropertyName(): string;
                /**
                 * 设置属性名称
                 * @param value 属性名称
                 */
                setPropertyName(value: string): this;
                /**
                 * 加载可选值
                 */
                loadItems(): this;
            }
        }
    }
}
