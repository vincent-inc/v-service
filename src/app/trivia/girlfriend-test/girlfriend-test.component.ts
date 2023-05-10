import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { Question } from 'src/app/shared/model/VGame.model';
import { VGameService } from 'src/app/shared/service/VGame.service';

@Component({
  selector: 'app-girlfriend-test',
  templateUrl: './girlfriend-test.component.html',
  styleUrls: ['./girlfriend-test.component.scss']
})
export class GirlfriendTestComponent implements OnInit {

  questions: Question[] = [];

  maxQuestion: number = 0;

  maxPoint: number = 0;

  lock: boolean = false;

  constructor(
    private vgameService: VGameService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    let exampleQuestion: Question = {
      category: "GF"
    }

    this.vgameService.getAnyMatchQuestions(exampleQuestion).pipe(first()).subscribe(
      res => {
        this.preprocess(res);
        this.questions = res;
        this.lock = false;
      }
    );
  }

  preprocess(questions: Question[]) {
    this.maxPoint = 0;
    this.shuffle(questions);
    this.maxQuestion = 1 + (Math.random() * questions.length - 1);

    while(questions.length > this.maxQuestion) {
      questions.pop();
    }

    questions = questions.sort((a, b) => a.orderBy! - b.orderBy!)

    questions.forEach(q => {
      q.answer?.correctAnswer?.forEach(ca => {
        this.maxPoint += q.answer?.pointPerCorrectAnswer!;
      });
      q.selectedAnswer = [];
      q.possibleAnswer?.forEach(e1 => {
        q.selectedAnswer?.push('');
      })
    })
  }

  shuffle(questions: Question[]) {
    let randomSeed = Math.floor(Math.random() * 100);
    for(let i = 0; i < randomSeed; i++) {
      let pos1 = Math.floor(Math.random() * questions.length);
      let pos2 = Math.floor(Math.random() * questions.length);
      let pos1Value = structuredClone(questions[pos1]);
      let pos2Value = structuredClone(questions[pos2]);
      questions.splice(pos1, 1, pos2Value);
      questions.splice(pos2, 1, pos1Value);
    }
  }

  seeResult() {
    this.lock = true;
  }

  selectAnswer(question: Question, index: number, input: HTMLInputElement):void {
    if(input.checked) {
      question.selectedAnswer![index] = input.value;
    }
    else {
      question.selectedAnswer![index] = "";
    }
  }

  reset() {
    this.init();
  }
}
