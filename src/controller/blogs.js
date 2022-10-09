const { query } = require('../db/mysql');
const { makeKVPairs } = require('../utils');
const { blogErrMsg } = require('../config/error');

const {
  FETCH_BLOG_LIST_FAILED,
  FETCH_BLOG_FAILED,
  CREATE_BLOG_FAILED,
  UPDATE_BLOG_FAILED,
  DELETE_BLOG_FAILED,
} = blogErrMsg;

const getBlogList = (keyword, author) => {
  return new Promise((resolve) => {
    const sql = `select a.id, a.title, a.category, a.subCategory, a.content, b.username, b.avatarUrl, a.createtime, a.coverUrl from blogs a join users b on a.authorId = b.id where b.username like '%${author}%' and (a.title like '%${keyword}%' or a.content like '%${keyword}%') order by a.createtime desc;`;
    query(sql, (err, res) => {
      let error = err;
      let result = res;
      error = error ? FETCH_BLOG_LIST_FAILED : null;
      if (error === null && result.length === 0) result = undefined;
      resolve({ error, result });
    });
  });
};

// 此处应改正，当返回空数组时应视为错误，因为用一个确定的 blog id 就应该能从数据库找到那条 blog 数据才对，除非输入了错误的 blog id | Done
// Attention! when get empty result, it still need to be recognized an error on front side because that's may due to wrong id.
const getBlog = (id) => {
  return new Promise((resolve) => {
    const sql = `select a.id, a.title, a.category, a.subCategory, a.content, b.username, b.avatarUrl, a.createtime, a.coverUrl from blogs a join users b on a.authorId = b.id where a.id = ${id};`;
    query(sql, (err, result) => {
      let error = err;
      error = error || result.length === 0 ? FETCH_BLOG_FAILED : null;
      resolve({ error, result: error !== null ? undefined : result[0] });
    });
  });
};

const createBlog = ({ authorId, title, content }) => {
  return new Promise((resolve) => {
    const sql = `insert into blogs(title, content, createtime, authorId) values ('${title}', '${content}', UNIX_TIMESTAMP(NOW()), ${authorId});`;
    query(sql, async (err, result) => {
      let error = err;
      error = error ? CREATE_BLOG_FAILED : null;
      if (error !== null) resolve({ error, result });
      else resolve(await getBlog(result.insertId));
    });
  });
};

// 此处应改正，当返回结果是没有 match, 说明没有 change 数据成功，则应该视为错误 | Done
// Attention! when update 0 row due to "where" not match, mysql regard this situation as process compeletd with no error.
const updateBlog = ({ id, ...columns }) => {
  return new Promise((resolve) => {
    const sql = `update blogs set ${makeKVPairs(columns)} where id = ${id};`;
    query(sql, async (err, result) => {
      let error = err;
      error = error || result.affectedRows === 0 ? UPDATE_BLOG_FAILED : null;
      if (error !== null) resolve({ error, result: undefined });
      else resolve(await getBlog(id));
    });
  });
};

// 此处应改正，当返回结果是0行数据被影响，则应该视为错误，因为删除的目的并没有达到 | Done
const deleteBlog = (id) => {
  return new Promise((resolve) => {
    const sql = `delete from blogs where id = ${id};`;
    query(sql, async (err, result) => {
      let error = err;
      error = error || result.affectedRows === 0 ? DELETE_BLOG_FAILED : null;
      if (error !== null) resolve({ error, result: undefined });
      else resolve({ error, undefined });
    });
  });
};

module.exports = {
  getBlogList,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
