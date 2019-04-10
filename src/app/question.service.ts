import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Question } from './question';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionsUrl = 'https://opentdb.com/api.php?encode=url3986&amount=';
  private endUrl = '&category=';

  constructor(private http: HttpClient) {}

  private log(message: string) {
    console.log(message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  getQuestions(id, nbQ): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.questionsUrl}${nbQ}${this.endUrl}${id}`).pipe(
      map(res => res['results']),
      map(questions => {
        const questionsFormated = []
        questions.forEach(q => questionsFormated.push(this.formatQuestion(q)))
        return questionsFormated;
      }),
      tap(_ => this.log('fetched Questions')),
      catchError(this.handleError('getQuestions', []))
    );
  }

  formatQuestion(question: Question) {
    Object.keys(question).forEach(field => {
      const result = [];

      if (Array.isArray(question[field])) {
        for (let i = 0; i < question[field].length; i++) {
          result.push({ text: decodeURIComponent(question[field][i]), correct: false });
        }
        question['answers'] = result;
      }
      question[field] = decodeURIComponent(question[field]);
      });

    question['category'] = question['category'].replace(/^[^:]+: /, '');

    const choices = [];
    const incorrects = question['incorrect_answers'].split(',');

    for (let i = 0; i < incorrects.length; i++) {
      choices.push({
        text: decodeURIComponent(incorrects[i]),
        correct: false,
      });
    }

    choices.push({
      text: decodeURIComponent(question['correct_answer']),
      correct: true,
    });

    choices.sort(() => Math.random() - 0.5);

    question['answers'] = choices;

    return question;

  }
}
