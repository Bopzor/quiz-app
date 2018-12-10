import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CategoryService } from '../category.service';
import { Category } from '../category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  category: Category;
  numberOfQuestions: number;
  options: number[];
  selectedOption = 10;

  constructor(private route: ActivatedRoute, private categoryService: CategoryService) { }

  ngOnInit() {
    this.getCategory();
    this.getNumberOfQuestions();
  }

  getCategory(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.categoryService.getCategory(id)
      .subscribe(category => this.category = category);
  }

  getNumberOfQuestions(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.categoryService.getNumberOfQuestions(id)
      .subscribe(number => {
        this.numberOfQuestions = number;
        this.getOptions();
      });
  }

  getOptions(): void {
    if (this.numberOfQuestions >= 50) {
      this.options = [10, 20, 30, 40, 50];

    } else {
      let x = +(this.numberOfQuestions / 10);
      const result = [];

      for (let i = 1; i <= x; i++) {
        result.push(i * 10);
      }

      this.options = result;
    }
  }

}
