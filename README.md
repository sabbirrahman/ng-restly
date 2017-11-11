# ng-restly [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Resource%20(REST)%20service%20for%20Angular%202%20and%20beyond&url=https://github.com/sabbirrahman/ng-restly&via=sabbirrahmanme&hashtags=restapi,angular,ng)
>Resource (REST) service for Angular 2+.

Did you miss the ngResource service from angular1.x in angular2+? Then you have come to the right place. 

[![Build Status](https://travis-ci.org/sabbirrahman/ng-restly.svg?branch=master)](https://travis-ci.org/sabbirrahman/ng-restly)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/sabbirrahman/ng-restly/blob/master/LICENSE)
[![NPM version](https://badge.fury.io/js/ng-restly.svg)](https://www.npmjs.com/package/ng-restly)

## Installation
`npm install --save ng-restly`

## How To

1. Create a service and extend it from ResourceService
```typescript
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { ResourceService } from 'ng-restly';

@Injectable()
export class PostService extends ResourceService {
  constructor(protected http: Http) {
    this.url = 'http://api.example.com/posts/:id';
    super(http);
  }
}
```

2. Inject your service wherever you would like to take the benefits of ng-restly
```typescript
import { PostService } from './post.service';

export class PostComponent implements OnInit {
  constructor(private postService: PostService) {}
  post: any; // Best Practice: Create and use an Interface as type (ie: PostInterface)
  ngOnInit() {
    this.postService
        .get({ id: 123 })
        .subscribe(post => this.post = post);
  }
}
```

## Documentation

See full documentation [here](https://github.com/sabbirrahman/ng-restly/blob/master/DOCUMENTATION.md).

## Development & Contribution

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io). This will help you to run and debug your code if you wish to contribute to the development of this library.

Enjoy 😃
