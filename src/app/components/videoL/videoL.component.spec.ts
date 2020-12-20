import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLComponent } from './videoL.component';

describe('JuegoComponent', () => {
  let component: VideoLComponent;
  let fixture: ComponentFixture<VideoLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
