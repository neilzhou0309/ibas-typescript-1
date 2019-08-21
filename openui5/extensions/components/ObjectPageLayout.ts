﻿/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sap {
    export namespace extension {
        export namespace uxap {
            /**
             * 对象页
             */
            sap.uxap.ObjectPageLayout.extend("sap.extension.uxap.ObjectPageLayout", {
                metadata: {
                    properties: {
                    },
                    events: {}
                },
                renderer: {
                },
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(oModel: model.JSONModel, sName?: string): ObjectPageLayout {
                    this.bindObject("/");
                    sap.uxap.ObjectPageLayout.prototype.setModel.apply(this, arguments);
                    return this;
                },
                /** 设置头 */
                setHeaderTitle(this: ObjectPageLayout, oHeaderTitle: sap.uxap.IHeaderTitle): ObjectPageLayout {
                    sap.uxap.ObjectPageLayout.prototype.setHeaderTitle.apply(this, arguments);
                    if (oHeaderTitle instanceof sap.uxap.ObjectPageHeader) {
                        if (oHeaderTitle.getNavigationBar() instanceof sap.ui.core.Control) {
                            oHeaderTitle.getNavigationBar().addStyleClass("sapMTBStandard");
                        }
                    }
                    return this;
                },
                /** 退出 */
                exit(this: ObjectPageLayout): void {
                    let model: any = this.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        model.destroy();
                    }
                    (<any>sap.uxap.ObjectPageLayout.prototype).exit.apply(this, arguments);
                }
            });
            /**
             * 数据页
             */
            ObjectPageLayout.extend("sap.extension.uxap.DataObjectPageLayout", {
                metadata: {
                    properties: {
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性过滤器 */
                        propertyFilter: { type: "function" },
                    },
                    events: {}
                },
                renderer: {
                },
                /**
                 * 获取数据信息
                 */
                getDataInfo(this: DataObjectPageLayout): { code: string, name?: string } | string | Function | shell.bo.IBOInfo {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(this: DataObjectPageLayout, value: { code: string, name?: string } | string | Function | shell.bo.IBOInfo): DataObjectPageLayout {
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
                setPropertyFilter(value: (property: shell.bo.IBOPropertyInfo) => boolean): DataObjectPageLayout {
                    return this.setProperty("propertyFilter", value);
                },
                /** 重构设置 */
                applySettings(this: DataObjectPageLayout): DataObjectPageLayout {
                    ObjectPageLayout.prototype.applySettings.apply(this, arguments);
                    // 设置其他属性
                    let dataInfo: any = this.getDataInfo();
                    if (typeof dataInfo === "string") {
                        dataInfo = {
                            code: dataInfo,
                        };
                    } else if (typeof dataInfo === "function") {
                        dataInfo = {
                            code: dataInfo.BUSINESS_OBJECT_CODE,
                            name: ibas.objects.nameOf(dataInfo),
                        };
                    }
                    if (typeof dataInfo === "object") {
                        if (dataInfo.properties instanceof Array) {
                            propertyControls.call(this, dataInfo);
                        } else {
                            let info: { code: string, name?: string } = dataInfo;
                            let boRepository: shell.bo.IBORepositoryShell = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                            boRepository.fetchBOInfos({
                                boCode: ibas.config.applyVariables(info.code),
                                boName: info.name,
                                onCompleted: (opRslt) => {
                                    if (opRslt.resultCode !== 0) {
                                        ibas.logger.log(new Error(opRslt.message));
                                    } else {
                                        propertyControls.call(this, opRslt.resultObjects.firstOrDefault());
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
                setModel(this: DataObjectPageLayout, oModel: model.JSONModel, sName?: string): DataObjectPageLayout {
                    let model: model.JSONModel = this.getModel();
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
                                let section: any = sap.ui.getCore().byId(this.getId() + "_extendSection");
                                if (section instanceof sap.uxap.ObjectPageSubSection) {
                                    for (let item of section.getBlocks()) {
                                        let bindingInfo: any = (<any>item).getBindingInfo("text");
                                        if (!ibas.objects.isNull(bindingInfo)) {
                                            userfields.check(userFields, bindingInfo);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return ObjectPageLayout.prototype.setModel.apply(this, arguments);
                },
            });
            function propertyControls(this: DataObjectPageLayout, boInfo: shell.bo.IBOInfo): void {
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
                if (properties.length > 0) {
                    let section: sap.uxap.ObjectPageSubSection = new sap.uxap.ObjectPageSubSection(this.getId() + "_extendSection", {
                        blocks: [
                        ],
                    });
                    for (let property of properties) {
                        section.addBlock(factories.newComponent(property, "Object"));
                    }
                    this.addSection(new sap.uxap.ObjectPageSection("", {
                        title: ibas.i18n.prop("openui5_object_other_properties"),
                        subSections: [
                            section
                        ]
                    }));
                }
            }
        }
    }
}