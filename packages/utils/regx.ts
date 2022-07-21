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
