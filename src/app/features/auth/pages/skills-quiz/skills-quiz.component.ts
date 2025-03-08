import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { skillsQuizService } from '../../services/skills-quiz.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Question } from '../../interfaces/question.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-skills-quiz',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './skills-quiz.component.html',
  styleUrl: './skills-quiz.component.css'
})
export class SkillsQuizComponent {
  private quizService = inject(skillsQuizService);
  private fireStoreService = inject(FirestoreService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  questions: Question[] = this.quizService.getQuestions();
  currentQuestionIndex = 0;
  answers: Record<number, string[]> = {};

  form = this.fb.group({
    answer: ['', Validators.required]
  });

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  onNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  onPrevious() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--
    }
  }

  // if user takes an answer add it
  onSelect(questionId: number, value: string) {
    if (!this.answers[questionId]) {
      this.answers[questionId] = [];
    }

    const index = this.answers[questionId].indexOf(value);
    if (index === -1) {
      this.answers[questionId].push(value);
    } else {
      this.answers[questionId].splice(index, 1);
    }
  }


  isSelected(questionId: number, value: string): boolean {
    return this.answers[questionId]?.includes(value)
  }


  saveAnswers() {
    const userId = this.authService.currentUserSignal()?.Uid;
    if (!userId) return;

    const quizData = {
      userId,
      answers: this.answers,
      timestamp: new Date()
    };

    this.fireStoreService.addDocument('Reponses quiz', quizData)
      .subscribe({
        next: () => {
          console.log("Le quiz à bien été ajouté");
          this.router.navigate(['/home']);
        },
        error: (error) => console.log("le quiz n'as pas été ajouté:", error)
      })
  }

}
