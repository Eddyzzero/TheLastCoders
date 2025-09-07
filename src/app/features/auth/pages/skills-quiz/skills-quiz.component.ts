import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { Router } from '@angular/router';
import { skillsQuizService } from '../../../../core/services/skills-quiz.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Question } from '../../interfaces/question.interface';
import { CommonModule } from '@angular/common';
import { QuizResponse } from '../../../auth/interfaces/quiz.interface';

@Component({
  selector: 'app-skills-quiz',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './skills-quiz.component.html',
})
export class SkillsQuizComponent {
  private quizService = inject(skillsQuizService);
  private fireStoreService = inject(FirestoreService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  questions: Question[] = this.quizService.getQuestions();
  currentQuestionIndex = 0;
  answers: Record<string, string[]> = {};
  errorMessage: string = '';

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
  onSelect(questionId: string, value: string) {
    // Pour la première question (choix unique)
    if (questionId === '1') {
      this.answers[questionId] = [value];
    }
    // Pour les autres questions (choix multiple)
    else {
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
  }

  isSelected(questionId: string, value: string): boolean {
    return this.answers[questionId]?.includes(value)
  }

  async saveAnswers() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }

      // Vérifier si toutes les questions ont été répondues
      const answeredQuestions = Object.keys(this.answers).length;
      if (answeredQuestions !== this.questions.length) {
        this.errorMessage = 'Veuillez répondre à toutes les questions avant de continuer.';
        return;
      }

      // Vérifier que toutes les réponses sont présentes
      for (const question of this.questions) {
        const questionId = question.id;
        if (!this.answers[questionId] || this.answers[questionId].length === 0) {
          this.errorMessage = `Veuillez répondre à la question ${questionId} avant de continuer.`;
          return;
        }
      }

      const quizResponse: QuizResponse = {
        userId: currentUser.uid,
        experience: this.answers['1']?.[0] || '',
        domain: this.answers['2']?.[0] || '',
        languages: this.answers['3'] || [],
        learningMethod: this.answers['4']?.[0] || '',
        goal: this.answers['5']?.[0] || '',
        timePerWeek: this.answers['6']?.[0] || '',
        resources: this.answers['7'] || [],
        paymentPreference: this.answers['8']?.[0] || '',
        topics: this.answers['9'] || [],
        discovery: this.answers['10']?.[0] || '',
        createdAt: new Date()
      };

      // Sauvegarder dans Firestore
      await this.fireStoreService.createDocument(`quiz_responses/${currentUser.uid}`, quizResponse);

      // Mettre à jour le profil utilisateur avec les compétences sélectionnées
      const userData = this.authService.currentUserSignal();
      if (userData) {
        const updatedUserData = {
          ...userData,
          skills: quizResponse.languages || [],
          domain: quizResponse.domain,
          experience: quizResponse.experience
        };

        // Mettre à jour le document utilisateur dans Firestore
        await this.fireStoreService.updateDocument(`users/${currentUser.uid}`, updatedUserData);

        // Mettre à jour le signal de l'utilisateur
        this.authService.currentUserSignal.set(updatedUserData);
      }

      // Rediriger vers la page d'accueil
      await this.router.navigate(['/home']);
    } catch (error) {
      this.errorMessage = 'Une erreur est survenue lors de la sauvegarde des réponses. Veuillez réessayer.';
    }
  }

}
