import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CartService } from './app/services/cart.service';

bootstrapApplication(AppComponent, {
  providers: [
    CartService // Add your services here
  ]
}).catch(err => console.error(err));