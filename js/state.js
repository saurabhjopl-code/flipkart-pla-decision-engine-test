export const STATE = {

    // RAW DATA (original sheets)
    raw: {
        gmvDaily: [],
        ctrDaily: [],
        adsDaily: [],
        campaign: [],
        keyword: [],
        dateMaster: []
    },

    // FILTERED DATA (working copy)
    data: {
        gmvDaily: [],
        ctrDaily: [],
        adsDaily: [],
        campaign: [],
        keyword: []
    },

    // FILTER STATE
    filters: {
        account: null,
        month: null,
        startDate: null,
        endDate: null
    }
};
