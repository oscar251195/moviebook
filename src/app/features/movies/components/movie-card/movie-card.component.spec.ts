import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MovieCardComponent} from './movie-card.component';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;

    // Simulamos datos de entrada
    component.movie = {
      id: '1',
      title: 'Test Movie',
      genre: 'Drama',
      description: 'Test Movie description',
      year: 2020,
      rating: 8.5,
      image_url: 'https://placehold.it/200x300',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display movie title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Test Movie');
  });
});
