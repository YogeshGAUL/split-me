import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {PaletteState, profileEntities} from "./palette.reducer";

export const PaletteActions = createActionGroup({
  source: 'Palette',
  events: {
    'Initial Palettes': emptyProps(),

    'update palette main' : props<{ updatedPalette: PaletteState }>(),

    'update palette profiles' : props<{ paletteId : number, allPaletteProfiles: profileEntities }>(),

    'update palette profile' : props<{ paletteId : number, profileId : number, newAmount : number }>(),
  }
});
