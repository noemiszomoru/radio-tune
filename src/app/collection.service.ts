import { Injectable } from '@angular/core';
import { Collection } from './entities/collection';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class CollectionService {

  private restPath = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getCollections(): Observable<Collection[]> {
    this.messageService.add('Collections loading ...');
    const url = `${this.restPath}/collections`;
    console.log(url);

    // return of(COLLECTIONS);
    return this.http.get<Collection[]>(url);
  }

  getCollection(id: number): Observable<Collection> {

    // const url = `${this.restPath}/collection/${id}`;

    // return this.http.get<Collection>(url).pipe(
    //   tap(_ => this.log(`fetched collection id=${id}`)),
    //   catchError(this.handleError<Collection>(`collection id=${id}`))
    // );
    return null;
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('CollectionService: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {

    console.log(operation + ': ' + JSON.stringify(result));

    return null;

    // return (error: any): Observable<T> => {

    //   // TODO: send the error to remote logging infrastructure
    //   console.error(error); // log to console instead

    //   // TODO: better job of transforming error for user consumption
    //   this.log(`${operation} failed: ${error.message}`);

    //   // Let the app keep running by returning an empty result.
    //   return of(result as T);
    // };


  }
}
