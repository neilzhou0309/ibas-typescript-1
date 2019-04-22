﻿/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sap {
    export namespace extension {
        export namespace table {
            /** 自动触发下一个结果集查询 */
            export function triggerNextResults(trigger: {
                /** 监听对象 */
                listener: sap.ui.table.Table | sap.m.ListBase,
                /** 触发方法 */
                next(data: any): void,
            }): void {
                if (ibas.objects.isNull(trigger)) {
                    return;
                }
                if (trigger.listener instanceof (sap.m.ListBase)) {
                    // 绑定触发一次的事件
                    trigger.listener.attachEvent("updateFinished", undefined, function (this: sap.m.ListBase): void {
                        if (this.getBusy()) {
                            // 忙状态不监听
                            return;
                        }
                        let model: any = this.getModel(undefined);
                        if (!ibas.objects.isNull(model)) {
                            let data: any = model.getData();
                            if (!ibas.objects.isNull(data) && !ibas.objects.isNull(this.getGrowingInfo())) {
                                if (this.getGrowingInfo().total === this.getGrowingInfo().actual) {
                                    if (data !== undefined && data !== null) {
                                        let modelData: any = data.rows; // 与绑定对象的路径有关
                                        let dataCount: number = modelData.length;
                                        let visibleRow: number = this.getGrowingThreshold(); // 当前显示条数
                                        if (dataCount <= 0 || dataCount < visibleRow) {
                                            return;
                                        }
                                        // 调用事件
                                        this.setBusy(true);
                                        trigger.next.call(trigger.next, modelData[modelData.length - 1]);
                                    }
                                }
                            }
                        }
                    });
                } else if (trigger.listener instanceof (sap.ui.table.Table)) {
                    trigger.listener.attachEvent("_rowsUpdated", undefined, function (this: sap.ui.table.Table): void {
                        if (this.getBusy()) {
                            // 忙状态不监听
                            return;
                        }
                        let model: any = this.getModel(undefined);
                        if (!ibas.objects.isNull(model)) {
                            let data: any = model.getData();
                            if (!ibas.objects.isNull(data)) {
                                let dataCount: number = data.length;
                                if (dataCount === undefined) {
                                    // 存在绑定的对象路径问题
                                    dataCount = data.rows.length;
                                    if (dataCount !== undefined) {
                                        // 此路径存在数据
                                        data = data.rows;
                                    }
                                }
                                let visibleRow: number = this.getVisibleRowCount();
                                if (dataCount > 0 && dataCount > visibleRow) {
                                    let firstRow: number = this.getFirstVisibleRow(); // 当前页的第一行
                                    let lastPageCount: number = dataCount % visibleRow; // 最后一页行数
                                    if ((lastPageCount > 0 && firstRow === (dataCount - lastPageCount))
                                        || (lastPageCount === 0 && firstRow === (dataCount - visibleRow))) {
                                        // 调用事件
                                        this.setBusy(true);
                                        trigger.next.call(trigger.next, data[data.length - 1]);
                                    }
                                }
                            }
                        }
                    });
                }
            }
            /** 改变表格选择风格 */
            function changeSelectionStyle(this: Table): void {
                if (!(this instanceof sap.ui.table.Table)) {
                    return;
                }
                this.setSelectedIndex(this.getSelectedIndex());
            }
            /**
             * 表格
             */
            sap.ui.table.Table.extend("sap.extension.table.Table", {
                metadata: {
                    properties: {
                        /** 行选择 */
                        selectionBehavior: { type: "string", defaultValue: sap.ui.table.SelectionBehavior.Row },
                        /** 选择方式 */
                        chooseType: { type: "int", defaultValue: ibas.emChooseType.MULTIPLE },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取选择类型
                 */
                getChooseType(this: Table): ibas.emChooseType {
                    return this.getProperty("chooseType");
                },
                /**
                 * 设置选择类型
                 * @param value 选择类型
                 */
                setChooseType(this: Table, value: ibas.emChooseType): Table {
                    this.detachRowSelectionChange(changeSelectionStyle);
                    if (value === ibas.emChooseType.SINGLE) {
                        this.setEnableSelectAll(false);
                        this.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
                        this.attachRowSelectionChange(undefined, changeSelectionStyle);
                    } else if (value === ibas.emChooseType.MULTIPLE) {
                        this.setEnableSelectAll(true);
                        this.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
                    } else {
                        this.setSelectionMode(sap.ui.table.SelectionMode.None);
                    }
                    return this.setProperty("chooseType", value);
                },
                /**
                 * 获取选择的数据
                 */
                getSelecteds<T>(this: Table): ibas.IList<T> {
                    let selecteds: ibas.IList<T> = new ibas.ArrayList<T>();
                    for (let item of this.getSelectedIndices()) {
                        selecteds.push(this.getContextByIndex(item).getObject());
                    }
                    return selecteds;
                },
                /**
                 * 获取未选择的数据
                 */
                getUnSelecteds<T>(this: Table): ibas.IList<T> {
                    let selecteds: ibas.IList<T> = new ibas.ArrayList<T>();
                    let index: number = 0;
                    let context: sap.ui.model.Context = this.getContextByIndex(index);
                    while (!ibas.objects.isNull(context)) {
                        selecteds.push(context.getObject());
                        context = this.getContextByIndex(++index);
                    }
                    for (let item of this.getSelectedIndices()) {
                        selecteds.remove(this.getContextByIndex(item).getObject());
                    }
                    return selecteds;
                },
            });
            /**
             * 表格列
             */
            sap.ui.table.Column.extend("sap.extension.table.Column", {
                metadata: {
                    properties: {},
                    events: {}
                },
                setTemplate(this: Column, value: sap.ui.core.Control | string): Column {
                    if (value instanceof sap.m.Select) {
                        value.setWidth("100%");
                    } else if (value instanceof sap.m.ComboBox) {
                        value.setWidth("100%");
                    }
                    sap.ui.table.Column.prototype.setTemplate.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 数据表格
             */
            Table.extend("sap.extension.table.DataTable", {
                metadata: {
                    properties: {
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性过滤器 */
                        propertyFilter: { type: "function" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo(this: DataTable): { code: string, name?: string } | string | Function | shell.bo.IBOInfo {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(this: DataTable, value: { code: string, name?: string } | string | Function | shell.bo.IBOInfo): DataTable {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性过滤器
                 */
                getPropertyFilter(): Function {
                    return this.getProperty("propertyFilter");
                },
                /**
                 * 设置属性过滤器
                 * @param value 过滤器
                 */
                setPropertyFilter(value: (property: shell.bo.IBOPropertyInfo) => boolean): DataTable {
                    return this.setProperty("propertyFilter", value);
                },
                /** 重构设置 */
                applySettings(this: DataTable): DataTable {
                    Table.prototype.applySettings.apply(this, arguments);
                    let dataInfo: any = this.getDataInfo();
                    if (typeof dataInfo === "string") {
                        dataInfo = {
                            code: dataInfo,
                        };
                    } else if (typeof dataInfo === "function") {
                        dataInfo = {
                            code: dataInfo.BUSINESS_OBJECT_CODE,
                            name: ibas.objects.getName(dataInfo),
                        };
                    }
                    if (typeof dataInfo === "object") {
                        if (dataInfo.properties instanceof Array) {
                            propertyColumns.call(this, dataInfo);
                        } else {
                            let info: { code: string, name?: string } = dataInfo;
                            let boRepository: shell.bo.IBORepositoryShell = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                            boRepository.fetchBOInfos({
                                boCode: info.code,
                                boName: info.name,
                                onCompleted: (opRslt) => {
                                    if (opRslt.resultCode !== 0) {
                                        ibas.logger.log(new Error(opRslt.message));
                                    } else {
                                        propertyColumns.call(this, opRslt.resultObjects.firstOrDefault());
                                    }
                                }
                            });
                        }
                    }
                    return this;
                },
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(this: DataTable, oModel: model.JSONModel, sName?: string): DataTable {
                    let model: model.JSONModel = this.getModel();
                    // 判断是否有有效模型
                    if (model && model.getData()) {
                        let data: any = model.getData();
                        if (!(data.rows instanceof Array && data.rows.length > 0)) {
                            model = undefined;
                        }
                    }
                    // 没有设置过模型，则更新控件绑定信息
                    if (ibas.objects.isNull(model) && !ibas.objects.isNull(oModel)) {
                        // 获取对象信息
                        let data: any = oModel.getData();
                        if (data instanceof Array) {
                            data = data[0];
                        } else if (data.rows instanceof Array) {
                            data = data.rows[0];
                        }
                        if (!ibas.objects.isNull(data)) {
                            let userFields: ibas.IUserFields = data.userFields;
                            if (!ibas.objects.isNull(userFields)) {
                                for (let column of this.getColumns()) {
                                    if (column instanceof DataColumn) {
                                        let template: sap.ui.core.Control | string = column.getTemplate();
                                        if (template instanceof sap.ui.core.Control) {
                                            let bindingInfo: any = (<any>template).getBindingInfo("bindingValue");
                                            if (!ibas.objects.isNull(bindingInfo)) {
                                                userfields.check(userFields, bindingInfo);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return Table.prototype.setModel.apply(this, arguments);
                }
            });
            function propertyColumns(this: DataTable, boInfo: shell.bo.IBOInfo): void {
                if (!boInfo || !(boInfo.properties instanceof Array)) {
                    return;
                }
                // 查询未存在的属性
                let filter: Function = this.getPropertyFilter();
                let properties: ibas.IList<shell.bo.IBOPropertyInfo> = new ibas.ArrayList<shell.bo.IBOPropertyInfo>();
                for (let item of boInfo.properties) {
                    if (item.editSize <= 0) {
                        continue;
                    }
                    if (item.authorised === ibas.emAuthoriseType.NONE) {
                        continue;
                    }
                    if (filter instanceof Function) {
                        if (filter(item) === false) {
                            continue;
                        }
                    }
                    properties.add(item);
                }
                // 只读列表（遍历列，存在输入框则非只读）
                let readonly: boolean = true;
                for (let column of this.getColumns()) {
                    if (column instanceof DataColumn) {
                        let propertyInfo: shell.bo.IBOPropertyInfo = column.getPropertyInfo();
                        let template: sap.ui.core.Control | string = column.getTemplate();
                        if (template instanceof sap.ui.core.Control) {
                            if (template instanceof sap.m.InputBase) {
                                readonly = false;
                            }
                            if (ibas.objects.isNull(propertyInfo)) {
                                let path: string = (<any>template).getBindingPath("bindingValue");
                                if (!ibas.strings.isEmpty(path)) {
                                    propertyInfo = properties.firstOrDefault(c => ibas.strings.equalsIgnoreCase(path, c.property));
                                    column.setPropertyInfo(propertyInfo);
                                }
                            }
                        }
                        if (ibas.objects.isNull(propertyInfo)) {
                            continue;
                        }
                        for (let i: number = properties.length - 1; i >= 0; i--) {
                            let item: shell.bo.IBOPropertyInfo = properties[i];
                            if (item.property === propertyInfo.property) {
                                properties.removeAt(i);
                            }
                        }
                    }
                }
                // 创建未存在的列
                for (let property of properties) {
                    this.addColumn(new DataColumn("", {
                        label: property.description,
                        template: factories.newComponent(property, readonly),
                    }));
                }
            }
            /**
             * 数据表格列
             */
            Column.extend("sap.extension.table.DataColumn", {
                metadata: {
                    properties: {
                        /** 属性信息 */
                        propertyInfo: { type: "any" },
                        /** 列宽 */
                        width: { type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "10rem" },
                        /** 自动改变列宽 */
                        autoResizable: { type: "boolean", defalutValue: true },
                    },
                    events: {}
                },
                /**
                 * 获取属性信息
                 */
                getPropertyInfo(this: Column): shell.bo.IBOPropertyInfo {
                    return this.getProperty("propertyInfo");
                },
                /**
                 * 设置属性信息
                 * @param value 值
                 */
                setPropertyInfo(this: Column, value: shell.bo.IBOPropertyInfo): Column {
                    return this.setProperty("propertyInfo", value);
                }
            });
        }
    }
}