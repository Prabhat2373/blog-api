class ApiFeatures<T> {
  query: any;
  queryStr: any;

  constructor(query: any, queryStr: any) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit", "sort"];

    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    switch (this.queryStr.sort) {
      case "priceAsc":
        this.query = this.query.sort("price");
        break;
      case "priceDsc":
        this.query = this.query.sort("-price");
        break;
      case "ratingAsc":
        this.query = this.query.sort("rating");
        break;
      case "ratingDsc":
        this.query = this.query.sort("-rating");
        break;
    }

    return this;
  }

  pagination(resultPerPage: number) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

export default ApiFeatures;
