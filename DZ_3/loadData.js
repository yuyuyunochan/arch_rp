async function loadData() {
    let url = "https://catfact.ninja/breeds";
    let page = url;
    let data = [];
    while(page)
    {
        let promise = await fetch(page);
        let result = await promise.json();
        data = data.concat(result.data);
        page = result.next_page_url;
    }
    return data;
}
module.exports = loadData;
