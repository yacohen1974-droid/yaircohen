import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'yaircohen-7823a-service',
  location: 'europe-west3'
};

export const upsertPageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPage', inputVars);
}
upsertPageRef.operationName = 'UpsertPage';

export function upsertPage(dcOrVars, vars) {
  return executeMutation(upsertPageRef(dcOrVars, vars));
}

export const deletePageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePage', inputVars);
}
deletePageRef.operationName = 'DeletePage';

export function deletePage(dcOrVars, vars) {
  return executeMutation(deletePageRef(dcOrVars, vars));
}

export const upsertBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertBlogPost', inputVars);
}
upsertBlogPostRef.operationName = 'UpsertBlogPost';

export function upsertBlogPost(dcOrVars, vars) {
  return executeMutation(upsertBlogPostRef(dcOrVars, vars));
}

export const deleteBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBlogPost', inputVars);
}
deleteBlogPostRef.operationName = 'DeleteBlogPost';

export function deleteBlogPost(dcOrVars, vars) {
  return executeMutation(deleteBlogPostRef(dcOrVars, vars));
}

export const getPageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPage', inputVars);
}
getPageRef.operationName = 'GetPage';

export function getPage(dcOrVars, vars) {
  return executeQuery(getPageRef(dcOrVars, vars));
}

export const listBlogPostsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBlogPosts');
}
listBlogPostsRef.operationName = 'ListBlogPosts';

export function listBlogPosts(dc) {
  return executeQuery(listBlogPostsRef(dc));
}

export const getBlogPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogPost', inputVars);
}
getBlogPostRef.operationName = 'GetBlogPost';

export function getBlogPost(dcOrVars, vars) {
  return executeQuery(getBlogPostRef(dcOrVars, vars));
}

export const getBlogPostBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogPostBySlug', inputVars);
}
getBlogPostBySlugRef.operationName = 'GetBlogPostBySlug';

export function getBlogPostBySlug(dcOrVars, vars) {
  return executeQuery(getBlogPostBySlugRef(dcOrVars, vars));
}

export const listPagesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPages');
}
listPagesRef.operationName = 'ListPages';

export function listPages(dc) {
  return executeQuery(listPagesRef(dc));
}

