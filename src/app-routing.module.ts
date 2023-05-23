import { JwtTokenAuthGuardProvider } from './providers/jwt-token-auth-guard/jwt-token-auth-guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/home/home.module#LoginPageModule' },
  { path: 'burnered', loadChildren: './pages/burnered/burnered.module#BurneredPageModule', canActivate: [JwtTokenAuthGuardProvider] },
  { path: 'locations', loadChildren: './pages/locations/locations.module#LocationsPageModule', canActivate: [JwtTokenAuthGuardProvider] },
  { path: 'map', loadChildren: './pages/map/map.module#MapPageModule', canActivate: [JwtTokenAuthGuardProvider] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }