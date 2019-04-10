import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { QuestionService } from '../question.service';

import { Question } from '../question';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  questions: Question[];
  currentQuestion: Question;
  choices: {};
  selectedChoice: null;
  score = 0;
  submit = false;
  turn = 1;
  end = false;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
    const id = +this.route.snapshot.paramMap.get('id');
    const nbQ = +this.route.snapshot.paramMap.get('q');

    this.questionService.getQuestions(id, nbQ)
      .subscribe(questions => {
        this.questions = questions;
        this.setQuestion();
      });
  }

  setQuestion(): void {
    if (this.questions) {
      this.currentQuestion = this.questions[this.turn - 1];
    }

    if (this.currentQuestion) {
      const choices = this.currentQuestion.answers;
      choices.sort(() => Math.random() - 0.5);

      this.choices = choices;
    }
  }

  onSelectedChoice(choice): void {
    if (this.submit) {
      return;
    }

    this.selectedChoice = choice;
  }

  onSubmitAnswer(choice): void {
    if (choice.correct) {
      this.score++;
    }

    this.submit = true;

  }

  nextQuestion(): void {
    if (this.currentQuestion === this.questions[this.questions.length - 1]) {
      this.endGame();
      return;
    }

    this.submit = false;

    this.turn++;

    this.selectedChoice = null;

    this.setQuestion();

  }

  endGame(): void {
    this.submit = false;

    this.currentQuestion = null;

    this.selectedChoice = null;

    this.end = true;
  }

}
