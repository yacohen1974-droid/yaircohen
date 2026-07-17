# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPage*](#getpage)
  - [*ListBlogPosts*](#listblogposts)
  - [*GetBlogPost*](#getblogpost)
  - [*GetBlogPostBySlug*](#getblogpostbyslug)
- [**Mutations**](#mutations)
  - [*UpsertPage*](#upsertpage)
  - [*DeletePage*](#deletepage)
  - [*UpsertBlogPost*](#upsertblogpost)
  - [*DeleteBlogPost*](#deleteblogpost)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@yaircohen/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@yaircohen/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@yaircohen/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPage
You can execute the `GetPage` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPage(vars: GetPageVariables, options?: ExecuteQueryOptions): QueryPromise<GetPageData, GetPageVariables>;

interface GetPageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPageVariables): QueryRef<GetPageData, GetPageVariables>;
}
export const getPageRef: GetPageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPage(dc: DataConnect, vars: GetPageVariables, options?: ExecuteQueryOptions): QueryPromise<GetPageData, GetPageVariables>;

interface GetPageRef {
  ...
  (dc: DataConnect, vars: GetPageVariables): QueryRef<GetPageData, GetPageVariables>;
}
export const getPageRef: GetPageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPageRef:
```typescript
const name = getPageRef.operationName;
console.log(name);
```

### Variables
The `GetPage` query requires an argument of type `GetPageVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPageVariables {
  pageId: string;
}
```
### Return Type
Recall that executing the `GetPage` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPageData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPageData {
  page?: {
    pageId: string;
    content: unknown;
  } & Page_Key;
}
```
### Using `GetPage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPage, GetPageVariables } from '@yaircohen/dataconnect';

// The `GetPage` query requires an argument of type `GetPageVariables`:
const getPageVars: GetPageVariables = {
  pageId: ..., 
};

// Call the `getPage()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPage(getPageVars);
// Variables can be defined inline as well.
const { data } = await getPage({ pageId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPage(dataConnect, getPageVars);

console.log(data.page);

// Or, you can use the `Promise` API.
getPage(getPageVars).then((response) => {
  const data = response.data;
  console.log(data.page);
});
```

### Using `GetPage`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPageRef, GetPageVariables } from '@yaircohen/dataconnect';

// The `GetPage` query requires an argument of type `GetPageVariables`:
const getPageVars: GetPageVariables = {
  pageId: ..., 
};

// Call the `getPageRef()` function to get a reference to the query.
const ref = getPageRef(getPageVars);
// Variables can be defined inline as well.
const ref = getPageRef({ pageId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPageRef(dataConnect, getPageVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.page);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.page);
});
```

## ListBlogPosts
You can execute the `ListBlogPosts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listBlogPosts(options?: ExecuteQueryOptions): QueryPromise<ListBlogPostsData, undefined>;

interface ListBlogPostsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBlogPostsData, undefined>;
}
export const listBlogPostsRef: ListBlogPostsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBlogPosts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBlogPostsData, undefined>;

interface ListBlogPostsRef {
  ...
  (dc: DataConnect): QueryRef<ListBlogPostsData, undefined>;
}
export const listBlogPostsRef: ListBlogPostsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBlogPostsRef:
```typescript
const name = listBlogPostsRef.operationName;
console.log(name);
```

### Variables
The `ListBlogPosts` query has no variables.
### Return Type
Recall that executing the `ListBlogPosts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBlogPostsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListBlogPosts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBlogPosts } from '@yaircohen/dataconnect';


// Call the `listBlogPosts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBlogPosts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBlogPosts(dataConnect);

console.log(data.blogPosts);

// Or, you can use the `Promise` API.
listBlogPosts().then((response) => {
  const data = response.data;
  console.log(data.blogPosts);
});
```

### Using `ListBlogPosts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBlogPostsRef } from '@yaircohen/dataconnect';


// Call the `listBlogPostsRef()` function to get a reference to the query.
const ref = listBlogPostsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBlogPostsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.blogPosts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.blogPosts);
});
```

## GetBlogPost
You can execute the `GetBlogPost` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBlogPost(vars: GetBlogPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetBlogPostData, GetBlogPostVariables>;

interface GetBlogPostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBlogPostVariables): QueryRef<GetBlogPostData, GetBlogPostVariables>;
}
export const getBlogPostRef: GetBlogPostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBlogPost(dc: DataConnect, vars: GetBlogPostVariables, options?: ExecuteQueryOptions): QueryPromise<GetBlogPostData, GetBlogPostVariables>;

interface GetBlogPostRef {
  ...
  (dc: DataConnect, vars: GetBlogPostVariables): QueryRef<GetBlogPostData, GetBlogPostVariables>;
}
export const getBlogPostRef: GetBlogPostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBlogPostRef:
```typescript
const name = getBlogPostRef.operationName;
console.log(name);
```

### Variables
The `GetBlogPost` query requires an argument of type `GetBlogPostVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBlogPostVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetBlogPost` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBlogPostData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBlogPost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBlogPost, GetBlogPostVariables } from '@yaircohen/dataconnect';

// The `GetBlogPost` query requires an argument of type `GetBlogPostVariables`:
const getBlogPostVars: GetBlogPostVariables = {
  id: ..., 
};

// Call the `getBlogPost()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBlogPost(getBlogPostVars);
// Variables can be defined inline as well.
const { data } = await getBlogPost({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBlogPost(dataConnect, getBlogPostVars);

console.log(data.blogPost);

// Or, you can use the `Promise` API.
getBlogPost(getBlogPostVars).then((response) => {
  const data = response.data;
  console.log(data.blogPost);
});
```

### Using `GetBlogPost`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBlogPostRef, GetBlogPostVariables } from '@yaircohen/dataconnect';

// The `GetBlogPost` query requires an argument of type `GetBlogPostVariables`:
const getBlogPostVars: GetBlogPostVariables = {
  id: ..., 
};

// Call the `getBlogPostRef()` function to get a reference to the query.
const ref = getBlogPostRef(getBlogPostVars);
// Variables can be defined inline as well.
const ref = getBlogPostRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBlogPostRef(dataConnect, getBlogPostVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.blogPost);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.blogPost);
});
```

## GetBlogPostBySlug
You can execute the `GetBlogPostBySlug` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBlogPostBySlug(vars: GetBlogPostBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetBlogPostBySlugData, GetBlogPostBySlugVariables>;

interface GetBlogPostBySlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBlogPostBySlugVariables): QueryRef<GetBlogPostBySlugData, GetBlogPostBySlugVariables>;
}
export const getBlogPostBySlugRef: GetBlogPostBySlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBlogPostBySlug(dc: DataConnect, vars: GetBlogPostBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetBlogPostBySlugData, GetBlogPostBySlugVariables>;

interface GetBlogPostBySlugRef {
  ...
  (dc: DataConnect, vars: GetBlogPostBySlugVariables): QueryRef<GetBlogPostBySlugData, GetBlogPostBySlugVariables>;
}
export const getBlogPostBySlugRef: GetBlogPostBySlugRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBlogPostBySlugRef:
```typescript
const name = getBlogPostBySlugRef.operationName;
console.log(name);
```

### Variables
The `GetBlogPostBySlug` query requires an argument of type `GetBlogPostBySlugVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBlogPostBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that executing the `GetBlogPostBySlug` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBlogPostBySlugData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBlogPostBySlug`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBlogPostBySlug, GetBlogPostBySlugVariables } from '@yaircohen/dataconnect';

// The `GetBlogPostBySlug` query requires an argument of type `GetBlogPostBySlugVariables`:
const getBlogPostBySlugVars: GetBlogPostBySlugVariables = {
  slug: ..., 
};

// Call the `getBlogPostBySlug()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBlogPostBySlug(getBlogPostBySlugVars);
// Variables can be defined inline as well.
const { data } = await getBlogPostBySlug({ slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBlogPostBySlug(dataConnect, getBlogPostBySlugVars);

console.log(data.blogPosts);

// Or, you can use the `Promise` API.
getBlogPostBySlug(getBlogPostBySlugVars).then((response) => {
  const data = response.data;
  console.log(data.blogPosts);
});
```

### Using `GetBlogPostBySlug`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBlogPostBySlugRef, GetBlogPostBySlugVariables } from '@yaircohen/dataconnect';

// The `GetBlogPostBySlug` query requires an argument of type `GetBlogPostBySlugVariables`:
const getBlogPostBySlugVars: GetBlogPostBySlugVariables = {
  slug: ..., 
};

// Call the `getBlogPostBySlugRef()` function to get a reference to the query.
const ref = getBlogPostBySlugRef(getBlogPostBySlugVars);
// Variables can be defined inline as well.
const ref = getBlogPostBySlugRef({ slug: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBlogPostBySlugRef(dataConnect, getBlogPostBySlugVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.blogPosts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.blogPosts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertPage
You can execute the `UpsertPage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertPage(vars: UpsertPageVariables): MutationPromise<UpsertPageData, UpsertPageVariables>;

interface UpsertPageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPageVariables): MutationRef<UpsertPageData, UpsertPageVariables>;
}
export const upsertPageRef: UpsertPageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertPage(dc: DataConnect, vars: UpsertPageVariables): MutationPromise<UpsertPageData, UpsertPageVariables>;

interface UpsertPageRef {
  ...
  (dc: DataConnect, vars: UpsertPageVariables): MutationRef<UpsertPageData, UpsertPageVariables>;
}
export const upsertPageRef: UpsertPageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertPageRef:
```typescript
const name = upsertPageRef.operationName;
console.log(name);
```

### Variables
The `UpsertPage` mutation requires an argument of type `UpsertPageVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertPageVariables {
  pageId: string;
  content: unknown;
}
```
### Return Type
Recall that executing the `UpsertPage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertPageData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertPageData {
  page_upsert: Page_Key;
}
```
### Using `UpsertPage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertPage, UpsertPageVariables } from '@yaircohen/dataconnect';

// The `UpsertPage` mutation requires an argument of type `UpsertPageVariables`:
const upsertPageVars: UpsertPageVariables = {
  pageId: ..., 
  content: ..., 
};

// Call the `upsertPage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPage(upsertPageVars);
// Variables can be defined inline as well.
const { data } = await upsertPage({ pageId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertPage(dataConnect, upsertPageVars);

console.log(data.page_upsert);

// Or, you can use the `Promise` API.
upsertPage(upsertPageVars).then((response) => {
  const data = response.data;
  console.log(data.page_upsert);
});
```

### Using `UpsertPage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertPageRef, UpsertPageVariables } from '@yaircohen/dataconnect';

// The `UpsertPage` mutation requires an argument of type `UpsertPageVariables`:
const upsertPageVars: UpsertPageVariables = {
  pageId: ..., 
  content: ..., 
};

// Call the `upsertPageRef()` function to get a reference to the mutation.
const ref = upsertPageRef(upsertPageVars);
// Variables can be defined inline as well.
const ref = upsertPageRef({ pageId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertPageRef(dataConnect, upsertPageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.page_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.page_upsert);
});
```

## DeletePage
You can execute the `DeletePage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deletePage(vars: DeletePageVariables): MutationPromise<DeletePageData, DeletePageVariables>;

interface DeletePageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePageVariables): MutationRef<DeletePageData, DeletePageVariables>;
}
export const deletePageRef: DeletePageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePage(dc: DataConnect, vars: DeletePageVariables): MutationPromise<DeletePageData, DeletePageVariables>;

interface DeletePageRef {
  ...
  (dc: DataConnect, vars: DeletePageVariables): MutationRef<DeletePageData, DeletePageVariables>;
}
export const deletePageRef: DeletePageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePageRef:
```typescript
const name = deletePageRef.operationName;
console.log(name);
```

### Variables
The `DeletePage` mutation requires an argument of type `DeletePageVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePageVariables {
  pageId: string;
}
```
### Return Type
Recall that executing the `DeletePage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePageData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePageData {
  page_delete?: Page_Key | null;
}
```
### Using `DeletePage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePage, DeletePageVariables } from '@yaircohen/dataconnect';

// The `DeletePage` mutation requires an argument of type `DeletePageVariables`:
const deletePageVars: DeletePageVariables = {
  pageId: ..., 
};

// Call the `deletePage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePage(deletePageVars);
// Variables can be defined inline as well.
const { data } = await deletePage({ pageId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePage(dataConnect, deletePageVars);

console.log(data.page_delete);

// Or, you can use the `Promise` API.
deletePage(deletePageVars).then((response) => {
  const data = response.data;
  console.log(data.page_delete);
});
```

### Using `DeletePage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePageRef, DeletePageVariables } from '@yaircohen/dataconnect';

// The `DeletePage` mutation requires an argument of type `DeletePageVariables`:
const deletePageVars: DeletePageVariables = {
  pageId: ..., 
};

// Call the `deletePageRef()` function to get a reference to the mutation.
const ref = deletePageRef(deletePageVars);
// Variables can be defined inline as well.
const ref = deletePageRef({ pageId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePageRef(dataConnect, deletePageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.page_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.page_delete);
});
```

## UpsertBlogPost
You can execute the `UpsertBlogPost` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertBlogPost(vars: UpsertBlogPostVariables): MutationPromise<UpsertBlogPostData, UpsertBlogPostVariables>;

interface UpsertBlogPostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertBlogPostVariables): MutationRef<UpsertBlogPostData, UpsertBlogPostVariables>;
}
export const upsertBlogPostRef: UpsertBlogPostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertBlogPost(dc: DataConnect, vars: UpsertBlogPostVariables): MutationPromise<UpsertBlogPostData, UpsertBlogPostVariables>;

interface UpsertBlogPostRef {
  ...
  (dc: DataConnect, vars: UpsertBlogPostVariables): MutationRef<UpsertBlogPostData, UpsertBlogPostVariables>;
}
export const upsertBlogPostRef: UpsertBlogPostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertBlogPostRef:
```typescript
const name = upsertBlogPostRef.operationName;
console.log(name);
```

### Variables
The `UpsertBlogPost` mutation requires an argument of type `UpsertBlogPostVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertBlogPost` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertBlogPostData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertBlogPostData {
  blogPost_upsert: BlogPost_Key;
}
```
### Using `UpsertBlogPost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertBlogPost, UpsertBlogPostVariables } from '@yaircohen/dataconnect';

// The `UpsertBlogPost` mutation requires an argument of type `UpsertBlogPostVariables`:
const upsertBlogPostVars: UpsertBlogPostVariables = {
  id: ..., 
  title: ..., 
  content: ..., 
  slug: ..., 
  category: ..., // optional
  tags: ..., // optional
  published: ..., 
  excerpt: ..., // optional
  heroImageUrlDesktop: ..., // optional
  heroImageUrlMobile: ..., // optional
  author: ..., // optional
  seoTitle: ..., // optional
  seoDescription: ..., // optional
};

// Call the `upsertBlogPost()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertBlogPost(upsertBlogPostVars);
// Variables can be defined inline as well.
const { data } = await upsertBlogPost({ id: ..., title: ..., content: ..., slug: ..., category: ..., tags: ..., published: ..., excerpt: ..., heroImageUrlDesktop: ..., heroImageUrlMobile: ..., author: ..., seoTitle: ..., seoDescription: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertBlogPost(dataConnect, upsertBlogPostVars);

console.log(data.blogPost_upsert);

// Or, you can use the `Promise` API.
upsertBlogPost(upsertBlogPostVars).then((response) => {
  const data = response.data;
  console.log(data.blogPost_upsert);
});
```

### Using `UpsertBlogPost`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertBlogPostRef, UpsertBlogPostVariables } from '@yaircohen/dataconnect';

// The `UpsertBlogPost` mutation requires an argument of type `UpsertBlogPostVariables`:
const upsertBlogPostVars: UpsertBlogPostVariables = {
  id: ..., 
  title: ..., 
  content: ..., 
  slug: ..., 
  category: ..., // optional
  tags: ..., // optional
  published: ..., 
  excerpt: ..., // optional
  heroImageUrlDesktop: ..., // optional
  heroImageUrlMobile: ..., // optional
  author: ..., // optional
  seoTitle: ..., // optional
  seoDescription: ..., // optional
};

// Call the `upsertBlogPostRef()` function to get a reference to the mutation.
const ref = upsertBlogPostRef(upsertBlogPostVars);
// Variables can be defined inline as well.
const ref = upsertBlogPostRef({ id: ..., title: ..., content: ..., slug: ..., category: ..., tags: ..., published: ..., excerpt: ..., heroImageUrlDesktop: ..., heroImageUrlMobile: ..., author: ..., seoTitle: ..., seoDescription: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertBlogPostRef(dataConnect, upsertBlogPostVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.blogPost_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.blogPost_upsert);
});
```

## DeleteBlogPost
You can execute the `DeleteBlogPost` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteBlogPost(vars: DeleteBlogPostVariables): MutationPromise<DeleteBlogPostData, DeleteBlogPostVariables>;

interface DeleteBlogPostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBlogPostVariables): MutationRef<DeleteBlogPostData, DeleteBlogPostVariables>;
}
export const deleteBlogPostRef: DeleteBlogPostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBlogPost(dc: DataConnect, vars: DeleteBlogPostVariables): MutationPromise<DeleteBlogPostData, DeleteBlogPostVariables>;

interface DeleteBlogPostRef {
  ...
  (dc: DataConnect, vars: DeleteBlogPostVariables): MutationRef<DeleteBlogPostData, DeleteBlogPostVariables>;
}
export const deleteBlogPostRef: DeleteBlogPostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBlogPostRef:
```typescript
const name = deleteBlogPostRef.operationName;
console.log(name);
```

### Variables
The `DeleteBlogPost` mutation requires an argument of type `DeleteBlogPostVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBlogPostVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteBlogPost` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBlogPostData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBlogPostData {
  blogPost_delete?: BlogPost_Key | null;
}
```
### Using `DeleteBlogPost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBlogPost, DeleteBlogPostVariables } from '@yaircohen/dataconnect';

// The `DeleteBlogPost` mutation requires an argument of type `DeleteBlogPostVariables`:
const deleteBlogPostVars: DeleteBlogPostVariables = {
  id: ..., 
};

// Call the `deleteBlogPost()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBlogPost(deleteBlogPostVars);
// Variables can be defined inline as well.
const { data } = await deleteBlogPost({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBlogPost(dataConnect, deleteBlogPostVars);

console.log(data.blogPost_delete);

// Or, you can use the `Promise` API.
deleteBlogPost(deleteBlogPostVars).then((response) => {
  const data = response.data;
  console.log(data.blogPost_delete);
});
```

### Using `DeleteBlogPost`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBlogPostRef, DeleteBlogPostVariables } from '@yaircohen/dataconnect';

// The `DeleteBlogPost` mutation requires an argument of type `DeleteBlogPostVariables`:
const deleteBlogPostVars: DeleteBlogPostVariables = {
  id: ..., 
};

// Call the `deleteBlogPostRef()` function to get a reference to the mutation.
const ref = deleteBlogPostRef(deleteBlogPostVars);
// Variables can be defined inline as well.
const ref = deleteBlogPostRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBlogPostRef(dataConnect, deleteBlogPostVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.blogPost_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.blogPost_delete);
});
```

