import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSongsComponent } from './collection-songs.component';

describe('CollectionSongsComponent', () => {
  let component: CollectionSongsComponent;
  let fixture: ComponentFixture<CollectionSongsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionSongsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
