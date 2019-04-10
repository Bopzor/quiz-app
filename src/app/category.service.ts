import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Category } from './category';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesUrl = 'https://opentdb.com/api_category.php';
  private categoryNumberOfQuestionUrl = 'https://opentdb.com/api_count.php?category=';

  constructor(private http: HttpClient) {}

  private log(message: string) {
    console.log(message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl).pipe(
      map(res => res['trivia_categories']),
      map(res => res.map(c => (
        {
          name: c.name.replace(/^[^:]+: /, ''),
          id: c.id,
        }
      ))),
      tap(_ => this.log('fetched Categories')),
      catchError(this.handleError('getCategories', []))
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http
      .get<Category[]>(this.categoriesUrl)
      .pipe(
        map(res => res['trivia_categories']),
        map(res =>
          res.map(c => ({
            name: c.name.replace(/^[^:]+: /, ''),
            id: c.id
          }))
        ),
        map(res => res.filter(c => c.id === id)),
        map(res => res[0]),
        tap(_ => this.log('fetched Category')),
        catchError(this.handleError('getCategory', []))
      );
  }

  getNumberOfQuestions(id: number): Observable<number> {
    return this.http.get(this.categoryNumberOfQuestionUrl + id).pipe(
      map(res => res['category_question_count']['total_question_count']),
      tap(_ => this.log('fetched number of question')),
      catchError(this.handleError('getNumberOfQuestions', []))
    );
  }
}
