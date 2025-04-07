import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ExternalCategoriesComponent } from './components/external-categories/external-categories.component';

const routes: Routes = [
  { path: '', component: CategoryListComponent },
  { path: 'subcategories/:parentId', component: CategoryListComponent }, // This still works
  { path: 'add', component: CategoryFormComponent },
  { path: 'add-subcategory/:parentId', component: CategoryFormComponent },
  { path: 'edit/:id', component: CategoryFormComponent },
  { path: 'external', component: ExternalCategoriesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }