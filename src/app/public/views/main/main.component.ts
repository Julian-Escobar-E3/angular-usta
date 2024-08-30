import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/views/header/header.component';
import { FooterComponent } from '../../../shared/views/footer/footer.component';

@Component({
  standalone: true,
  templateUrl: './main.component.html',
  styles: `section{
     margin-top: 70px;
  }`,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
})
export default class MainComponent {}
