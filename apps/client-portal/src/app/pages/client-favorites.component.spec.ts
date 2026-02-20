import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFavoritesComponent } from './client-favorites.component';

describe('ClientFavoritesComponent', () => {
  let component: ClientFavoritesComponent;
  let fixture: ComponentFixture<ClientFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFavoritesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
