import {ActionReducer, ActionReducerMap, createFeatureSelector, createSelector} from "@ngrx/store";
import {PaletteReducer, PaletteState, profileState} from "./palette/palette.reducer";

export interface RootState {
  palettes: PaletteState
}

export const RootSelector = createFeatureSelector<RootState>('split-me');

export const rootReducer: ActionReducerMap<RootState> = {
  palettes: PaletteReducer
  // will have ProfilesReducer, OperationsReducer
}
