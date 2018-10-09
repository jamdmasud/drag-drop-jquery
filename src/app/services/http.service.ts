import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {ObjectDesign} from '../models/objectDesign';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
baseUrl = 'http://localhost:58456';
  constructor(private http: HttpClient) { }

  public getMessage(): string {
    return 'An error occured.';
  }

  public save(data: ObjectDesign): Observable<any> {
    return  this.http
    .post<ObjectDesign>(`${this.baseUrl}/api/objectDesign/save`, data) .pipe(
      map(json => json),
      catchError(this.handleError('getMessage', ''))
    );
  }

  public update(data: ObjectDesign): Observable<any> {
    return  this.http
      .post<ObjectDesign>(`${this.baseUrl}/api/objectDesign/update`, data) .pipe(
        map(json => json),
        catchError(this.handleError('getMessage', ''))
      );
  }
  public getObjectDesign(id: number): Observable<any> {
    return  this.http
      .get<ObjectDesign>(`${this.baseUrl}/api/objectDesign/details/` + id) .pipe(
        map(json => json),
        catchError(this.handleError('getMessage', ''))
      );
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
