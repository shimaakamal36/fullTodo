import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component'
import { RegisterComponent } from './pages/user/register/register.component';
import { LoginComponent } from './pages/user/login/login.component';
import {AddTodoComponent} from 'src/app/pages/todos/add-todo/add-todo.component'
import {SingleTodoComponent} from './pages/todos/single-todo/single-todo.component'
import {EditTodoComponent} from './pages/todos/edit-todo/edit-todo.component'
import {DeleteTodoComponent} from './pages/todos/delete-todo/delete-todo.component'
import {NotfoundComponent} from './notfound/notfound.component'
import {ProfileComponent} from './pages/user/profile/profile.component'
import {EdituserComponent} from './pages/user/edituser/edituser.component'
import {DeleteuserComponent} from './pages/user/deleteuser/deleteuser.component'
import {GuestComponent} from './pages/todos/guest/guest.component'
import {GuestsingleComponent} from 'src/app/pages/todos/guestsingle/guestsingle.component'
import {GuardsGuard} from './guards.guard'


const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
    canActivate:[GuardsGuard]
  },
  {
    path:'guest',
    component:GuestComponent
  },
  {
    path:'guest/single/:id',
    component:GuestsingleComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
   path:'login' ,
   component:LoginComponent
  },
  {
    path:'addTodo' ,
    component:AddTodoComponent,
    canActivate:[GuardsGuard]
   },
   {
    path:'profile' ,
    component:ProfileComponent,
    canActivate:[GuardsGuard]
   },
   {
     path:'single/:id',
     component:SingleTodoComponent,
     canActivate:[GuardsGuard]
    },
   {
    path:'edit/:id',
    component:EditTodoComponent,
    canActivate:[GuardsGuard]
  },
  {
    path:'profile/editUser/:id',
    component:EdituserComponent,
    canActivate:[GuardsGuard]
  },
  {
    path:'profile/deleteUser/:id',
    component:DeleteuserComponent,
    canActivate:[GuardsGuard]
  },
  {
    path:'delete/:id',
    component:DeleteTodoComponent,
    canActivate:[GuardsGuard]
  },
   {
    path:'**' ,
    component:NotfoundComponent
   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
