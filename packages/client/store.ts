/*
 * @description: 全局 store
 * @author: Feng Yinchao
 * @Date: 2022-10-12 17:32:45
 */
import create from 'zustand';
import type { ProxyRequestItem } from '@bproxy/bridge';

interface IGlobalState {
  list: ProxyRequestItem[];
  addItemIntoList: (item: ProxyRequestItem) => void;
  resetList: () => void;
  paused?: boolean;
  togglePause: () => void;
}

export const useStore = create<IGlobalState>(set => ({
  list: [],
  addItemIntoList: item =>
    set(state => {
      if (state.paused) {
        return state;
      }
      return { list: [item, ...state.list] };
    }),
  resetList: () => set(() => ({ list: [] })),
  togglePause: () =>
    set(state => ({
      paused: !state.paused,
    })),
}));
