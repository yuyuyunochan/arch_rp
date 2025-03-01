const loadData = require('./loadData');
const calcStats = require('./calcStats');

async function calcStatsFromAPI() {
    let information = await loadData();
    let stats = calcStats(information);
    return stats;
}

module.exports = calcStatsFromAPI;