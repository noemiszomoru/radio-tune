import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cover } from './entities/cover';


@Injectable()
export class CoverService {

  private restPath = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getCovers(): Observable<Cover[]> {
    const url = `${this.restPath}/covers`;
    return this.http.get<Cover[]>(url);
  }

  getCoverById(id: number): Observable<Cover> {
    const url = `${this.restPath}/cover/${id}`;
    return this.http.get<Cover[]>(url);
  }

  postFile(fileToUpload: File): Observable<boolean | {}> {
    const endpoint = `${this.restPath}/cover`;
    const formData: FormData = new FormData();
    const yourHeadersConfig = {};
    formData.append('fileUpload', fileToUpload, fileToUpload.name);
    return this.http
      .post(endpoint, formData, { headers: yourHeadersConfig })
      .map(() => true)
      .catch((e) => this.handleError(e));
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
  }

}
