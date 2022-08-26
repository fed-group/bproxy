/*
 * @description: 日志管理
 * @author: Feng Yinchao
 * @Date: 2022-08-26 17:47:04
 */
import createDebug from 'debug';

const DEBUG_NAMESPACES = '@bproxy/bridge,@bproxy/client,@bproxy/server';
createDebug.enable(DEBUG_NAMESPACES);

// eslint-disable-next-line import/prefer-default-export
export const debug = createDebug;
