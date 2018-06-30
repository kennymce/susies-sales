import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GimmiesComponent } from './gimmies.component';

describe('GimmiesComponent', () => {
  let component: GimmiesComponent;
  let fixture: ComponentFixture<GimmiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GimmiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GimmiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
