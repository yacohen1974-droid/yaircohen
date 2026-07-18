# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertPage, deletePage, upsertBlogPost, deleteBlogPost, getPage, listBlogPosts, getBlogPost, getBlogPostBySlug, listPages } from '@yaircohen/dataconnect';


// Operation UpsertPage:  For variables, look at type UpsertPageVars in ../index.d.ts
const { data } = await UpsertPage(dataConnect, upsertPageVars);

// Operation DeletePage:  For variables, look at type DeletePageVars in ../index.d.ts
const { data } = await DeletePage(dataConnect, deletePageVars);

// Operation UpsertBlogPost:  For variables, look at type UpsertBlogPostVars in ../index.d.ts
const { data } = await UpsertBlogPost(dataConnect, upsertBlogPostVars);

// Operation DeleteBlogPost:  For variables, look at type DeleteBlogPostVars in ../index.d.ts
const { data } = await DeleteBlogPost(dataConnect, deleteBlogPostVars);

// Operation GetPage:  For variables, look at type GetPageVars in ../index.d.ts
const { data } = await GetPage(dataConnect, getPageVars);

// Operation ListBlogPosts: 
const { data } = await ListBlogPosts(dataConnect);

// Operation GetBlogPost:  For variables, look at type GetBlogPostVars in ../index.d.ts
const { data } = await GetBlogPost(dataConnect, getBlogPostVars);

// Operation GetBlogPostBySlug:  For variables, look at type GetBlogPostBySlugVars in ../index.d.ts
const { data } = await GetBlogPostBySlug(dataConnect, getBlogPostBySlugVars);

// Operation ListPages: 
const { data } = await ListPages(dataConnect);


```