﻿/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import { List } from "./Common.d";
import { string } from "./index";

/**
 * 数组集合
 */
export class ArrayList<T> extends Array<T> implements List<T> {
    /**
     * 添加项目
     * @param item 项目
     */
    add(item: T) {
        // 无效值不做处理
        if (item === null || item === undefined) {
            return;
        }
        this.push(item);
    }

    /**
     * 移出项目
     * @param item 项目
     */
    remove(item: T) {
        // 无效值不做处理
        if (item === null || item === undefined) {
            return;
        }
        let keeps = new Array();// 临时数组
        for (let tmp of this) {
            if (item === tmp) {
                // 被移出的数组，不保留
                break;
            }
            keeps.push(item);
        }
        // 重新插入被保存的
        for (let tmp of keeps) {
            this.push(tmp);
        }
    }

    /**
     * 移出项目
     * @param index 项目索引
     */
    removeAt(index: number) {
        if (index >= 0 && index < super.length) {
            this.remove(this[index]);
        }
    }

    /**
     * 第一个或默认
     */
    firstOrDefault(): T {
        if (this.length > 0) {
            return this[0];
        }
        return null;
    }

    /**
     * 最后一个或默认
     */
    lastOrDefault(): T {
        if (this.length > 0) {
            return this[this.length - 1];
        }
        return null;
    }
}
/**
 * 字符串构建器
 */
export class StringBuilder {

    private values: string[] = new Array<string>();

    /**
     * 获取当前长度
     */
    get length(): number {
        return this.values.length;
    }

    /**
     * 添加字符
     */
    append(str: any): void {
        this.values.push(str.toString());
    }

    /**
     * 添加格式化字符
     * @param format 字符格式
     * @param args 替换字符
     */
    appendFormat(format: string, ...args: any[]): void {
        this.append(string.format(format, args));
    }
    /**
     * 生成字符串
     */
    toString(): string {
        let str: string = "";
        for (let item of this.values) {
            str += item;
        }
        return str;
    }
}

/**
 * 键值
 */
export class KeyValue {
    /** 键 */
    key: string;
    /** 值 */
    value: any;
}