//this class if for searching things

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  };//this.querystr is an object, in js all objects r passed through refrence

  search() {
    const keyword = this.queryStr.keyword
      ? {
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",//case insensitive
        },
      }
      : {};

    console.log(keyword);
    this.query = this.query.find({ ...keyword });

    return this;
  };

  filter() {
    let queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit", "sort"];

    removeFields.forEach((key) => delete queryCopy[key]);


    // Filter For Location, Name and department
    
    // Convert all string values to case-insensitive regex
    Object.keys(queryCopy).forEach((key) => {
      if (typeof queryCopy[key] === 'string') {
        queryCopy[key] = { $regex: queryCopy[key], $options: 'i' };
      }
    });

    let queryStr = JSON.stringify(queryCopy);
    console.log("queryStr=>",queryStr);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      console.log("Sort Query:", this.queryStr.sort);
  
      const sortFields = this.queryStr.sort.split(',');
  
      const sortObj = {};
      sortFields.forEach((field) => {
        const order = field.startsWith('-') ? -1 : 1;
        const fieldName = field.replace(/^-/, '');
        sortObj[fieldName] = order;
      });
  
      this.query = this.query.sort(sortObj).collation({ locale: 'en', strength: 2 }); // Adding collation for case-insensitive sorting
    } else {
      this.query = this.query.sort({ name: 1 }).collation({ locale: 'en', strength: 2 }); // Default sorting by name if no sort parameter is provided
    }
  
    return this;
  }
  //const qucopy = this.querystr->it will not assign value..bcz its a refrence to that obj so if we change the value of qucopy it will automatically update this.querystr

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
};

module.exports = ApiFeatures;  