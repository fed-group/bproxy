/*
 * @description: 单例管理
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
type F<T> = new () => T;

function inject<T>(Service: F<T>): T {
  const { name } = Service;

  if (!inject[name]) {
    inject[name] = new Service();
  }

  return inject[name];
}

export default inject;
