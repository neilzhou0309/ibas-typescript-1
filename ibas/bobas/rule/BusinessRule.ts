/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace ibas {
    /** 业务规则-最大长度 */
    export class BusinessRuleMaxLength extends BusinessRuleCommon {
        /**
         *
         * @param length 长度
         * @param properties 属性
         */
        constructor(length: number, ...properties: string[]) {
            super();
            this.maxLength = length;
            this.name = i18n.prop("sys_business_rule_max_length");
            for (let item of properties) {
                this.inputProperties.add(item);
            }
        }
        maxLength: number;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            for (let item of context.inputValues.entries()) {
                let name: string = item["0"];
                let value: any = item["1"];
                if (typeof value === "string") {
                    if (value.length > this.maxLength) {
                        throw new BusinessRuleError(i18n.prop("sys_business_rule_max_length_error", name, value, this.maxLength));
                    }
                }
            }
        }
    }
    /** 业务规则-最大值 */
    export class BusinessRuleMaxValue<T extends number | Date> extends BusinessRuleCommon {
        /**
         *
         * @param maxValue 最大值
         * @param properties 属性
         */
        constructor(maxValue: T, ...properties: string[]) {
            super();
            this.name = i18n.prop("sys_business_rule_max_value");
            this.maxValue = maxValue;
            for (let item of properties) {
                this.inputProperties.add(item);
            }
        }
        maxValue: T;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            for (let item of context.inputValues.entries()) {
                let name: string = item["0"];
                let value: any = item["1"];
                if (typeof this.maxValue === "number") {
                    value = numbers.valueOf(value);
                    if (value > this.maxValue) {
                        throw new BusinessRuleError(i18n.prop("sys_business_rule_max_value_error", name, value, this.maxValue));
                    }
                } else if (this.maxValue instanceof Date) {
                    value = dates.valueOf(value);
                    if (dates.compare(value, this.maxValue) > 0) {
                        throw new BusinessRuleError(i18n.prop("sys_business_rule_max_value_error", name, value, this.maxValue));
                    }
                }
            }
        }
    }
    /** 业务规则-最小值 */
    export class BusinessRuleMinValue<T extends number | Date> extends BusinessRuleCommon {
        /**
         *
         * @param minValue 最小值
         * @param properties 属性
         */
        constructor(minValue: T, ...properties: string[]) {
            super();
            this.name = i18n.prop("sys_business_rule_min_value");
            this.minValue = minValue;
            for (let item of properties) {
                this.inputProperties.add(item);
            }
        }
        minValue: T;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            for (let item of context.inputValues.entries()) {
                let name: string = item["0"];
                let value: any = item["1"];
                if (typeof this.minValue === "number") {
                    value = numbers.valueOf(value);
                    if (value < this.minValue) {
                        throw new BusinessRuleError(i18n.prop("sys_business_rule_min_value_error", name, value, this.minValue));
                    }
                } else if (this.minValue instanceof Date) {
                    value = dates.valueOf(value);
                    if (dates.compare(value, this.minValue) < 0) {
                        throw new BusinessRuleError(i18n.prop("sys_business_rule_min_value_error", name, value, this.minValue));
                    }
                }
            }
        }
    }
    /** 业务规则-要求有值 */
    export class BusinessRuleRequired extends BusinessRuleCommon {
        /**
         *
         * @param properties 属性
         */
        constructor(...properties: string[]) {
            super();
            this.name = i18n.prop("sys_business_rule_required");
            for (let item of properties) {
                this.inputProperties.add(item);
            }
        }
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            for (let item of context.inputValues.entries()) {
                let name: string = item["0"];
                let value: any = item["1"];
                if (objects.isNull(value)) {
                    throw new BusinessRuleError(i18n.prop("sys_business_rule_required_error", name));
                }
            }
        }
    }
    /** 业务规则-求和 */
    export class BusinessRuleSummation extends BusinessRuleCommon {
        /**
         *
         * @param result 属性-结果
         * @param addends 属性-加数
         */
        constructor(result: string, ...addends: string[]) {
            super();
            this.name = i18n.prop("sys_business_rule_summation");
            this.result = result;
            this.addends = new ArrayList<string>();
            for (let item of addends) {
                this.addends.add(item);
            }
            // 设置输入输出参数
            for (let item of this.addends) {
                this.inputProperties.add(item);
            }
            this.affectedProperties.add(this.result);
        }
        /** 结果 */
        result: string;
        /** 求和 */
        addends: IList<string>;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let sum: number = 0;
            for (let property of this.addends) {
                let value: number = numbers.valueOf(context.inputValues.get(property));
                sum += value;
            }
            context.outputValues.set(this.result, numbers.round(sum));
        }
    }
    /** 业务规则-求差 */
    export class BusinessRuleSubtraction extends BusinessRuleCommon {
        /**
         *
         * @param result 属性-结果
         * @param subtrahend 属性-被减数
         * @param subtractors 属性-减数
         */
        constructor(result: string, subtrahend: string, ...subtractors: string[]) {
            super();
            this.name = i18n.prop("sys_business_rule_subtraction");
            this.result = result;
            this.subtrahend = subtrahend;
            this.subtractors = new ArrayList<string>();
            for (let item of subtractors) {
                this.subtractors.add(item);
            }
            // 设置输入输出参数
            this.inputProperties.add(this.subtrahend);
            for (let item of this.subtractors) {
                this.inputProperties.add(item);
            }
            this.affectedProperties.add(this.result);
        }
        /** 结果 */
        result: string;
        /** 被减数 */
        subtrahend: string;
        /** 减数 */
        subtractors: IList<string>;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let total: number = numbers.valueOf(context.inputValues.get(this.subtrahend));
            for (let property of this.subtractors) {
                let value: number = numbers.valueOf(context.inputValues.get(property));
                total -= value;
            }
            context.outputValues.set(this.result, numbers.round(total));
        }
    }
    /** 业务规则-求积 */
    export class BusinessRuleMultiplication extends BusinessRuleCommon {
        /**
         *
         * @param result 属性-结果
         * @param multiplicand 属性-被乘数
         * @param multiplier 属性-乘数
         * @param decimalPlaces 结果保留小数位
         */
        constructor(result: string, multiplicand: string, multiplier: string, decimalPlaces: number = undefined) {
            super();
            this.name = i18n.prop("sys_business_rule_multiplication");
            this.result = result;
            this.multiplicand = multiplicand;
            this.multiplier = multiplier;
            this.decimalPlaces = decimalPlaces;
            this.inputProperties.add(this.multiplicand);
            this.inputProperties.add(this.multiplier);
            this.affectedProperties.add(this.result);
        }
        /** 结果 */
        result: string;
        /** 被乘数 */
        multiplicand: string;
        /** 乘数 */
        multiplier: string;
        /** 结果保留小数位 */
        decimalPlaces: number;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let multiplicand: number = numbers.valueOf(context.inputValues.get(this.multiplicand));
            let multiplier: number = numbers.valueOf(context.inputValues.get(this.multiplier));
            let result: number = multiplicand * multiplier;
            context.outputValues.set(this.result, numbers.round(result, this.decimalPlaces));
        }
    }
    /** 业务规则-求商 */
    export class BusinessRuleDivision extends BusinessRuleCommon {
        /**
         *
         * @param result 属性-结果
         * @param dividend 属性-被除数
         * @param divisor 属性-除数
         * @param decimalPlaces 结果保留小数位
         */
        constructor(result: string, dividend: string, divisor: string, decimalPlaces: number = undefined) {
            super();
            this.name = i18n.prop("sys_business_rule_division");
            this.result = result;
            this.dividend = dividend;
            this.divisor = divisor;
            this.decimalPlaces = decimalPlaces;
            this.inputProperties.add(this.dividend);
            this.inputProperties.add(this.divisor);
            this.affectedProperties.add(this.result);
        }
        /** 结果 */
        result: string;
        /** 被乘数 */
        dividend: string;
        /** 乘数 */
        divisor: string;
        /** 结果保留小数位 */
        decimalPlaces: number;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let dividend: number = numbers.valueOf(context.inputValues.get(this.dividend));
            let divisor: number = numbers.valueOf(context.inputValues.get(this.divisor));
            let result: number = dividend / divisor;
            context.outputValues.set(this.result, numbers.round(result, this.decimalPlaces));
        }
    }
    /** 业务规则-加减法推导 */
    export class BusinessRuleAdditiveDeduction extends BusinessRuleCommon {
        /**
         *
         * @param augend 属性-被加数
         * @param addend 属性-加数
         * @param result 属性-结果
         */
        constructor(augend: string, addend: string, result: string) {
            super();
            this.name = i18n.prop("sys_business_rule_additive_deduction");
            this.result = result;
            this.augend = augend;
            this.addend = addend;
            this.inputProperties.add(this.result);
            this.inputProperties.add(this.augend);
            this.inputProperties.add(this.addend);
            this.affectedProperties.add(this.result);
            this.affectedProperties.add(this.addend);
        }
        /** 结果 */
        result: string;
        /** 被加数 */
        augend: string;
        /** 加数 */
        addend: string;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let result: number = numbers.valueOf(context.inputValues.get(this.result));
            let augend: number = numbers.valueOf(context.inputValues.get(this.augend));
            let addend: number = numbers.valueOf(context.inputValues.get(this.addend));

            if (augend === 0) {
                context.outputValues.set(this.result, numbers.round(addend));
                return;
            }
            if (addend !== 0 && result === 0) {
                // 结果 = 加数 + 被加数
                result = addend + augend;
                context.outputValues.set(this.result, numbers.round(result));
            } else if (addend === 0 && result !== 0) {
                // 加数 = 结果 - 被加数
                addend = result - augend;
                context.outputValues.set(this.addend, numbers.round(addend));
            }
        }
    }
    /** 业务规则-乘除法推导 */
    export class BusinessRuleMultiplicativeDeduction extends BusinessRuleCommon {
        /**
         *
         * @param multiplicand 属性-被乘数
         * @param multiplier 属性-乘数
         * @param result 属性-结果
         * @param resultPlaces 结果保留小数位
         * @param multiplierPlaces 乘数保留小数位
         */
        constructor(multiplicand: string, multiplier: string, result: string, resultPlaces: number = undefined, multiplierPlaces: number = undefined) {
            super();
            this.name = i18n.prop("sys_business_rule_multiplicative_deduction");
            this.result = result;
            this.multiplicand = multiplicand;
            this.multiplier = multiplier;
            this.resultPlaces = resultPlaces;
            this.multiplierPlaces = multiplierPlaces;
            this.inputProperties.add(this.result);
            this.inputProperties.add(this.multiplicand);
            this.inputProperties.add(this.multiplier);
            this.affectedProperties.add(this.result);
            this.affectedProperties.add(this.multiplier);
        }
        /** 结果 */
        result: string;
        /** 被乘数 */
        multiplicand: string;
        /** 乘数 */
        multiplier: string;
        /** 结果保留小数位 */
        resultPlaces: number;
        /** 乘数保留小数位 */
        multiplierPlaces: number;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let result: number = numbers.valueOf(context.inputValues.get(this.result));
            let multiplicand: number = numbers.valueOf(context.inputValues.get(this.multiplicand));
            let multiplier: number = numbers.valueOf(context.inputValues.get(this.multiplier));

            if (multiplicand === 0) {
                context.outputValues.set(this.result, numbers.round(multiplicand, this.resultPlaces));
                return;
            }
            if (multiplier !== 0 && result === 0) {
                // 结果 = 乘数 * 被乘数
                result = multiplier * multiplicand;
                context.outputValues.set(this.result, numbers.round(result, this.resultPlaces));
            } else if (multiplicand !== 0 && result !== 0) {
                // 乘数 = 结果 / 被乘数
                multiplier = result / multiplicand;
                context.outputValues.set(this.multiplier, numbers.round(multiplier, this.multiplierPlaces));
            }
        }
    }
    /** 业务规则-集合元素属性求和 */
    export class BusinessRuleSumElements extends BusinessRuleCollection {
        /**
         *
         * @param result 属性-结果
         * @param collection 属性-集合
         * @param summing 属性-求和
         * @param filter 集合过滤器，ture保留；false过滤
         */
        constructor(result: string, collection: string, summing: string, filter?: (data: any) => boolean) {
            super(collection, filter);
            this.name = i18n.prop("sys_business_rule_sum_elements");
            this.result = result;
            this.summing = summing;
            this.inputProperties.add(this.summing);
            this.affectedProperties.add(this.result);
        }
        /** 结果 */
        result: string;
        /** 求和 */
        summing: string;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCollection): void {
            let result: number = 0;
            let values: any[] = context.inputValues.get(this.summing);
            if (!objects.isNull(values)) {
                for (let item of values) {
                    result += numbers.valueOf(item);
                }
            }
            context.outputValues.set(this.result, numbers.round(result));
        }
    }
    /** 业务规则-乘除法推导，增强 */
    export class BusinessRuleMultiplicativeDeductionEx extends BusinessRuleMultiplicativeDeduction {
        /**
         *
         * @param multiplicand 属性-被乘数
         * @param multiplier 属性-乘数
         * @param result 属性-结果
         * @param resultPlaces 结果保留小数位
         * @param multiplierPlaces 乘数保留小数位
         * @param multiplicandPlaces 被乘数保留小数位
         */
        constructor(multiplicand: string, multiplier: string, result: string,
            resultPlaces: number = undefined, multiplierPlaces: number = undefined, multiplicandPlaces: number = undefined) {
            super(multiplicand, multiplier, result, resultPlaces, multiplierPlaces);
            this.multiplicandPlaces = multiplicandPlaces;
            this.affectedProperties.add(this.multiplicand);
        }
        /** 被乘数保留小数位 */
        multiplicandPlaces: number;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            if (strings.isEmpty(context.trigger)) {
                super.compute(context);
            } else {
                let result: number = numbers.valueOf(context.inputValues.get(this.result));
                let multiplicand: number = numbers.valueOf(context.inputValues.get(this.multiplicand));
                let multiplier: number = numbers.valueOf(context.inputValues.get(this.multiplier));
                if (strings.equalsIgnoreCase(context.trigger, this.result)) {
                    // 结果触发
                    if (multiplicand !== 0 && multiplier <= 0) {
                        // 乘数 = 结果 / 被乘数
                        // 小于0时，重新计算
                        multiplier = result / multiplicand;
                        context.outputValues.set(this.multiplier, numbers.round(multiplier, this.multiplierPlaces));
                    } else if (multiplier !== 0) {
                        // 被乘数 = 结果 / 乘数
                        let newMultiplicand: number = result / multiplier;
                        if (Math.abs(newMultiplicand - multiplicand) > 0.00001) {
                            context.outputValues.set(this.multiplicand, numbers.round(newMultiplicand, this.multiplicandPlaces));
                        }
                    }
                } else if (strings.equalsIgnoreCase(context.trigger, this.multiplicand)
                    || strings.equalsIgnoreCase(context.trigger, this.multiplier)) {
                    // 被乘数触发 or 乘数触发
                    // 结果 = 乘数 * 被乘数
                    let newResult: number = multiplier * multiplicand;
                    if (Math.abs(newResult - result) > 0.00001) {
                        context.outputValues.set(this.result, numbers.round(newResult, this.resultPlaces));
                    }
                } else {
                    super.compute(context);
                }
            }
        }
    }
    /** 业务规则-舍入 */
    export class BusinessRuleRoundingOff extends BusinessRuleCommon {
        /**
         * 构造
         * @param rounding 属性-舍入值
         * @param original 属性-原始值
         * @param place  保留小数位数
         * @param enabled  属性-是否激活
         */
        constructor(rounding: string, original: string, place: number = 0, enabled: string = undefined) {
            super();
            this.name = i18n.prop("sys_business_rule_rounding_off");
            this.rounding = rounding;
            this.original = original;
            this.place = place;
            this.enabled = enabled;
            if (typeof this.place !== "number") {
                this.place = config.get(CONFIG_ITEM_DECIMAL_PLACES);
            }
            // 设置输入输出参数
            this.inputProperties.add(this.original);
            if (!strings.isEmpty(this.enabled)) {
                this.inputProperties.add(this.enabled);
            }
            // 设置输出参数
            this.affectedProperties.add(this.rounding);
            this.affectedProperties.add(this.original);
        }
        /** 属性-舍入值 */
        rounding: string;
        /** 属性-原始值 */
        original: string;
        /** 属性-激活 */
        enabled: string;
        /** 保留小数位 */
        place: number;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let enabled: boolean = false;
            if (!strings.isEmpty(this.enabled)) {
                enabled = Boolean(context.inputValues.get(this.enabled));
            }
            if (enabled !== true) {
                return;
            }
            let place: number = Number(this.place);
            let original: number = Number(context.inputValues.get(this.original));
            if (isNaN(original)) {
                return;
            }
            let value: number = numbers.round(original, place);
            if (original !== value) {
                context.outputValues.set(this.rounding, value - original);
                context.outputValues.set(this.original, value);
            } else {
                context.outputValues.set(this.rounding, 0);
            }
        }
    }
    /** 业务规则-日期计算 */
    export class BusinessRuleDateCalculation extends BusinessRuleCommon {
        /**
         * 日期计算
         * @param source 属性-源
         * @param target 属性-目标
         * @param changeValue 变化值
         * @param unit 变化单位(天、小时)
         */
        constructor(source: string, target: string, changeValue: number, unit?: "day" | "hour") {
            super();
            this.source = source;
            this.target = target;
            this.changeValue = changeValue;
            this.unit = unit;
            if (strings.isEmpty(this.unit)) {
                this.unit = "day";
            }
            this.inputProperties.add(this.source);
            this.affectedProperties.add(this.target);
        }
        source: string;
        target: string;
        changeValue: number;
        unit: "day" | "hour";
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let sValue: Date = context.inputValues.get(this.source), tValue: Date;
            if (sValue instanceof Date) {
                let value: number = this.changeValue * 1000 * 60 * 60;
                if (this.unit === "day") {
                    value = value * 24;
                    tValue = dates.valueOf(sValue.getTime() + value);
                    context.outputValues.set(this.target, tValue);
                } else if (this.unit === "hour") {
                    tValue = dates.valueOf(sValue.getTime() + value);
                    context.outputValues.set(this.target, tValue);
                }
            }
        }
    }
    /** 业务规则-日期计算间隔 */
    export class BusinessRuleDateCalculationInterval extends BusinessRuleCommon {
        /**
         * 构造
         * @param start 属性-开始日期
         * @param end 属性-结束日期
         * @param result 属性-结果
         * @param unit 计算单位
         */
        constructor(start: string, end: string, result: string, unit?: ibas.dates.emDifferenceType) {
            super();
            this.start = start;
            this.end = end;
            this.result = result;
            this.unit = unit;
            if (strings.isEmpty(this.unit)) {
                this.unit = ibas.dates.emDifferenceType.DAY;
            }
            this.inputProperties.add(this.start);
            this.inputProperties.add(this.end);
            this.affectedProperties.add(this.result);
        }
        start: string;
        end: string;
        result: string;
        unit: ibas.dates.emDifferenceType;
        /** 计算规则 */
        protected compute(context: BusinessRuleContextCommon): void {
            let sDate: Date = context.inputValues.get(this.start);
            let eDate: Date = context.inputValues.get(this.end);
            let value: number = ibas.dates.difference(this.unit, eDate, sDate);
            if (typeof value !== "number") {
                value = undefined;
            }
            context.outputValues.set(this.result, value);
        }
    }
}