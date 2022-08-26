/*
 * @description: 正则相关 helper
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
export const isNeedTransformString2RegExp = (str: string) => {
  if (!str) return false;
  return /[.*^$()/]/.test(str);
};

export const url2regx = (url: string): RegExp => {
  const newUrl = url
    .replace(/\./g, '\\.')
    .replace(/\//g, '/')
    .replace(/\*{2,}/g, '(\\S+)')
    .replace(/\*/g, '([^\\/]+)');
  return new RegExp(newUrl);
};
