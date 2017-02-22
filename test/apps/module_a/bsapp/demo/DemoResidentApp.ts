/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    BOResidentApplication, IBOResidentView, i18n, object
} from "../../../../../ibas/bsbas/index";

/** 常驻应用-演示 */
export class DemoResidentApp extends BOResidentApplication<IDemoResidentView> {

    /** 应用标识 */
    static APPLICATION_ID: string = "f460a685-5e82-4268-aa1a-b767dbfa0d87";
    /** 应用名称 */
    static APPLICATION_NAME: string = "module_a_app_demo_resident";

    constructor() {
        super();
        this.id = DemoResidentApp.APPLICATION_ID;
        this.name = DemoResidentApp.APPLICATION_NAME;
        this.description = i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
    }

}
/** 视图-演示 */
export interface IDemoResidentView extends IBOResidentView {
}