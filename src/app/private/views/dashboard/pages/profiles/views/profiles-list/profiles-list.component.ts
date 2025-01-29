import { Component } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { IProfile } from '../../interfaces/profile.interface';
import { ProfileTableColumns, ProfileTableRows } from '../../enums';
import { CommonModule } from '@angular/common';

const data: Partial<IProfile>[] = [
  {
    fullname: 'martha susana contreras ortiz',
    email: 'marta.contreras@usantoto.edu.co',
  },
  {
    fullname: 'diego alejandro vela beltran',
    email: 'diego.vela@usantotot.edu.co',
  },
  {
    fullname: 'julian camilo escobar araqe',
    email: 'julian.escobar@usantoto.edu.co',
  },
];

@Component({
  selector: 'app-profiles-list',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './profiles-list.component.html',
  styles: ``,
})
export default class ProfilesListComponent {
  public profileService = data;
  public columns = Object.values(ProfileTableColumns);
  public rows = Object.values(ProfileTableRows);
}
