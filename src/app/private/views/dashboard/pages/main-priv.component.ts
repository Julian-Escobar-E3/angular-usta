import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-views',
  standalone: true,
  templateUrl: './main-priv.component.html',
  styles: ``,
})
export default class MainPrivComponent {
  onClick() {
    Swal.fire({
      title: 'Ahora estas viendo a un lindo gatito',
      width: 600,
      padding: '3em',
      color: '#716add',
      background: '#fff url(/images/trees.png)',
      backdrop: `
    rgba(0,0,123,0.4)
    url("https://c.tenor.com/-AyTtMgs2mMAAAAj/nyan-cat-nyan.gif")
    left top
    no-repeat
  `,
    });
  }
}
