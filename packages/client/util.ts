/* eslint-disable no-empty */
/*
 * @description: Util
 * @author: Feng Yinchao
 * @Date: 2022-10-11 19:09:46
 */
import * as qs from 'qs';
// import type { FilterParams, any } from '../../types/web';
import { get, take, takeRight } from 'lodash';

export const parseURL = url => {
  const a: HTMLAnchorElement = document.createElement('a');
  a.href = url;
  const res = {
    hostname: a.hostname,
    path: a.pathname,
    protocol: a.protocol.replace(':', ''),
    query: a.search.replace('?', ''),
    origin: a.origin,
  };
  return res;
};

export const arrayBuf2string = (buf: any) => {
  if (typeof buf === 'string') {
    return buf;
  }
  const enc = new TextDecoder('utf-8');

  return enc.decode(buf);
};

export const parseQueryString = (query: string) => {
  if (!query) {
    return {};
  }
  return qs.parse(query);
};

export const parseRequest = (req: any) => {
  const { hostname, path, protocol, query, origin } = parseURL(req.url);
  const params = parseQueryString(query);

  return Object.assign(req, {
    host: hostname,
    path,
    protocol,
    origin,
    requestParams: params,
  });
};

export const transformRegExpSymbol = (str = '') => {
  return str
    .replace(/\./g, '\\.')
    .replace(/\*/g, '\\*')
    .replace(/\//g, '\\/')
    .replace(/\?/g, '\\?')
    .replace(/\+/g, '\\+');
};

const xhrHeaders = ['x-requested-with', 'sec-fetch'];
const xhrHeadersReg = new RegExp(`(${xhrHeaders}.join('|'))`);
const filterStringCache: any = {};
export const filterValueIncludes = (value = '', filterString = '') => {
  if (filterString.length === 0) {
    return true;
  }
  let regx = filterStringCache[filterString];
  if (!regx) {
    regx = new RegExp(`(${transformRegExpSymbol(filterString)})`, 'i');
    filterStringCache[filterString] = regx;
  }

  return regx.test(value);
};

export const filterRequestItem = (request: any, filter: any) => {
  const { filterString, filterType, filterContentType, filterRequestMethod } = filter;
  if (filterRequestMethod !== 'all' && request?.custom?.method && filterRequestMethod) {
    return request.custom.method.toLowerCase() === filterRequestMethod;
  }
  if (!filterString && filterContentType === 'all') {
    return true;
  }
  if (filterString) {
    switch (filterType) {
      case 'url':
        return filterValueIncludes(request?.custom?.url || '', filterString);
      case 'path':
        return filterValueIncludes(request?.custom?.path || '', filterString);
      case 'host':
        return filterValueIncludes(request?.custom?.host || '', filterString);
      default:
        break;
    }
  }
  if (filterContentType) {
    const contentType = get(request, 'responseHeaders["content-type"]');
    // ajax
    if (filterContentType === 'xhr') {
      const requestHeaders = get(request, 'requestHeaders') || {};
      let match = false;
      Object.keys(requestHeaders).forEach(headerKey => {
        if (match) return;
        match = xhrHeadersReg.test(headerKey);
      });

      return match;
    }
    // image
    if (filterContentType === 'image') {
      return contentType?.includes(filterContentType) || contentType?.includes('icon');
    }
    return contentType?.includes(filterContentType);
  }

  return false;
};

export const filterRequestList = (list: any[], filter: any) =>
  list.filter((item: any) => filterRequestItem(item, filter));

export const rand = (min, max) => {
  return parseInt(Math.random() * (max - min + 1) + min, 10);
};
export const getRandStr = (len = 12) => {
  const base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const max = base.length - 1;
  return Array(len)
    .fill(0)
    .map((_, idx) => base[rand(idx === 0 ? 10 : 0, max)])
    .join('');
};

export const htmlEscape = str => {
  if (str?.replace) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  return str;
};

export const formatFileSize = str => {
  if (!str || !/^\d+$/.test(str)) {
    return '-';
  }
  const num = Number(str);
  if (num > 1024 * 1024) {
    return `${parseInt(((num / 1024 / 1024) * 10).toString(), 10) / 10}M`;
  }
  if (num > 1024) {
    return `${parseInt(((num / 1024) * 10).toString(), 10) / 10}K`;
  }
  return `${num}B`;
};

export const shorthand = (str, leftLength = 20, max = 40) => {
  if (typeof str === 'string' && str.length > max) {
    const arr = str.split('');
    const arr1 = take(arr, leftLength);
    const arr2 = takeRight(arr, leftLength);

    return `${arr1.join('')}...${arr2.join('')}`;
  }
  return str;
};

export const showResponseType = type => {
  if (!type) return '-';
  const txt = type
    .replace(/^\w+\//, '')
    .replace(/x-javascript/, 'javascript')
    .replace(/(;\s?[\s\S]+)+/g, '');

  return txt;
};

export const findUrlHasImageType = url => {
  return /\.(png|jpg|webp|gif)/i.test(url);
};

export const findLinkFromString = str => {
  if (!(str && str.replace)) {
    return str;
  }
  const cls = url => (findUrlHasImageType(url) ? 'json-viewer-link' : '');
  return htmlEscape(str).replace(/"(https?:\/\/[^"]+)"/g, (a, b) => {
    const $cls = cls(b);
    if ($cls) {
      return `"<a class="${$cls}" href='${b}' target="_blank">${b}<img src="${b}" /></a>"`.replace(/\n/g, '');
    }
    return `"<a href='${b}' target="_blank">${b}</a>"`;
  });
};

export const formatWsSymbol = str => {
  let data = {
    dir: '',
    message: '',
  };

  try {
    data = JSON.parse(str);
  } catch (err) {}

  return data;
  // const down = 'down';
  // const up = 'up';
  // const WIDE_CHAR_REG = /^[^{^<]+/;
  // const wideChars = str.match(WIDE_CHAR_REG);
  // let dir = '';
  // if (wideChars && wideChars.length) {
  //   const wideChar = wideChars[0];
  //   const list = wideChar.split('').map(i => i.codePointAt(0));
  //   if (list && list.length && list[1] === 126) {
  //     dir = down;
  //   } else {
  //     dir = up;
  //   }
  // }
  // return {
  //   className: dir,
  //   // content: str.replace(WIDE_CHAR_REG, ''),
  //   content: str,
  // };
};

export const highlight = () => {
  // eslint-disable-next-line no-unused-expressions
  (window as any)?.PR?.prettyPrint();
};

export const objectToUrlQueryString = obj => {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&');
};

export function decodeURL(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return str;
  }
}

export const formatObjectKeyRender = value => {
  switch (Object.prototype.toString.call(value)) {
    case '[object Boolean]':
      return JSON.stringify(value);
    default:
      return decodeURL(value);
  }
};

export const formatSeconds = (sec: number): string => {
  if (sec > 1000) {
    return `${(sec / 1000).toFixed(1)}s`;
  }

  return `${sec}ms`;
};
