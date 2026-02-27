export const STATE = {

    // RAW DATA STORAGE
    raw: {
        gmvDaily: [],
        ctrDaily: [],
        adsDaily: [],
        campaign: [],
        keyword: [],
        dateMaster: []
    },

    // FILTERED WORKING DATA
    data: {
        gmvDaily: [],
        ctrDaily: [],
        adsDaily: [],
        campaign: [],
        keyword: [],
        dateMaster: []
    },

    // FILTER STATE
    filters: {
        account: null,
        month: null,
        startDate: null,
        endDate: null
    }
};
