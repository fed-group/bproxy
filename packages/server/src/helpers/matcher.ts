/*
 * @description: 负责解析用户配置 IConfig 中的 rule 部分
 * @author: Feng Yinchao
 * @Date: 2022-09-30 11:35:29
 */

import { cloneDeep } from 'lodash';
import type { IConfig } from '../types/config';

interface IMatcherResult {
  matched: boolean;
  rule: IConfig.IRule | [];
}
/**
 * 检测给定的 url 是否满足 rule 规则
 * @param rules 规则数组
 * @param url 待检测的 url
 * @returns 是否匹配
 */
export function matcher(rules: IConfig.IRule[], url: string): IMatcherResult {
  const options: IMatcherResult = {
    matched: false,
    rule: [],
  };
  cloneDeep(rules).forEach((rule: IConfig.IRule) => {
    if (options.matched) return;
    if ('url' in rule) {
      options.matched = url.includes(rule.url);
    }
    if (options.matched) {
      options.rule = cloneDeep(rule);
    }
  });
  return options;
}
