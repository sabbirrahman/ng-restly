// Imports from @angular
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
// RxJS
import { Observable } from 'rxjs/Observable';
// Interfaces
import { ResourceServiceInterface, ResourceConfigInterface } from './resource.interface';

export const BaseResourceConfig: ResourceConfigInterface = {
  requestOptions: {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'accept': 'application/json',
    })
  },
  auth: false,
  tokenPropertyName: 'accessToken'
};

@Injectable()
export class ResourceService implements ResourceServiceInterface {
  resourceConfig = BaseResourceConfig;
  private baseUrl: string;

  constructor(
    protected http: HttpClient
  ) {
    if (BaseResourceConfig.auth) {
      this.authenticate();
    }
  }

  set url(url: string) { this.baseUrl = url; }
  get url() { return this.baseUrl; }

  authenticate(): void {
    const token = localStorage.getItem(this.resourceConfig.tokenPropertyName);
    if (this.resourceConfig.auth && token) {
      this.resourceConfig.requestOptions.headers = this.resourceConfig.requestOptions.headers.set('x-access-token', token);
    }
  }

  query(ids: any = {}, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('Get', ids, config);
  }

  get(ids: any, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('Get', ids, config);
  }

  save(data: any, ids: any = {}, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('Post', ids, config, data);
  }

  update(data: any, ids: any, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('Put', ids, config, data);
  }

  delete(ids: any, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('Delete', ids, config);
  }

  search(config: ResourceConfigInterface = {}): Observable<any> {
    config.urlSuffix = '/search';
    return this.request('Get', {}, config);
  }

  count(config: ResourceConfigInterface = {}): Observable<any> {
    config.urlSuffix = '/count';
    return this.request('Get', {}, config);
  }

  private request(
    method: 'Get'|'Post'|'Put'|'Delete'|'Options'|'Head'|'Patch',
    ids: any,
    config: ResourceConfigInterface = {},
    data?: any
  ): Observable<any> {
    const reqOpts = Object.assign({}, this.resourceConfig.requestOptions, config.requestOptions);
    reqOpts.method = method;
    reqOpts.params = config['params'] || null;
    reqOpts.body = JSON.stringify(data) || null;

    const url = this.makeUrl(ids) + (config['urlSuffix'] || '');
    return this.http.request(reqOpts.method, url, reqOpts);
  }

  private makeUrl(obj) {
    let url = this.baseUrl;
    const params = url.match(/:\w+/g);
    if (!params) { return url; }

    params.forEach(param => {
      const key = param.substring(1, param.length);
      url = obj.hasOwnProperty(key) ?
            url.replace(param, obj[key]) :
            url.replace('/' + param, '');
    });

    return url;
  }

}
