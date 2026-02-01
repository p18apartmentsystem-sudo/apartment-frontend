import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatAdminComponent } from './flat-admin.component';

describe('FlatAdminComponent', () => {
  let component: FlatAdminComponent;
  let fixture: ComponentFixture<FlatAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlatAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlatAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
