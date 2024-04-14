import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PaletteEffects } from './palette.effects';

describe('PaletteEffects', () => {
  let actions$: Observable<any>;
  let effects: PaletteEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaletteEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(PaletteEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
