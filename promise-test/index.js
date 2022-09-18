const fs = require('fs');
const path = require('path');

const getFileContent = (fileName) => {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(__dirname, 'files', fileName);
    fs.readFile(filePath, (err, d) => {
      let data = d;
      data = JSON.parse(data.toString());
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const fileCollection = [];

const collectFileContent = async (fileName) => {
  try {
    const fileContent = await getFileContent(fileName);
    fileCollection.push(fileContent);
    const { next } = fileContent;
    if (next) collectFileContent(next);
    else console.log(fileCollection);
  } catch (error) {
    console.log(error);
  }
};

collectFileContent('a.json');

// console.log('read dir');
// fs.readdir(path.resolve(__dirname, 'files'), (err, data) => {
//   console.log(data);
// });

// const foo = async () => {
//   try {
//     let bar = await Promise.reject(123);
//   } catch (error) {
//     console.log(error);
//   }
// };

// foo();
