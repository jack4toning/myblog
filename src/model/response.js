/* eslint-disable max-classes-per-file */
class BaseModel {
  constructor(data, message) {
    const dataType = typeof data;
    if (dataType === 'string') {
      this.message = data;
    } else if (dataType === 'object') {
      this.data = data;
    }

    if (message) this.message = message;
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errorNum = 0;
  }
}

class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errorNum = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel,
};
