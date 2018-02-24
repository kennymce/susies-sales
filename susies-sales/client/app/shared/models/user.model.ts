import {Gimmie} from './gimmie.model';

export class User {
  _id?: string;
  username?: string;
  email?: string;
  role?: string;
  gimmies?: Gimmie[]
}
