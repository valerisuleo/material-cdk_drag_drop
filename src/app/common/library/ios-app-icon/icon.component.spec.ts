import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconIOSComponent } from './icon.component';

describe('IconIOSComponent', () => {
  let component: IconIOSComponent;
  let fixture: ComponentFixture<IconIOSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconIOSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconIOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
