/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import { List, ArrayList, object, i18n, string, uuid } from "../../../ibas/bobas/index";
import { emPlantform } from "../data/index";
import {
    IElement, IModule, IFunction, IApplication, IView,
    IModuleConsole, IViewShower, IViewNavigation, IModuleFunction
} from "./Architectures.d";
import { consolesManager } from "../runtime/index";

/** 系统元素 */
export class Element implements IElement {
    /** 唯一标识 */
    id: string;
    /** 名称 */
    name: string;
    /** 类别 */
    category: string;
    /** 描述 */
    description: string;
}
/** 模块 */
export class Module extends Element implements IModule {
    constructor() {
        super();
    }
    private _functions: List<IFunction>;
    /** 功能集合 */
    functions(): IFunction[] {
        if (object.isNull(this._functions)) {
            this._functions = new ArrayList<IFunction>();
        }
        return this._functions;
    }
    /** 注册功能 */
    protected register(item: IFunction): void {
        if (object.isNull(item)) { return; };
        if (object.isNull(this._functions)) {
            this._functions = new ArrayList<IFunction>();
        }
        this._functions.add(item);
    }
}
/** 模块-功能 */
export class Functions extends Element implements IFunction {
    constructor() {
        super();
    }
}
/** 功能-应用 */
export abstract class Application<T extends IView> extends Element implements IApplication<T> {
    constructor() {
        super();
    }

    /** 视图显示者 */
    viewShower: IViewShower;
    /** 视图导航 */
    navigation: IViewNavigation;

    private _view: T;
    /** 应用的视图 */
    get view(): T {
        if (object.isNull(this._view)) {
            if (object.isNull(this.navigation)) {
                throw new Error(i18n.prop("msg_invalid_view_navigation", this.id));
            }
            this._view = <T>this.navigation.create(this);
            if (object.isNull(this._view)) {
                throw new Error(i18n.prop("msg_invalid_view", this.id));
            }
            this._view.application = this;
            this.registerView();
        }
        return this._view;
    }
    /** 注册视图 */
    protected abstract registerView(): void;
    /** 运行 */
    abstract run(...args: any[]): void;
    /** 显示视图 */
    abstract show(): void;
    /** 关闭视图 */
    abstract close(): void;
    /** 清理资源 */
    abstract destroy(): void;
}
/** 视图 */
export abstract class View implements IView {
    /** 应用 */
    application: IApplication<IView>;
    /** 唯一标识 */
    id: string;
    /** 名称 */
    title: string;
    /** 是否已显示 */
    isDisplayed: boolean;
    /** 绘制视图 */
    abstract darw(): any;
    /** 清理资源 */
    destroyEvent: Function;
    /**  
     * 触发视图事件
     * @param event 触发的事件
     * @param pars 参数
     */
    protected fireViewEvents(event: Function, ...pars: any[]): void {
        if (typeof event !== "function") {
            throw new Error(i18n.prop("msg_invalid_parameter", "event"));
        }
        event.apply(this.application, pars);
    }
}
/** 模块控制台 */
export abstract class ModuleConsole extends Module implements IModuleConsole {
    constructor() {
        super();
    }
    /** 当前平台 */
    plantform: emPlantform;
    /** 地址 */
    address: string;
    /** 图标 */
    icon: string;
    /** 功能集合 */
    functions(): IModuleFunction[] {
        let list = new Array<IModuleFunction>();
        for (let item of super.functions()) {
            list.push(<IModuleFunction>item);
        }
        return list;
    }
    /** 默认功能 */
    default(): IModuleFunction {
        let list = this.functions();
        if (list.length > 0) {
            return list[0];
        }
        return null;
    }
    private listeners: Array<Function>;
    /** 添加初始化完成监听 */
    addListener(listener: Function): void {
        if (object.isNull(this.listeners)) {
            this.listeners = new Array<Function>();
        }
        this.listeners.push(listener);
    }
    /** 初始化完成 */
    isInitialized: boolean;
    /** 初始化 */
    protected initialize(): void {
        this.registers();
        this.fireInitialized();
    }
    /** 初始化完成，需要手工调用 */
    protected fireInitialized(): void {
        this.isInitialized = true;
        if (object.isNull(this.listeners)) {
            return;
        }
        for (let listener of this.listeners) {
            if (listener instanceof Function) {
                listener.call(listener, this);
            }
        }
        // 清除监听
        delete (this.listeners);
    }
    /** 注册 */
    protected abstract registers(): void;
    /** 运行，重载后必须保留基类调用 */
    run(): void {
        // 注册当前模块
        consolesManager.register(this);
    }
    /** 创建视图导航 */
    abstract navigation(): IViewNavigation;
    /** 注册功能 */
    protected register(item: IModuleFunction): void {
        item.id = uuid.random();
        item.navigation = this.navigation();
        super.register(item);
    }
}
/** 模块控制台 */
export abstract class ModuleFunction extends Functions implements IModuleFunction {
    /** 图标 */
    icon: string;
    /** 创建视图导航 */
    navigation: IViewNavigation;
    /** 默认功能 */
    abstract default(): IApplication<IView>;
}
/** 视图-导航 */
export abstract class ViewNavigation implements IViewNavigation {
    /**
     * 创建视图
     * @param id 应用id
     */
    create(id: string): IView;
    /**
     * 创建视图
     * @param app 应用
     */
    create<T extends IView>(app: IApplication<T>): IView;
    /**
     * 创建视图
     */
    create(data: any): IView {
        let id: string = null;
        if (typeof data === "string") {
            id = data;
        } else if (!object.isNull(data) && !object.isNull(data.id)) {
            id = data.id;
        }
        if (object.isNull(id)) {
            throw new Error(i18n.prop("msg_invalid_parameter", "view id"));
        }
        let view: IView = this.newView(id);
        if (object.isNull(view)) {
            throw new Error(i18n.prop("msg_invalid_view", id));
        }
        view.id = string.format("{0} - {1}", id, uuid.random());
        return view;
    }

    /** 
     * 创建实例     
     * @param id 应用id
     */
    protected abstract newView(id: string): IView;
}