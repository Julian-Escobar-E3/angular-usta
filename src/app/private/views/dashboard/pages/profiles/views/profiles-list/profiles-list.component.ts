import { Component } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  selector: 'app-profiles-list',
  standalone: true,
  imports: [TitleComponent],
  templateUrl: './profiles-list.component.html',
  styles: ``,
})
export default class ProfilesListComponent {}
