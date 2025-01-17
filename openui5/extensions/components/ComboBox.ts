﻿/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sap {
    export namespace extension {
        export namespace m {
            /**
             * 下拉框
             */
            sap.m.ComboBox.extend("sap.extension.m.ComboBox", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {
                },
                /**
                 * 获取绑定值
                 */
                getBindingValue(this: ComboBox): string {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(this: ComboBox, value: string): ComboBox {
                    sap.m.ComboBox.prototype.setSelectedKey.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /** 重写此方法，设置选中值 */
                setSelection(this: ComboBox, value: sap.ui.core.Item): ComboBox {
                    (<any>sap.m.ComboBox.prototype).setSelection.apply(this, arguments);
                    this.setProperty("bindingValue", this.getSelectedKey());
                    return this;
                },
                /**
                 * 销毁可选项
                 */
                destroyItems(this: ComboBox): ComboBox {
                    (<any>sap.m.ComboBox.prototype).destroyItems.apply(this, arguments);
                    this.setValue(undefined);
                    return this;
                },
                /** 重写绑定 */
                bindProperty(this: ComboBox, sName: string, oBindingInfo: any): ComboBox {
                    managedobjects.checkBinding.apply(this, arguments);
                    sap.m.ComboBox.prototype.bindProperty.apply(this, arguments);
                    return this;
                },
                applySettings(this: ComboBox, mSettings: any, oScope?: any): ComboBox {
                    sap.m.ComboBox.prototype.applySettings.apply(this, arguments);
                    if (this.getItems().length === 0) {
                        this.fireLoadItems({});
                    }
                    return this;
                },
            });
            /**
             * 多选下拉框（数据分割符）
             */
            sap.m.MultiComboBox.extend("sap.extension.m.MultiComboBox", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                        /** 数据分隔符 */
                        dataSeparator: { type: "string", defaultValue: ibas.DATA_SEPARATOR },
                    },
                    events: {}
                },
                renderer: {
                },
                /**
                 * 获取绑定值
                 */
                getBindingValue(this: MultiComboBox): string {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(this: MultiComboBox, value: string): MultiComboBox {
                    sap.m.MultiComboBox.prototype.setSelectedKeys.apply(this, ibas.objects.isNull(value) ? [value] : [value.split(this.getDataSeparator())]);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 销毁可选项
                 */
                destroyItems(this: MultiComboBox): MultiComboBox {
                    (<any>sap.m.MultiComboBox.prototype).destroyItems.apply(this, arguments);
                    this.setSelectedKeys([]);
                    return this;
                },
                /** 重写绑定 */
                bindProperty(this: MultiComboBox, sName: string, oBindingInfo: any): MultiComboBox {
                    managedobjects.checkBinding.apply(this, arguments);
                    sap.m.MultiComboBox.prototype.bindProperty.apply(this, arguments);
                    return this;
                },
                /** 初始化 */
                init(this: MultiComboBox): void {
                    // 调用基类构造
                    (<any>sap.m.MultiComboBox.prototype).init.apply(this, arguments);
                    this.attachSelectionFinish(undefined, (event: sap.ui.base.Event) => {
                        let source: any = event.getSource();
                        if (source instanceof MultiComboBox) {
                            let builder: ibas.StringBuilder = new ibas.StringBuilder();
                            builder.map(null, "");
                            builder.map(undefined, "");
                            for (let item of source.getSelectedKeys()) {
                                if (builder.length > 0) {
                                    builder.append(source.getDataSeparator());
                                }
                                builder.append(item);
                            }
                            source.setProperty("bindingValue", builder.toString());
                        }
                    });
                },
                applySettings(this: MultiComboBox, mSettings: any, oScope?: any): sap.m.MultiComboBox {
                    sap.m.MultiComboBox.prototype.applySettings.apply(this, arguments);
                    if (this.getItems().length === 0) {
                        this.fireLoadItems({});
                    }
                    return this;
                },
            });
        }
    }
}
