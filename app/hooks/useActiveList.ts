import { create } from 'zustand';

interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (id: string[]) => void;
}

const useActiveList = create<ActiveListStore>(set => ({
  members: [],
  add: id => set(store => ({ members: [...store.members, id] })),
  remove: id => set(store => ({ members: store.members.filter(memberId => memberId !== id) })),
  set: ids => set({ members: ids }),
}));

export default useActiveList;
