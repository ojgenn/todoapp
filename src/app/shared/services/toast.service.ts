import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private readonly toastController: ToastController) { }

    public async show(message: string, duration: number = 3000): Promise<void> {
        const toast: HTMLIonToastElement = await this.toastController.create({
            message,
            duration,
            position: 'top',
        });

        toast.present();
    }
}
