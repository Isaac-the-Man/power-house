import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import utils from '../mixins/utils'
import firebaseConfig from '../secret'; // configuration for app

firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// store
Vue.use(Vuex);

// initialize
const vuexStore = new Vuex.Store({
    state: {
        database: {
            db: database,
            auth: false
        },
        data: {
            houses: null,
            students: null,
            awards: null,
            criteria: null,
            admins: null
        }
    },
    getters: {
        authStatus(state, getters) {
            if (getters.isDataLoaded && state.database.auth) {
                return state.data.admins[firebase.auth().currentUser.uid];
            } else {
                return {
                    name: 'Visitor',
                    perm: 'None'
                };
            }
        },
        populatedStudents(state, getters) {
            if (getters.isDataLoaded) {
                const populated = utils.methods.clone(state.data.students);
                for (let [key, student] of Object.entries(populated)) {
                    populated[key].house = state.data.houses[student.house];
                }
                return populated;
            } else {
                return {};
            }
        },
        scoredHouses(state, getters) {
            if (getters.isDataLoaded) {
                const scored = utils.methods.clone(state.data.houses);
                for (let key of Object.keys(scored)) {
                    scored[key].score = 0;
                }
                for (let award of getters.populatedAwardsArray) {
                    let houseKey;
                    if (award.subject.mode === 'Student') {
                        houseKey = award.subject.data.house;
                    } else {
                        houseKey = award.subject.data.key;
                    }
                    if (scored[houseKey]) {
                        if (award.addDeduct === 'add') {
                            scored[houseKey].score += award.criterion.points;
                        } else {
                            scored[houseKey].score -= award.criterion.points;
                        }
                    }
                }
                return scored;
            } else {
                return {};
            }
        },
        scoredHousesArray(state, getters) {
            if (getters.isDataLoaded) {
                return utils.methods.mergeKey(getters.scoredHouses);
            } else {
                return [];
            }
        },
        scoredStudents(state, getters) {
            if (getters.isDataLoaded) {
                const scored = utils.methods.clone(state.data.students);
                for (let key of Object.keys(scored)) {
                    scored[key].score = 0;
                }
                for (let award of getters.populatedAwardsArray) {
                    if (award.subject.mode === "Student" && scored[award.subject.data.key]) {
                        if (award.addDeduct === 'add') {
                            scored[award.subject.data.key].score += award.criterion.points;
                        } else {
                            scored[award.subject.data.key].score -= award.criterion.points;
                        }
                    }
                }
                return scored
            } else {
                return {};
            }
        },
        scoredStudentsArray(state, getters) {
            if (getters.isDataLoaded) {
                return utils.methods.mergeKey(getters.scoredStudents);
            } else {
                return [];
            }
        },
        populatedScoredStudentsArray(state, getters) {
            if (getters.isDataLoaded) {
                const scored = getters.populatedStudents;
                for (let key of Object.keys(scored)) {
                    scored[key].score = 0;
                }
                for (let award of getters.populatedAwardsArray) {
                    if (award.subject.mode === "Student" && scored[award.subject.data.key]) {
                        if (award.addDeduct === 'add') {
                            scored[award.subject.data.key].score += award.criterion.points;
                        } else {
                            scored[award.subject.data.key].score -= award.criterion.points;
                        }
                    }
                }
                return utils.methods.mergeKey(scored);
            } else {
                return [];
            }
        },
        populatedAwards(state, getters) {
            if (getters.isDataLoaded) {
                const populated = utils.methods.clone(state.data.awards);
                for (let [key, award] of Object.entries(populated)) {
                    populated[key].criterion = state.data.criteria[award.criterion];
                    if (award.subject.mode === 'House') {
                        populated[key].subject.data = {
                            key: award.subject.data,
                            ...state.data.houses[award.subject.data]
                        };
                        // TODO: fix house name not showing in recent awards
                    }
                }
                return populated;
            } else {
                return {};
            }
        },
        populatedAwardsArray(state, getters) {
            if (getters.isDataLoaded) {
                return utils.methods.mergeKey(getters.populatedAwards);
            } else {
                return [];
            }
        },
        isDataLoaded(state) {
            let flag = true;
            for (let item of Object.values(state.data)) {
                if (item === null || item === undefined) {
                    flag = false;
                }
            }
            return flag;
        },
        housesArray(state) {
            if (state.data.houses) {
                return utils.methods.mergeKey(state.data.houses);
            } else {
                return [];
            }
        },
        awardsArray(state) {
            if (state.data.awards) {
                return utils.methods.mergeKey(state.data.awards);
            } else {
                return [];
            }
        },
        studentsArray(state) {
            if (state.data.students) {
                return utils.methods.mergeKey(state.data.students);
            } else {
                return [];
            }
        },
        criteriaArray(state) {
            if (state.data.criteria) {
                return utils.methods.mergeKey(state.data.criteria);
            } else {
                return [];
            }
        }
    },
    mutations: {},
    actions: {}
});

// data hooks
database.ref('/houses').on('value', (data) => {
    if (data.val()) {
        vuexStore.state.data.houses = data.val();
    } else {
        vuexStore.state.data.houses = {};
    }
});
database.ref('/awards').on('value', (data) => {
    if (data.val()) {
        vuexStore.state.data.awards = data.val();
    } else {
        vuexStore.state.data.awards = {};
    }
});
database.ref('/students').on('value', (data) => {
    if (data.val()) {
        vuexStore.state.data.students = data.val();
    } else {
        vuexStore.state.data.students = {};
    }
});
database.ref('/criteria').on('value', (data) => {
    if (data.val()) {
        vuexStore.state.data.criteria = data.val();
    } else {
        vuexStore.state.data.criteria = {};
    }
});
database.ref('/admins').on('value', (data) => {
    if (data.val()) {
        vuexStore.state.data.admins = data.val();
    } else {
        vuexStore.state.data.admins = {};
    }
});

// export
export default vuexStore