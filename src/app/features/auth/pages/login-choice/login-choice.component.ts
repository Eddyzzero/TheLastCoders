import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-login-choice',
  imports: [
    RouterModule,
  ],
  templateUrl: './login-choice.component.html',
  styleUrl: './login-choice.component.css'
})
export class LoginChoiceComponent {
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSignal.set({
          Uid: user.uid,
          email: user.email!,
          UserName: user.displayName!,
          createdAt: new Date(),
        })
      } else {
        this.authService.currentUserSignal.set(null);
      }
      console.log(this.authService.currentUserSignal(),)
    })
  }

  //if the user press logout === index
  logOut(): void {
    this.authService.logOut();
  }
}
