class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }

    // search functionality
    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        this.query.find({ ...keyword })
        return this
    }

    // this filter function include categories, price
    filter() {
        const queryStrCopy = { ...this.queryStr }
        //console.log(queryStrCopy)            // { price: { lt: '500', gt: '1000' } }
        const removeFields = ['keyword', 'limit', 'page']

        // remove field from query
        removeFields.forEach(field => delete queryStrCopy[field])

        let queryStr = JSON.stringify(queryStrCopy)
        //console.log(queryStr)               // {"price":{"lt":"500","gt":"1000"}}

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)
        //console.log(queryStr)               // {"price":{"$lt":"500","$gt":"1000"}}

        this.query.find(JSON.parse(queryStr))
        //console.log(queryStr)

        return this
    }

    paginate(resPerPage) {
        // eg : currentPage = 3 ; resPerpage = 2
        const currentPage = Number(this.queryStr.page) || 1; // page = 3
        const skip = resPerPage * (currentPage - 1);         // skip = 2 * 2 =>  = 4
        this.query.limit(resPerPage).skip(skip);             // 
        return this;
    }
}

module.exports = ApiFeatures