import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
      { path: "**", redirectTo: "/v1" },
      { path: " ", redirectTo: "/v1" }
    ]
  },
  /*
  .
  .
  .
  .
  .
  .
  */
  { path: "**", redirectTo: "/v1" },
  { path: " ", redirectTo: "/v1" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
