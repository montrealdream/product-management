module.exports = (query) => {
    const searchObject = {
        title: "",
        keyword: ""
    };

    if(query.keyword){
        searchObject.keyword = query.keyword;
        searchObject.title = new RegExp(query.keyword, "i");
    }

    return searchObject
}