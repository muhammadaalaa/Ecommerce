class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
  paginate() {
    let page = this.queryData.page * 1 || 1;
    let limit = 3;
    let skip = (page - 1) * limit;
    if (page > 0) page = 1;
    this.mongooseQuery.find().skip(skip).limit(limit);
    return this;
  }
  filter() {
    let filter = { ...this.queryData };
    let arr = ["page", "sort", "select", "search"];
    for (const item of arr) {
      delete filter[item];
    }
    filter = JSON.parse(
      JSON.stringify(filter).replace(/(gt|gte|lt|lte)/, (match) => `$${match}`)
    );
    this.mongooseQuery.find(filter);
    return this;
  }
  sort() {
    if (this.queryData.sort) {
      this.queryData.sort = this.queryData.sort.replace(",", " ");
      this.mongooseQuery.sort(this.queryData.sort);
      return this;
    }
  }
  select() {
    if (this.queryData.select) {
      this.queryData.select = this.queryData.select.replace(",", " ");
      this.mongooseQuery.select(this.queryData.select);
      return this;
    }
  }
  search() {
    if (this.queryData.search) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryData.search, $options: "i" } },
          { slug: { $regex: this.queryData.search, $options: "i" } },
        ],
      });
      return this;
    }
  }
}

export default ApiFeatures;
