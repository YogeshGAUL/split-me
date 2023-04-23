import { Injectable } from '@angular/core';
import { FoodItem } from '../classes/food-item';
import { Participant } from '../classes/participant';
import { IorderDetails } from '../classes/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FoodPaletteService {
  genRand = (len: number) => {
    return Math.random()
      .toString(36)
      .substring(2, len + 2);
  };
  palettes: FoodItem[] = [
    new FoodItem('cb half', 89, [
      new Participant('jobel', 89),
      new Participant('arathy', 89 / 2),
      new Participant('manju', 89 / 2),
      new Participant('athul', 89),
      new Participant('yogesh', 89),
      new Participant('arshith', 89),
    ]),
    new FoodItem('veg biriyani', 103, [
      new Participant('thomas', 103),
      new Participant('john', 103),
    ]),
    new FoodItem('cb full', 153, [new Participant('jithin', 153)]),
    new FoodItem('beef roast', 139, [
      new Participant('joel', 69.5),
      new Participant('sidharth', 69.5),
    ]),
    new FoodItem('chapathi', 12, [new Participant('sidharth', 12 * 3)]),
    new FoodItem('porotta', 12, [new Participant('joel', 12 * 2)]),
  ];
  paletteIDs: string[] = [];

  constructor() {
    this.updatePanelIds();
  }

  add() {
    let item: FoodItem = new FoodItem('', 0, []);
    item.name = 'item ' + item.foodID;
    this.palettes.push(item);
    this.updatePanelIds();
  }

  remove(item: FoodItem) {
    this.palettes = this.palettes.filter((x) => x !== item);
    this.updatePanelIds();
  }

  updatePanelIds() {
    this.paletteIDs = this.palettes.map((x) => x.ID);
  }

  getTotalAmount() {
    let total: number = 0;
    this.palettes.forEach((item) => {
      total += item.totalContributions;
    });
    return Math.round(total * 100) / 100;
  }

  /**
   *
   * @returns the sum of contribution from every dish of an individual
   */
  getIndividualContributions(): Map<string, number> {
    const contMap = new Map<string, number>();

    for (let i = 0; i < this.palettes.length; i++) {
      const participants = this.palettes[i].participants;

      for (let j = 0; j < participants.length; j++) {
        const participant = participants[j];
        const name = participant.name;
        const contribution = participant.contribution;

        contMap.set(name, (contMap.get(name) || 0) + contribution);
      }
    }
    return contMap;
  }

  /**
   * @returns list of orders from every food pallete the individual is a participant of
   */
  getIndividualOrders(): Map<string, IorderDetails[]> {
    const indDetailsMap = new Map<string, IorderDetails[]>();

    for (let i = 0; i < this.palettes.length; i++) {
      const dish = this.palettes[i];
      const participants = dish.participants;

      for (let j = 0; j < participants.length; j++) {
        const participant = participants[j];
        const name = participant.name;

        const detail: IorderDetails = {
          food_name: dish.name,
          contribution: participant.contribution,
        };
        const orders = indDetailsMap.get(name) || [];
        orders.push(detail);
        indDetailsMap.set(name, orders);
      }
    }
    return indDetailsMap;
  }
}
