import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareditComponent } from './caredit.component';

describe('CareditComponent', () => {
  let component: CareditComponent;
  let fixture: ComponentFixture<CareditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
