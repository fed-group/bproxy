/**
 * 配置文件预处理
 */
import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';
import { Log } from './';

const REG_IP = /^(\d{1,3}\.){3}\d{1,3}$/;

function checkResponseType(target) {
  // 响应函数
  if (_.isFunction(target)) {
    return 'response';
  }
  // 响应字符串
  if (_.isString(target)) {
    // 响应的是URL
    if (/https?:\/\//.test(target)) {
      return 'redirect';
    }
    // 响应IP
    if (REG_IP.test(target)) {
      return 'host';
    }
    // 响应的是文件或者目录
    if (target.indexOf('file://') === 0 || target.indexOf('/') === 0) {
      try {
        fs.accessSync(`${target}`, fs.constants.R_OK);
        return 'path';
      } catch (err) {
        Log(`${target} 路径错误`);
      }
    }

    if (/^\./.test(target)) {
      return 'path';
    }

    return 'response';
  }

  // 响应的是数字
  if (_.isNumber(target)) {
    return 'statusCode';
  }

  return undefined;
}

function checkSingleRule(rule: IConfig.IRule) {
  // 废弃regx参数，使用新参数 url
  if (rule.url) {
    rule.regx = rule.url;
    delete rule.url;
  }
  if (rule.target) {
    const ruleKey = checkResponseType(rule.target);
    if (!ruleKey) {
      Log('target参数错误');
    } else {
      switch (ruleKey) {
        case 'path':
          rule[ruleKey] = path.resolve(`${rule.target}`);
          break;
        default:
          rule[ruleKey] = rule.target;
          break;
      }

      delete rule.target;
    }
  }
  if (rule.cors === true) {
    rule.responseHeaders = {
      ...(rule.responseHeaders || {}),
      ...{
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Requested-With',
      },
    };

    delete rule.cors;
  }
  return {
    ...rule,
  };
}

export default function preload(params: IConfig.Config) {
  params.rules = params.rules.map(rule => checkSingleRule(rule));

  // 兼容老版本
  if (params.sslAll === true) {
    params.https = true;
    delete params.sslAll;
  }

  return params;
}
