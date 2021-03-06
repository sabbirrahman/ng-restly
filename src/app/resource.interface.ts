// Imports from @angular
import { HttpHeaders, HttpParams } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs/Observable';

export interface RequestOptions {
  headers?: HttpHeaders;
  // observe?: HttpObserve;
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'arraybuffer'|'blob'|'json'|'text';
  withCredentials?: boolean;
  method?: 'Get'|'Post'|'Put'|'Delete'|'Options'|'Head'|'Patch';
  body?: any;
}

export interface ResourceConfigInterface {
  requestOptions?: RequestOptions;
  auth?: boolean;
  tokenPropertyName?: string;
  params?: any;
  urlSuffix?: string;
}

export interface ResourceServiceInterface {
  query(obj: any, config: ResourceConfigInterface): Observable<any>;
  get(obj: any, config: ResourceConfigInterface): Observable<any>;
  save(data: any, obj: any, config: ResourceConfigInterface): Observable<any>;
  update(data: any, obj: any, config: ResourceConfigInterface): Observable<any>;
  delete(obj: any, config: ResourceConfigInterface): Observable<any>;
  search(config: ResourceConfigInterface): Observable<any>;
  count(config: ResourceConfigInterface): Observable<any>;
}
