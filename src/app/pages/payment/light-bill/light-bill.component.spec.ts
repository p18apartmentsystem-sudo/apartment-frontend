import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightBillComponent } from './light-bill.component';

describe('LightBillComponent', () => {
  let component: LightBillComponent;
  let fixture: ComponentFixture<LightBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LightBillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LightBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
