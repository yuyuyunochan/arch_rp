function calcStats(catsInfo) {
    let catsStats = {};
    catsInfo.forEach(cat => {
        if(!catsStats[cat.country])
            catsStats[cat.country] = 0;
    catsStats[cat.country]++;
    });
    return catsStats;
}
module.exports = calcStats;