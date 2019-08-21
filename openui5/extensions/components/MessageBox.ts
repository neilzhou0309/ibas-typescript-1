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
            export namespace MessageBox {
                export interface IMessageBoxOptions {
                    /** 类型 */
                    type: ibas.emMessageType;
                    /** 标题 */
                    title?: string;
                    /** 动作 */
                    actions?: ibas.emMessageAction[];
                    /** 调用完成 */
                    onCompleted?(action: ibas.emMessageAction): void;
                }
                export function error(vMessage: string, mOptions?: IMessageBoxOptions): void {
                    if (ibas.objects.isNull(mOptions)) {
                        mOptions = {
                            type: ibas.emMessageType.ERROR,
                        };
                    }
                    if (mOptions.type !== ibas.emMessageType.ERROR) {
                        mOptions.type = ibas.emMessageType.ERROR;
                    }
                    show(vMessage, mOptions);
                }
                export function information(vMessage: string, mOptions?: IMessageBoxOptions): void {
                    if (ibas.objects.isNull(mOptions)) {
                        mOptions = {
                            type: ibas.emMessageType.INFORMATION,
                        };
                    }
                    if (mOptions.type !== ibas.emMessageType.INFORMATION) {
                        mOptions.type = ibas.emMessageType.INFORMATION;
                    }
                    show(vMessage, mOptions);
                }
                export function success(vMessage: string, mOptions?: IMessageBoxOptions): void {
                    if (ibas.objects.isNull(mOptions)) {
                        mOptions = {
                            type: ibas.emMessageType.SUCCESS,
                        };
                    }
                    if (mOptions.type !== ibas.emMessageType.SUCCESS) {
                        mOptions.type = ibas.emMessageType.SUCCESS;
                    }
                    show(vMessage, mOptions);
                }
                export function warning(vMessage: string, mOptions?: IMessageBoxOptions): void {
                    if (ibas.objects.isNull(mOptions)) {
                        mOptions = {
                            type: ibas.emMessageType.WARNING,
                        };
                    }
                    if (mOptions.type !== ibas.emMessageType.WARNING) {
                        mOptions.type = ibas.emMessageType.WARNING;
                    }
                    show(vMessage, mOptions);
                }
                export function show(vMessage: string, mOptions?: IMessageBoxOptions): void {
                    jQuery.sap.require("sap.m.MessageBox");
                    if (!ibas.strings.isEmpty(vMessage)) {
                        vMessage = vMessage.replace(/\{(.+?)\}/g, function (value: string): string {
                            return ibas.businessobjects.describe(value);
                        });
                    }
                    sap.m.MessageBox.show(vMessage, {
                        title: mOptions.title,
                        icon: toMessageBoxIcon(mOptions.type),
                        actions: toMessageBoxAction(mOptions.actions),
                        styleClass: ibas.config.get(openui5.CONFIG_ITEM_COMPACT_SCREEN, false) ? "sapUiSizeCompact" : "",
                        onClose(oAction: any): void {
                            if (mOptions.onCompleted instanceof Function) {
                                mOptions.onCompleted(toMessageAction(oAction));
                            }
                        }
                    });

                }
                /** 转换消息类型值  */
                function toMessageBoxIcon(data: ibas.emMessageType): any {
                    switch (data) {
                        case ibas.emMessageType.ERROR:
                            return sap.m.MessageBox.Icon.ERROR;
                        case ibas.emMessageType.INFORMATION:
                            return sap.m.MessageBox.Icon.INFORMATION;
                        case ibas.emMessageType.QUESTION:
                            return sap.m.MessageBox.Icon.QUESTION;
                        case ibas.emMessageType.SUCCESS:
                            return sap.m.MessageBox.Icon.SUCCESS;
                        case ibas.emMessageType.WARNING:
                            return sap.m.MessageBox.Icon.WARNING;
                        default:
                            return sap.m.MessageBox.Icon.NONE;
                    }
                }
                /** 转换消息框动作值 */
                function toMessageBoxAction(data: ibas.emMessageAction | ibas.emMessageAction[]): any {
                    let toValue: Function = function (data: ibas.emMessageAction): any {
                        switch (data) {
                            case ibas.emMessageAction.ABORT:
                                return sap.m.MessageBox.Action.ABORT;
                            case ibas.emMessageAction.CANCEL:
                                return sap.m.MessageBox.Action.CANCEL;
                            case ibas.emMessageAction.CLOSE:
                                return sap.m.MessageBox.Action.CLOSE;
                            case ibas.emMessageAction.DELETE:
                                return sap.m.MessageBox.Action.DELETE;
                            case ibas.emMessageAction.IGNORE:
                                return sap.m.MessageBox.Action.IGNORE;
                            case ibas.emMessageAction.NO:
                                return sap.m.MessageBox.Action.NO;
                            case ibas.emMessageAction.RETRY:
                                return sap.m.MessageBox.Action.RETRY;
                            case ibas.emMessageAction.YES:
                                return sap.m.MessageBox.Action.YES;
                            default:
                                return sap.m.MessageBox.Action.OK;
                        }
                    };
                    if (data instanceof Array) {
                        let values: any = [];
                        for (let item of data) {
                            values.push(toValue(item));
                        }
                        return values;
                    } else {
                        return toValue(data);
                    }
                }
                /** 回转消息框值 */
                function toMessageAction(data: any): ibas.emMessageAction {
                    switch (data) {
                        case sap.m.MessageBox.Action.ABORT:
                            return ibas.emMessageAction.ABORT;
                        case sap.m.MessageBox.Action.CANCEL:
                            return ibas.emMessageAction.CANCEL;
                        case sap.m.MessageBox.Action.CLOSE:
                            return ibas.emMessageAction.CLOSE;
                        case sap.m.MessageBox.Action.DELETE:
                            return ibas.emMessageAction.DELETE;
                        case sap.m.MessageBox.Action.IGNORE:
                            return ibas.emMessageAction.IGNORE;
                        case sap.m.MessageBox.Action.NO:
                            return ibas.emMessageAction.NO;
                        case sap.m.MessageBox.Action.RETRY:
                            return ibas.emMessageAction.RETRY;
                        case sap.m.MessageBox.Action.YES:
                            return ibas.emMessageAction.YES;
                        default:
                            return ibas.emMessageAction.OK;
                    }
                }
            }
        }
    }
}