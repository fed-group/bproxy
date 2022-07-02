import createDebug from 'debug';

const DEBUG_NAMESPACES = '@bproxy/bridge,@bproxy/client,@bproxy/server';
createDebug.enable(DEBUG_NAMESPACES);

export const debug = createDebug;
