import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
//TODO :
//creer le composant login qui permettra de se connecter
export class LoginComponent {

}