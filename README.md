# ng-resource
>Resource (REST) service for Angular 2+.

Did you miss the ngResource service from angular1.x in angular2+? Then you have come to the right place. 

## Installation
`npm install --save @srlib/ng-resource`

## How To

1. Import ResourceModule into you app's root component.
```typescript
import { ResourceModule } from '@srlib/ng-resource';

@NgModule({
  bootstrap: [ App ],
  imports: [ ResourceModule ]
})
export class AppModule {}
```

2. Create a service and extend it from ResourceService
```typescript
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { ResourceService } from '@srlib/ng-resource';

@Injectable()
export class PostService extends ResourceService {
  constructor(protected http: Http) {
    this.url = 'http://api.example.com/posts/:id';
    super(http);
  }
}
```

3. Inject your service wherever you would like to take the benefits of ng-resource
```typescript
import { PostService } from './post.service';

export class PostComponent implements OnInit {
  constructor(private postService: PostService) {}
  post: any; // Best Practice: Create and use a Interface as type
  ngOnInit() {
    this.postService
        .get({ id: 123 })
        .subscribe(post => this.post = post);
  }
}
```

## Documentation

### Properties

#### `url: string`  
Sets the baseUrl for the service  
Example:
```typescript
this.url = 'http://api.example.com/posts/:id';
// or for nested Resource
this.url = 'http://api.example.com/posts/:id/comments/:commentId';
```
Here `:id` and `:commentId` is the name of your url parameters which will be used later (See Bellow).

#### `resourceConfig: ResourceConfigInterface`  
Configuration object for your resource service  
ResourceConfigInterface:  
```typescript
interface ResourceConfigInterface {
  requestOptions?: RequestOptions;
  auth?: boolean; // Default: false;
  tokenPropertyName?: string; // Default: 'accessToken';
  params?: any;
  urlSuffix?: string;
}
```
* `requestOptions`: Same as [RequestOptions](https://angular.io/api/http/RequestOptions) from '@angular/http'  
* `auth`: When set to `true` x-access-token header will be sent with every request
* `tokenPropertyName`: This property will be used to look for jwt token in your localStorage
* `params`: An object of key/value pair to be append as query string after the url
* `urlSuffix`: If you need to add a suffix to the url

### Resource Methods

#### `query(obj?: any, config?: ResourceConfigInterface): Observable<any>;`  
query method gets a list of data from your REST API using `GET` method.  
Example:
```typescript
// For baseUrl: `/posts/:id`;
this.postService.query().subscribe(post => this.post = post);
// Will get a list of posts
```
```typescript
// For baseUrl: `/posts/:id/comments/commentId`;
this.commentService.query({ id: 123 }).subscribe(cmnt => this.comments = cmnt);
// Will get a list of comments for the post with id 123
```

#### `get(obj: any, config?: ResourceConfigInterface): Observable<any>;`  
get method gets a single data from your REST API using `GET` method.  
Example:
```typescript
// For baseUrl: `/posts/:id`;
this.postService.get({ id: 123 }).subscribe(post => this.post = post);
// Will get the post with id 123
```
```typescript
// For baseUrl: `/posts/:id/comments/commentId`;
this.commentService.get({ id: 123, commentId: 4 }).subscribe(cmnt => this.comments = cmnt);
// Will get the comment with id 4 of the post with id 123
```

#### `save(data: any, obj?: any, config?: ResourceConfigInterface): Observable<any>;`  
save method sends data to your REST API using `POST` method.  
Example:
```typescript
// For baseUrl: `/posts/:id`;
let data = { title: 'New Phone', text: 'lorem imsum' };
this.postService.save(data).subscribe();
// Will create a new post with the data
```
```typescript
// For baseUrl: `/posts/:id/comments/commentId`;
let data = { name: 'John Doe', msg: 'lorem imsum' };
this.commentService.save(data, { id: 123 }).subscribe();
// Will create a new comment for the post with id 123
```


#### `update(data: any, obj: any, config?: ResourceConfigInterface): Observable<any>;`  
update method sends data to your REST API using `PUT` method.  
Example:
```typescript
// For baseUrl: `/posts/:id`;
let data = { title: 'New iPhone', text: 'dolor sit' };
this.postService.update(data, { id: 123 }).subscribe();
// Will update the post with id 123 with updated data
```
```typescript
// For baseUrl: `/posts/:id/comments/commentId`;
let data = { name: 'Jane Doe', msg: 'peep peep' };
this.commentService.save(data, { id: 123, commentId: 4 }).subscribe();
// Will update the comment with id 4 for the post with id 123 with updated data
```

#### `delete(obj: any, config?: ResourceConfigInterface): Observable<any>;`  
delete method deletes data usign your REST API using `DELETE` method.  
Example:
```typescript
// For baseUrl: `/posts/:id`;
this.postService.delete({ id: 123 }).subscribe();
// Will delete the post with id 123
```
```typescript
// For baseUrl: `/posts/:id/comments/commentId`;
this.commentService.delete({ id: 123, commentId: 4 }).subscribe();
// Will delete the comment with id 4 from the post with id 123
```

### Bonus Methods

#### `search(config?: ResourceConfigInterface): Observable<any>;`  
search method append `/search` to your baseUrl and get search result from your REST API using `GET` method.  
Example: For baseUrl: `/posts/:id`;
```typescript
const reqOpts: ResourceConfigInterface = {
  params: {
    category: 'electronics',
    keywords: ['phone', 'tablet', 'laptop']
  }
}
this.postService.search().subscribe(); 
```
Will send a `GET` request to `/posts/search?category=electronics&keywords=phone,tablet,laptop`

#### `count(config?: ResourceConfigInterface): Observable<any>;`  
count method append `/count` to your baseUrl and get data count from your REST API using `GET` method.  
Example: For baseUrl: `/posts/:id`;
```typescript
this.postService.count().subscribe(); 
```
Will send a `GET` request to `/posts/count`

## Global Config

You can set `ResourceConfig` globally using `BaseResourceConfig`. Just import and edit the `BaseResourceConfig` in your root component.
```typescript
import { BaseResourceConfig } from '@srlib/ng-resource';

BaseResourceConfig.auth = true;
BaseResourceConfig.tokenPropertyName = 'token';
```

## Development & Contribution

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io). This will help you to run and debug your code if you wish to contribute to the development of this library.

Enjoy 😃
