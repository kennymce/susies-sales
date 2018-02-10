import Post from '../models/post';
import BaseCtrl from './base';
import Gimmie from '../models/gimmie';

export default class GimmieCtrl extends BaseCtrl {
  model = Gimmie;
}
