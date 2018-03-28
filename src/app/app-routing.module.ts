import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';
import { CollectionDetailComponent } from './collection-detail/collection-detail.component';
import { SongsComponent } from './songs/songs.component';
import { CoversComponent } from './covers/covers.component';
import { CollectionSongsComponent } from './collection-songs/collection-songs.component';

const routes: Routes = [
  { path: '', redirectTo: '/collections', pathMatch: 'full' },
  { path: 'detail/:id', component: CollectionDetailComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'covers', component: CoversComponent },
  { path: 'collection-songs', component: CollectionSongsComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})

export class AppRoutingModule {


}
