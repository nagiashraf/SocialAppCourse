import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberDetailRouteReuseStrategy } from './_routeReuseStrategies/memberDetailRouteReuseStrategy ';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AdminGuard } from './_guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '', canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
    { path: 'members', component: MemberListComponent },
    { path: 'members/:username', component: MemberDetailComponent, resolve:{ loadedMember: MemberDetailResolver }},
    { path: 'member/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard] },
    { path: 'lists', component: ListsComponent },
    { path: 'messages', component: MessagesComponent },
    { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard] }
  ]},
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: RouteReuseStrategy, useClass: MemberDetailRouteReuseStrategy}]
})
export class AppRoutingModule { }