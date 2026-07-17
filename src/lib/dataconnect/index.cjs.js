const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

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
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertPageRef(dcInstance, inputVars));
}
;

const deletePageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePage', inputVars);
}
deletePageRef.operationName = 'DeletePage';
exports.deletePageRef = deletePageRef;

exports.deletePage = function deletePage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deletePageRef(dcInstance, inputVars));
}
;

const upsertBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertBlogPost', inputVars);
}
upsertBlogPostRef.operationName = 'UpsertBlogPost';
exports.upsertBlogPostRef = upsertBlogPostRef;

exports.upsertBlogPost = function upsertBlogPost(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertBlogPostRef(dcInstance, inputVars));
}
;

const deleteBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBlogPost', inputVars);
}
deleteBlogPostRef.operationName = 'DeleteBlogPost';
exports.deleteBlogPostRef = deleteBlogPostRef;

exports.deleteBlogPost = function deleteBlogPost(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteBlogPostRef(dcInstance, inputVars));
}
;

const getPageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPage', inputVars);
}
getPageRef.operationName = 'GetPage';
exports.getPageRef = getPageRef;

exports.getPage = function getPage(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPageRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listBlogPostsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBlogPosts');
}
listBlogPostsRef.operationName = 'ListBlogPosts';
exports.listBlogPostsRef = listBlogPostsRef;

exports.listBlogPosts = function listBlogPosts(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listBlogPostsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogPost', inputVars);
}
getBlogPostRef.operationName = 'GetBlogPost';
exports.getBlogPostRef = getBlogPostRef;

exports.getBlogPost = function getBlogPost(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getBlogPostRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getBlogPostBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogPostBySlug', inputVars);
}
getBlogPostBySlugRef.operationName = 'GetBlogPostBySlug';
exports.getBlogPostBySlugRef = getBlogPostBySlugRef;

exports.getBlogPostBySlug = function getBlogPostBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getBlogPostBySlugRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
