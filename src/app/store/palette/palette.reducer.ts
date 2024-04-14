import {createReducer, on} from '@ngrx/store';
import {PaletteActions} from './palette.actions';
import {createEntityAdapter, EntityState, Update} from "@ngrx/entity";

export const paletteFeatureKey = 'palette';

export const paletteEntityAdaptor = createEntityAdapter<PaletteItems>({
  selectId: palette => palette.id
});

export interface profileState {
  id: number,
  name: string,
  totalSplitAmount: number,
  paletteIds: number[],
}

export interface profileEntities {
  [profileId: number]: number
}

export interface PaletteItems {
  dishName: string,
  dishPrice: number,
  id: number,
  profileEntities: profileEntities,
}

const defaultPaletteItems: PaletteItems = {
  id: 0,
  dishName: 'DEFAULT',
  dishPrice: 0,
  profileEntities: []
}

export interface PaletteState extends EntityState<PaletteItems> {
}

export const initialState: PaletteState = paletteEntityAdaptor.getInitialState();

export const PaletteReducer = createReducer(
  initialState,
  on(PaletteActions.updatePaletteMain, (initialState, {updatedPalette}) => ({...initialState, ...updatedPalette})),
  on(PaletteActions.updatePaletteProfiles, (initialState, {paletteId, allPaletteProfiles}) => {
    const updated: Update<PaletteItems> = {
      id: paletteId,
      changes: {profileEntities: allPaletteProfiles},
    };
    return paletteEntityAdaptor.updateOne(updated, initialState);
  }),
  on(PaletteActions.updatePaletteProfile, (initialState, {paletteId, profileId, newAmount}) => {

    // -----------actual code for this reducer---------------
    // const palette = initialState.entities[paletteId] ?? defaultPaletteItems;
    // palette.profileEntities[profileId] = newAmount;
    // const updted: Update<PaletteItems> = {
    //   id: paletteId,
    //   changes: {profileEntities: palette.profileEntities[profileId]}
    // }

    // ---------testing code; Not for this reducer-----------
    const updated: PaletteItems[] = [
      {
        dishName: "Yog", dishPrice: 123456778047, profileEntities: [100, 200],
        id: 0
      },
      {
        dishName: "GAUL", dishPrice: 123456707426, profileEntities: [1001, 2002],
        id: 1
      }];
    return paletteEntityAdaptor.addMany(updated, initialState);
  }),
);

