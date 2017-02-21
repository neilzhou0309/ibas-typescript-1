/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import { IBOViewView } from "./BOApplications.d";
import { BOApplication } from "./BOApplications";


/**
 * 业务对象查看应用
 */
export abstract class BOViewApplication<T extends IBOViewView> extends BOApplication<T> {

    /** 注册视图，重载需要回掉此方法 */
    protected registerView(): void {
        this.view.destroyEvent = this.destroy;
    }
}