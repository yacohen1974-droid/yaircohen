const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'yaircohen-7823a-service',
  location: 'europe-west3'
};
exports.connectorConfig = connectorConfig;

const upsertPageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPage', inputVars);
}
upsertPageRef.operationName = 'UpsertPage';
exports.upsertPageRef = upsertPageRef;

exports.upsertPage = function upsertPage(dcOrVars, vars) {
  return executeMutation(upsertPageRef(dcOrVars, vars));
};

const deletePageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePage', inputVars);
}
deletePageRef.operationName = 'DeletePage';
exports.deletePageRef = deletePageRef;

exports.deletePage = function deletePage(dcOrVars, vars) {
  return executeMutation(deletePageRef(dcOrVars, vars));
};

const upsertBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertBlogPost', inputVars);
}
upsertBlogPostRef.operationName = 'UpsertBlogPost';
exports.upsertBlogPostRef = upsertBlogPostRef;

exports.upsertBlogPost = function upsertBlogPost(dcOrVars, vars) {
  return executeMutation(upsertBlogPostRef(dcOrVars, vars));
};

const deleteBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBlogPost', inputVars);
}
deleteBlogPostRef.operationName = 'DeleteBlogPost';
exports.deleteBlogPostRef = deleteBlogPostRef;

exports.deleteBlogPost = function deleteBlogPost(dcOrVars, vars) {
  return executeMutation(deleteBlogPostRef(dcOrVars, vars));
};

const getPageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPage', inputVars);
}
getPageRef.operationName = 'GetPage';
exports.getPageRef = getPageRef;

exports.getPage = function getPage(dcOrVars, vars) {
  return executeQuery(getPageRef(dcOrVars, vars));
};

const listBlogPostsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBlogPosts');
}
listBlogPostsRef.operationName = 'ListBlogPosts';
exports.listBlogPostsRef = listBlogPostsRef;

exports.listBlogPosts = function listBlogPosts(dc) {
  return executeQuery(listBlogPostsRef(dc));
};

const getBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogPost', inputVars);
}
getBlogPostRef.operationName = 'GetBlogPost';
exports.getBlogPostRef = getBlogPostRef;

exports.getBlogPost = function getBlogPost(dcOrVars, vars) {
  return executeQuery(getBlogPostRef(dcOrVars, vars));
};

const getBlogPostBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogPostBySlug', inputVars);
}
getBlogPostBySlugRef.operationName = 'GetBlogPostBySlug';
exports.getBlogPostBySlugRef = getBlogPostBySlugRef;

exports.getBlogPostBySlug = function getBlogPostBySlug(dcOrVars, vars) {
  return executeQuery(getBlogPostBySlugRef(dcOrVars, vars));
};

const listPagesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPages');
}
listPagesRef.operationName = 'ListPages';
exports.listPagesRef = listPagesRef;

exports.listPages = function listPages(dc) {
  return executeQuery(listPagesRef(dc));
};
