import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/main/dashboard/dashboard.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  { 
    path: "v1",
    component: MainComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      { path: "**", redirectTo: "/dashboard" },
      { path: " ", redirectTo: "/dashboard" }
    ]
  },
  {
    path: "login",
    component: LoginComponent
  },
  /*
  .
  .
  .
  .
  .
  .
  */
  { path: "**", redirectTo: "/v1/dashboard" },
  { path: " ", redirectTo: "/v1/dashboard" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
