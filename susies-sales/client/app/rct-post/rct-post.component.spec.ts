import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RctPostComponent } from './rct-post.component';

describe('RctPostComponent', () => {
  let component: RctPostComponent;
  let fixture: ComponentFixture<RctPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RctPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RctPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
