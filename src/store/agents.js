export default {
  namespaced: true,
  state: () => ({
    notes: [],
  }),

  getters: {
    notes: (state, getters, rootState) =>
      rootState.dailyNote.notes.filter((c) => c.category === 2), // посредник
  },

  mutations: {},

  actions: {},
};
