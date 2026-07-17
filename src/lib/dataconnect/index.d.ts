import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface BlogPost_Key {
  id: string;
  __typename?: 'BlogPost_Key';
}

export interface DeleteBlogPostData {
  blogPost_delete?: BlogPost_Key | null;
}

export interface DeleteBlogPostVariables {
  id: string;
}

export interface DeletePageData {
  page_delete?: Page_Key | null;
}

export interface DeletePageVariables {
  pageId: string;
}

export interface GetBlogPostBySlugData {
  blogPosts: ({
    id: string;
    title: string;
    content: string;
    slug: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    category?: string | null;
    tags?: string[] | null;
    published: boolean;
    excerpt?: string | null;
    heroImageUrlDesktop?: string | null;
    heroImageUrlMobile?: string | null;
    author?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
  } & BlogPost_Key)[];
}

export interface GetBlogPostBySlugVariables {
  slug: string;
}

export interface GetBlogPostData {
  blogPost?: {
    id: string;
    title: string;
    content: string;
    slug: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    category?: string | null;
    tags?: string[] | null;
    published: boolean;
    excerpt?: string | null;
    heroImageUrlDesktop?: string | null;
    heroImageUrlMobile?: string | null;
    author?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
  } & BlogPost_Key;
}

export interface GetBlogPostVariables {
  id: string;
}

export interface GetPageData {
  page?: {
    pageId: string;
    content: unknown;
  } & Page_Key;
}

export interface GetPageVariables {
  pageId: string;
}

export interface ListBlogPostsData {
  blogPosts: ({
    id: string;
    title: string;
    content: string;
    slug: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    category?: string | null;
    tags?: string[] | null;
    published: boolean;
    excerpt?: string | null;
    heroImageUrlDesktop?: string | null;
    heroImageUrlMobile?: string | null;
    author?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
  } & BlogPost_Key)[];
}

export interface Page_Key {
  pageId: string;
  __typename?: 'Page_Key';
}

export interface UpsertBlogPostData {
  blogPost_upsert: BlogPost_Key;
}

export interface UpsertBlogPostVariables {
  id: string;
  title: string;
  content: string;
  slug: string;
  category?: string | null;
  tags?: string[] | null;
  published: boolean;
  excerpt?: string | null;
  heroImageUrlDesktop?: string | null;
  heroImageUrlMobile?: string | null;
  author?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface UpsertPageData {
  page_upsert: Page_Key;
}

export interface UpsertPageVariables {
  pageId: string;
  content: unknown;
}

interface UpsertPageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPageVariables): MutationRef<UpsertPageData, UpsertPageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPageVariables): MutationRef<UpsertPageData, UpsertPageVariables>;
  operationName: string;
}
export const upsertPageRef: UpsertPageRef;

export function upsertPage(vars: UpsertPageVariables): MutationPromise<UpsertPageData, UpsertPageVariables>;
export function upsertPage(dc: DataConnect, vars: UpsertPageVariables): MutationPromise<UpsertPageData, UpsertPageVariables>;

interface DeletePageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePageVariables): MutationRef<DeletePageData, DeletePageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePageVariables): MutationRef<DeletePageData, DeletePageVariables>;
  operationName: string;
}
export const deletePageRef: DeletePageRef;

export function deletePage(vars: DeletePageVariables): MutationPromise<DeletePageData, DeletePageVariables>;
export function deletePage(dc: DataConnect, vars: DeletePageVariables): MutationPromise<DeletePageData, DeletePageVariables>;

interface UpsertBlogPostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertBlogPostVariables): MutationRef<UpsertBlogPostData, UpsertBlogPostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertBlogPostVariables): MutationRef<UpsertBlogPostData, UpsertBlogPostVariables>;
  operationName: string;
}
export const upsertBlogPostRef: UpsertBlogPostRef;

export function upsertBlogPost(vars: UpsertBlogPostVariables): MutationPromise<UpsertBlogPostData, UpsertBlogPostVariables>;
export function upsertBlogPost(dc: DataConnect, vars: UpsertBlogPostVariables): MutationPromise<UpsertBlogPostData, UpsertBlogPostVariables>;

interface DeleteBlogPostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBlogPostVariables): MutationRef<DeleteBlogPostData, DeleteBlogPostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBlogPostVariables): MutationRef<DeleteBlogPostData, DeleteBlogPostVariables>;
  operationName: string;
}
export const deleteBlogPostRef: DeleteBlogPostRef;

export function deleteBlogPost(vars: DeleteBlogPostVariables): MutationPromise<DeleteBlogPostData, DeleteBlogPostVariables>;
export function deleteBlogPost(dc: DataConnect, vars: DeleteBlogPostVariables): MutationPromise<DeleteBlogPostData, DeleteBlogPostVariables>;

interface GetPageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPageVariables): QueryRef<GetPageData, GetPageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPageVariables): QueryRef<GetPageData, GetPageVariables>;
  operationName: string;
}
export const getPageRef: GetPageRef;

export function getPage(vars: GetPageVariables, options?: ExecuteQueryOptions): QueryPromise<GetPageData, GetPageVariables>;
export function getPage(dc: DataConnect, vars: GetPageVariables, options?: ExecuteQueryOptions): QueryPromise<GetPageData, GetPageVariables>;

interface ListBlogPostsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBlogPostsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListBlogPostsData, undefined>;
  operationName: string;
}
export const listBlogPostsRef: ListBlogPostsRef;

export function listBlogPosts(options?: ExecuteQueryOptions): QueryPromise<ListBlogPostsData, undefined>;
export function listBlogPosts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBlogPostsData, undefined>;

interface GetBlogPostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBlogPostVariables): QueryRef<GetBlogPostData, GetBlogPostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBlogPostVariables): QueryRef<GetBlogPostData, GetBlogPostVariables>;
  operationName: string;
}
export const getBlogPostRef: GetBlogPostRef;

export function getBlogPost(vars: GetBlogPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetBlogPostData, GetBlogPostVariables>;
export function getBlogPost(dc: DataConnect, vars: GetBlogPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetBlogPostData, GetBlogPostVariables>;

interface GetBlogPostBySlugRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBlogPostBySlugVariables): QueryRef<GetBlogPostBySlugData, GetBlogPostBySlugVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBlogPostBySlugVariables): QueryRef<GetBlogPostBySlugData, GetBlogPostBySlugVariables>;
  operationName: string;
}
export const getBlogPostBySlugRef: GetBlogPostBySlugRef;

export function getBlogPostBySlug(vars: GetBlogPostBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetBlogPostBySlugData, GetBlogPostBySlugVariables>;
export function getBlogPostBySlug(dc: DataConnect, vars: GetBlogPostBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetBlogPostBySlugData, GetBlogPostBySlugVariables>;

