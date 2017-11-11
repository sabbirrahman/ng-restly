// Imports from @angular
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
// RxJS
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// Interfaces
import { ResourceServiceInterface, ResourceConfigInterface } from './resource.interface';

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
export class ResourceService implements ResourceServiceInterface {
  resourceConfig = BaseResourceConfig;
  private baseUrl: string;

  constructor(
    protected http: Http
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
      this.resourceConfig.requestOptions.headers.set('x-access-token', token);
    }
  }

  query(ids: any = {}, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('GET', ids, config).map((res: Response) => res.json());
  }

  get(ids: any, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('GET', ids, config).map((res: Response) => res.json());
  }

  save(data: any, ids: any = {}, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('POST', ids, config, data);
  }

  update(data: any, ids: any, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('PUT', ids, config, data);
  }

  delete(ids: any, config: ResourceConfigInterface = {}): Observable<any> {
    return this.request('DELETE', ids, config);
  }

  search(config: ResourceConfigInterface = {}): Observable<any> {
    config.urlSuffix = '/search';
    return this.request('GET', {}, config).map((res: Response) => res.json());
  }

  count(config: ResourceConfigInterface = {}): Observable<any> {
    config.urlSuffix = '/count';
    return this.request('GET', {}, config).map((res: Response) => res.json());
  }

  private request(method: string, ids: any = {}, config: ResourceConfigInterface = {}, data?: any): Observable<any> {
    const reqOpts = config.requestOptions || this.resourceConfig.requestOptions;
    reqOpts.method = method || 'GET';
    reqOpts.params = config['params'] || null;
    reqOpts.body = JSON.stringify(data) || null;

    const url = this.makeUrl(ids) + (config['urlSuffix'] || '');
    return this.http.request(url, reqOpts);
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
