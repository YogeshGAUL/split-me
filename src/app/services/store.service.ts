import { Injectable } from '@angular/core';
import { SimpleProfileService } from './simple-profile.service';
import { FoodPaletteService } from './food-palette.service';
import { DetailsService } from './details.service';
import { IAppState } from '../components/header/header.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { FoodItem } from '../classes/food-item';
import { Participant } from '../classes/participant';
import { Profile } from '../classes/profile';
import { Action, ActionType } from '../classes/constants';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  state!: IAppState;
  private stateSubject: BehaviorSubject<Action>;
  public state$: Observable<Action>;
  constructor(
    private profile: SimpleProfileService,
    private palette: FoodPaletteService,
    private details: DetailsService
  ) {
    this.state = {
      profiles: this.profile.profiles,
      palettes: this.palette.palettes,
      tax: this.details.tax,
      discount: this.details.discount,
    };
    this.stateSubject = new BehaviorSubject<Action>({
      type: ActionType.DEFAULT,
      payload: null,
    });
    this.state$ = this.stateSubject.asObservable();
  }

  notifyAppState(action: Action) {
    this.stateSubject.next(action);
  }

  //STORE ACTIONS

  fireAction(type: ActionType, payload: any) {
    this.notifyAppState({ type: type, payload: payload });
  }

  handleAction(action: Action) {
    let palette;
    switch (action.type) {
      case ActionType.ADD_PARTICIPANT:
        palette = this.palette.palettes.find(
          (palette) => palette.id === action.payload.palette
        );
        if (palette) {
          const participants = this.getParticipantsFromProfiles(
            action.payload.participants,
            palette.price,
            palette.participants
          );
          palette.participants.push(...participants);
        }
        break;
      case ActionType.REMOVE_PARTICIPANT:
        console.log('removing');

        palette = this.palette.palettes.find(
          (palette) => palette.id === action.payload.palette
        );
        if (palette)
          palette.participants = palette.participants.filter(
            (x) => x.name !== action.payload.name
          );
        break;
      case ActionType.ADD_PALETTE:
        const foodItem = new FoodItem('-', 0, [], action.payload.id);
        this.palette.add(foodItem);
        this.palette.updatePanelIds();
        break;
    }
  }

  //initial load
  loadCloudState(newState: IAppState) {
    this.profile.profiles = newState.profiles;
    this.palette.palettes = this.paletteCreation(newState.palettes);
    this.palette.updatePanelIds();
    this.details.tax = newState.tax;
    this.details.discount = newState.discount;
  }
  paletteCreation(storeItem: FoodItem[]) {
    let palettes: FoodItem[] = [];
    storeItem.forEach((pal) => {
      const palette = new FoodItem(
        pal.name,
        pal.price,
        this.getParticipants(pal.participants),
        pal.id
      );
      palettes.push(palette);
    });
    return palettes;
  }

  getParticipants(parties: Participant[]) {
    let participants: Participant[] = [];
    console.log(parties);

    parties.forEach((par) => {
      const participant = new Participant(
        new Profile(par.profile.name),
        par.contribution
      );
      participant.profile.hue = par.profile.hue;
      participants.push(participant);
    });
    return participants;
  }

  getParticipantsFromProfiles(
    profiles: Profile[],
    price: number,
    existingPartcipants: Participant[]
  ) {
    let participants: Participant[] = [];

    profiles.forEach((profile: Profile) => {
      const participant = new Participant(profile, price);
      participant.profile.hue = profile.hue;
      if (
        !existingPartcipants.some(
          (participant) => participant.profile.name === profile.name
        )
      )
        participants.push(participant);
    });
    return participants;
  }
}