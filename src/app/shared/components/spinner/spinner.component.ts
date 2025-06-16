import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  template: `<div class="d-flex justify-content-center mt-5">
    <div class="loader "></div>
  </div>`,
  styles: `
.loader {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
  border: 4px solid #0000;
  border-radius: 50%;
  border-right-color:rgb(37, 104, 176);
  animation: l15 1s infinite linear;
}
.loader::before,
.loader::after {
  content: "";
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
  animation: l15 2s infinite;
}
.loader::after {
  margin: 8px;
  animation-duration: 3s;
}
@keyframes l15{
  100%{transform: rotate(1turn)}
}`,
})
export class SpinnerComponent {}
