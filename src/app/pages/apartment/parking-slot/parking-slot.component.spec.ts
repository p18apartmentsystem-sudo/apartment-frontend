import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSlotComponent } from './parking-slot.component';

describe('ParkingSlotComponent', () => {
  let component: ParkingSlotComponent;
  let fixture: ComponentFixture<ParkingSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkingSlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkingSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
