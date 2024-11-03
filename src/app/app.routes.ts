import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { SigninComponent } from './modules/signin/signin.component';
import { SignupComponent } from './modules/signup/signup.component';

export const routes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
    title: 'Sign In',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
    data: { shouldReuse: true },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
