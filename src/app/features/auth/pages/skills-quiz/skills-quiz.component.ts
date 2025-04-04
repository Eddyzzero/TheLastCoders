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
    console.log('Sélection de réponse:', { questionId, value });

    if (!this.answers[questionId]) {
      this.answers[questionId] = [];
      console.log('Initialisation du tableau pour la question:', questionId);
    }

    const index = this.answers[questionId].indexOf(value);
    if (index === -1) {
      this.answers[questionId].push(value);
      console.log('Réponse ajoutée:', { questionId, value, answers: this.answers[questionId] });
    } else {
      this.answers[questionId].splice(index, 1);
      console.log('Réponse retirée:', { questionId, value, answers: this.answers[questionId] });
    }
  }

  isSelected(questionId: string, value: string): boolean {
    return this.answers[questionId]?.includes(value)
  }

  async saveAnswers() {
    try {
      console.log('Début de la sauvegarde des réponses...');
      console.log('Réponses collectées:', this.answers);
      console.log('Nombre total de questions:', this.questions.length);
      console.log('Clés des réponses:', Object.keys(this.answers));

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }
      console.log('Utilisateur connecté:', currentUser.uid);

      // Vérifier si toutes les questions ont été répondues
      const answeredQuestions = Object.keys(this.answers).length;
      if (answeredQuestions !== this.questions.length) {
        console.log('Questions manquantes:', this.questions.length - answeredQuestions);
        this.errorMessage = 'Veuillez répondre à toutes les questions avant de continuer.';
        return;
      }

      // Vérifier que toutes les réponses sont présentes
      for (const question of this.questions) {
        const questionId = question.id;
        console.log(`Vérification de la question ${questionId}:`, {
          existe: !!this.answers[questionId],
          contenu: this.answers[questionId],
          longueur: this.answers[questionId]?.length
        });

        if (!this.answers[questionId] || this.answers[questionId].length === 0) {
          console.error(`Question ${questionId} n'a pas de réponse`);
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

      console.log('Données à sauvegarder:', quizResponse);

      // Sauvegarder dans Firestore
      await this.fireStoreService.CreateDocument(`quiz_responses/${currentUser.uid}`, quizResponse);
      console.log('Réponses sauvegardées avec succès dans Firestore');

      // Rediriger vers la page d'accueil
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des réponses:', error);
      this.errorMessage = 'Une erreur est survenue lors de la sauvegarde des réponses. Veuillez réessayer.';
    }
  }

}
