import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AnalyzeComponent } from './pages/analyze.component';
import { ResultComponent } from './pages/result.component';
import { AboutComponent } from './pages/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'analyze', component: AnalyzeComponent },
  { path: 'result', component: ResultComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];