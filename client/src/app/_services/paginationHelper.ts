import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { PaginatedResult } from "../_models/pagination";

export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
  const paginatedResult = new PaginatedResult<T>();
  return http.get<T>(url, { observe: 'response', params: params }).pipe(
    map(response => {
      if (response.body) {
        paginatedResult.result = response.body;
      }
      if (response.headers.get('pagination')) {
        paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
      }
      return paginatedResult;
    })
  );
}

export function setPaginationQueryStringParams(pageNumber, pageSize) {
  let params = new HttpParams();

  params = params.set('pageIndex', pageNumber);
  params = params.set('pageSize', pageSize);
  
  return params;
}