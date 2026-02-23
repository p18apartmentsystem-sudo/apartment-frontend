import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatLightBillComponent } from './flat-light-bill.component';

describe('FlatLightBillComponent', () => {
  let component: FlatLightBillComponent;
  let fixture: ComponentFixture<FlatLightBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlatLightBillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlatLightBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
