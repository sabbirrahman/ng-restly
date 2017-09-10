// Imports from @angular
import { RequestOptions } from '@angular/http';
// RxJS
import { Observable } from 'rxjs/Observable';

export interface ResourceConfigInterface {
  requestOptions?: RequestOptions;
  auth?: boolean;
  tokenPropertyName?: string;
  params?: any;
  urlSuffix?: string;
}

export interface ResourceInterface {
  query(obj: any, config: ResourceConfigInterface): Observable<any>;
  get(obj: any, config: ResourceConfigInterface): Observable<any>;
  save();
  update();
  delete();
}
