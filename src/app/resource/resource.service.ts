// Imports from @angular
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
// RxJS
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// Interface
import { ResourceInterface } from './resource.interface';

export interface ResourceConfigInterface {
  requestOptions: RequestOptions;
  auth: boolean;
  tokenPropertyName: string;
}

export const BaseResourceConfig: ResourceConfigInterface = {
  requestOptions: new RequestOptions({
    headers: new Headers({
      'content-type': 'application/json',
      'accept': 'application/json',
    })
  }),
  auth: false,
  tokenPropertyName: 'accessToken'
};

@Injectable()
export class ResourceService implements ResourceInterface {
  resourceConfig = BaseResourceConfig;
  private baseUrl: string;

  constructor(
    protected http: Http
  ) { }

  set url(url: string) { this.baseUrl = url; }
  get url() { return this.baseUrl; }

  authenticate() {
    const token = localStorage.getItem(this.resourceConfig.tokenPropertyName);
    if (this.resourceConfig.auth && token) {
      this.resourceConfig.requestOptions.headers.append('x-access-token', token);
    }
  }

  query() {}

  get() {}

  save() {}

  update() {}

  delete() {}

}
