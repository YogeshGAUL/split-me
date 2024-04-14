import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomContributionToggler } from 'src/app/classes/interfaces';
import { Participant } from 'src/app/classes/participant';
import {Store} from "@ngrx/store";
import {PaletteState} from "../../store/palette/palette.reducer";
import {PaletteActions} from "../../store/palette/palette.actions";

@Component({
  selector: 'app-individual-menu',
  templateUrl: './individual-menu.component.html',
  styleUrls: ['./individual-menu.component.scss'],
})
export class IndividualMenuComponent {
  @Input('participant') participant!: Participant;
  @Input('price') price!: number;

  profileId = 0;
  constructor(private paletteStore: Store<PaletteState>) {
  }

  toggleIndex: number = 0;
  togglers: CustomContributionToggler[] = [
    { symbol: '₹', description: 'amount' },
    { symbol: '%', description: 'percent' },
    { symbol: '×', description: 'servings' },
  ];
  @Output() removeParticipant = new EventEmitter();
  onPortionModifier(modifier: number) {
    this.participant.contribution = parseFloat(
      (this.price * modifier).toFixed(2)
    );
    /// ---------Literally testing code------------
    this.paletteStore.dispatch(PaletteActions.updatePaletteProfile({paletteId: 0, profileId: this.profileId++, newAmount: 100}))
  }

  updateCustom(value: string) {
    if (this.toggleIndex == 0)
      this.participant.contribution = Math.round(parseFloat(value) * 100) / 100;
    else if (this.toggleIndex == 1) {
      let contribution = Math.round((this.price * parseFloat(value)) / 100);
      this.participant.contribution = contribution;
    } else {
      let contribution = Math.round(this.price * parseFloat(value) * 100) / 100;
      this.participant.contribution = contribution;
    }
  }

  remove() {
    this.removeParticipant.emit();
  }

  toggleCustom(event: Event) {
    event.stopPropagation();
    this.toggleIndex = (this.toggleIndex + 1) % 3;
  }
}
