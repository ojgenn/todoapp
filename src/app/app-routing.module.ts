import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        // tslint:disable-next-line:typedef
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
    },
    {
        path: 'list',
        // tslint:disable-next-line:typedef
        loadChildren: () => import('./pages/catalog/catalog.module').then(m => m.CatalogModule)
    },
    {
        path: 'store-data',
        // tslint:disable-next-line:typedef
        loadChildren: () => import('./pages/store-data/store-data.module').then(m => m.StoreDataModule)
    },
    {
        path: 'today-tasks',
        loadChildren: () => import('./pages/today-tasks/today-tasks.module').then(m => m.TodayTasksPageModule)
    }


];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
