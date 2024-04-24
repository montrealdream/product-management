module.exports = (query, limit, numberOfRecords) => {
    const paginationObject = {
        current: 1,
        limit: limit,
        skip: 0
    };

    if(query.page){
        paginationObject.current = parseInt(query.page);
    }

    // skip document
    paginationObject.skip = (paginationObject.current - 1)*paginationObject.limit;
    
    // total document for create number of page
    paginationObject.total = Math.ceil(numberOfRecords / paginationObject.limit)

    return paginationObject;
}