import { Injectable } from '@angular/core';
import { Question } from '../../features/auth/interfaces/question.interface';

@Injectable({
  providedIn: 'root'
})
export class skillsQuizService {


  private questions: Question[] = [
    {
      id: '',
      question: "Avez-vous déjà une expérience en programmation ?",
      options: [
        { value: "beginner", label: "Oui, je suis débutant" },
        { value: "intermediate", label: "Oui, niveau intermédiaire" },
        { value: "advanced", label: "Oui, niveau avancé" },
        { value: "new", label: "Non, c'est tout nouveau pour moi" }
      ]
    },
    {
      id: '2',
      question: "Quel domaine du développement vous intéresse le plus ?",
      options: [
        { value: "frontend", label: "Développement web frontend" },
        { value: "backend", label: "Développement web backend" },
        { value: "fullstack", label: "Développement fullstack" },
        { value: "mobile", label: "Développement mobile" },
        { value: "datascience", label: "Data Science / Intelligence Artificielle" },
        { value: "gamedev", label: "Jeux vidéo" },
        { value: "other", label: "Autre" }
      ]
    },
    {
      id: '3',
      question: "Quels langages de programmation connaissez-vous ou souhaitez-vous apprendre ?",
      options: [
        { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "csharp", label: "C#" },
        { value: "php", label: "PHP" },
        { value: "ruby", label: "Ruby" },
        { value: "typescript", label: "TypeScript" },
        { value: "swiftkotlin", label: "Swift/Kotlin" },
        { value: "go", label: "Go" },
        { value: "rust", label: "Rust" },
        { value: "other", label: "Autre" }
      ]
    },
    {
      id: '4',
      question: "Quelle est votre méthode d'apprentissage préférée ?",
      options: [
        { value: "video", label: "Tutoriels vidéo" },
        { value: "docs", label: "Documentation écrite" },
        { value: "projects", label: "Projets pratiques" },
        { value: "online_courses", label: "Cours en ligne" },
        { value: "books", label: "Livres techniques" },
        { value: "forums", label: "Forums et communautés" }
      ]
    },
    {
      id: '5',
      question: "Quel est votre objectif principal en apprenant le développement ?",
      options: [
        { value: "career_change", label: "Changer de carrière" },
        { value: "personal_project", label: "Développer un projet personnel" },
        { value: "skill_improvement", label: "Améliorer mes compétences professionnelles" },
        { value: "curiosity", label: "Simple curiosité/intérêt" },
        { value: "studies", label: "Compléter mes études" },
        { value: "startup", label: "Créer une startup/entreprise" }
      ]
    },
    {
      id: '6',
      question: "Combien de temps pouvez-vous consacrer à l'apprentissage chaque semaine ?",
      options: [
        { value: "lt5", label: "Moins de 5 heures" },
        { value: "5to10", label: "5-10 heures" },
        { value: "10to20", label: "10-20 heures" },
        { value: "gt20", label: "Plus de 20 heures" }
      ]
    },
    {
      id: '7',
      question: "Quels types de ressources recherchez-vous principalement ?",
      options: [
        { value: "beginner_tutorials", label: "Tutoriels pour débutants" },
        { value: "tech_docs", label: "Documentation technique" },
        { value: "guided_projects", label: "Projets pratiques guidés" },
        { value: "challenges", label: "Défis et exercices" },
        { value: "advanced_resources", label: "Ressources avancées" },
        { value: "tools", label: "Outils et bibliothèques" }
      ]
    },
    {
      id: '8',
      question: "Préférez-vous des ressources gratuites ou êtes-vous prêt à investir dans des formations payantes ?",
      options: [
        { value: "free_only", label: "Uniquement des ressources gratuites" },
        { value: "mostly_free", label: "Principalement gratuites, occasionnellement payantes" },
        { value: "willing_to_pay", label: "Je suis prêt à payer pour des ressources de qualité" },
        { value: "subscriptions", label: "Je préfère les abonnements mensuels" }
      ]
    },
    {
      id: '9',
      question: "Quels sujets spécifiques souhaitez-vous explorer davantage ?",
      options: [
        { value: "js_frameworks", label: "Frameworks JavaScript (React, Vue, Angular)" },
        { value: "backend_frameworks", label: "Frameworks backend (Node.js, Django, Rails)" },
        { value: "mobile_dev", label: "Développement mobile (React Native, Flutter)" },
        { value: "databases", label: "Bases de données (SQL, NoSQL)" },
        { value: "devops", label: "DevOps et déploiement" },
        { value: "security", label: "Sécurité web" },
        { value: "uiux", label: "Design UI/UX" },
        { value: "ai_ml", label: "Intelligence artificielle/Machine Learning" },
        { value: "blockchain", label: "Blockchain/Web3" }
      ]
    },
    {
      id: '10',
      question: "Comment avez-vous découvert notre plateforme ?",
      options: [
        { value: "search_engine", label: "Moteur de recherche" },
        { value: "friend", label: "Recommandation d'un ami" },
        { value: "social_media", label: "Réseaux sociaux" },
        { value: "dev_forum", label: "Forum de développeurs" },
        { value: "youtube", label: "YouTube" },
        { value: "blog", label: "Article ou blog" },
        { value: "other", label: "Autre" }
      ]
    }
  ];

  constructor() { }

  // method get all questions
  getQuestions(): Question[] {
    return this.questions;
  }

  //method save answers
}
