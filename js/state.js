export const STATE = {

    // RAW DATA STORAGE (used by data-loader.js)
    raw: {
        gmvDaily: [],
        ctrDaily: [],
        adsDaily: [],
        campaign: [],
        keyword: [],
        dateMaster: []
    },

    // FILTERED DATA (used by filters.js & app.js)
    data: {
        gmvDaily: [],
        ctrDaily: [],
        adsDaily: [],
        campaign: [],
        keyword: [],
        dateMaster: []
    },

    // FILTERS
    filters: {
        account: null,
        month: null,
        startDate: null,
        endDate: null
    }
};
