import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CategoryService } from '../category.service';
import { Category } from '../category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input() category: Category;
  numberOfQuestions: number;
  options: number[];
  selectedOption = 10;

  constructor(private route: ActivatedRoute, private categoryService: CategoryService) { }

  ngOnInit() {
    if (this.category) {
      this.getNumberOfQuestions(this.category.id);

    } else {
      this.getCategory();
    }

  }

  getCategory(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.categoryService.getCategory(id)
      .subscribe(category => {
        this.category = category;
        this.getNumberOfQuestions(id);
      });
  }

  getNumberOfQuestions(id: number): void {
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
      const x = +(this.numberOfQuestions / 10);
      const result = [];

      for (let i = 1; i <= x; i++) {
        result.push(i * 10);
      }

      this.options = result;
    }
  }

}
