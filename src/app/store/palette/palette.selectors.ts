import { createFeatureSelector, createSelector } from '@ngrx/store';
import {PaletteState} from "./palette.reducer";
import {RootSelector} from "../root-state";

export const getPaletteState = createFeatureSelector<PaletteState>('palettes');

export const getProfilesInPalette = (paletteId: number) =>
  createSelector(
    getPaletteState,
    (paletteState: PaletteState) => {
      return paletteState.entities[paletteId]?.profileEntities;
    }
  );

export const getPalettes = createSelector(RootSelector, (state) => state.palettes)
