import { Injectable } from '@angular/core';
import { FoodPaletteService } from './food-palette.service';
import { IContributors } from '../classes/interfaces';
import { IndividualSummary } from '../classes/individual-summary';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  tax: number = 113.15;
  discount: number = 75;
  totalFoodAmount: number = 0;
  finalTotal: number = 0;
  contributorsMap: Map<string, number>;
  totalAmountMap: Map<string, number>;
  individualSummaryMap: Map<string, IndividualSummary>;
  constructor(private foodPalette: FoodPaletteService) {
    this.contributorsMap = new Map<string, number>();
    this.totalAmountMap = new Map<string, number>();
    this.individualSummaryMap = new Map<string, IndividualSummary>();
  }

  calculateFinalTotal() {
    this.totalFoodAmount = this.foodPalette.getTotalAmount();
    this.contributorsMap = this.foodPalette.getIndividualContributions();
    this.totalAmountMap = new Map<string, number>();
    let finalAmt: number = 0;
    for (let [name, money] of this.contributorsMap) {
      let taxAmt = (money / this.totalFoodAmount) * this.tax;
      let discAmt = (money / this.totalFoodAmount) * this.discount;

      let newAmount = Math.round((money + taxAmt - discAmt) * 100) / 100;
      finalAmt += money + taxAmt - discAmt;
      this.totalAmountMap.set(name, newAmount);
    }

    this.finalTotal = Math.round(finalAmt * 100) / 100;

    //TODO remove this to button or some thing after implementation
    this.generateIndividualSummary();
  }

  generateDataSourceMap(): IContributors[] {
    let ContributorsMap: IContributors[] = [];
    if (this.contributorsMap && this.totalAmountMap) {
      for (let [name, money] of this.contributorsMap) {
        let entry: IContributors = {
          name: name,
          food_amount: money,
          split_amount: this.totalAmountMap.get(name)!,
        };
        ContributorsMap.push(entry);
      }
    }

    return ContributorsMap;
  }

  generateIndividualSummary() {
    let indivualOrders = this.foodPalette.getIndividualOrders();
    this.individualSummaryMap = new Map<string, IndividualSummary>();
    for (let [name, orders] of indivualOrders.entries()) {
      let summary = new IndividualSummary(
        name,
        orders,
        this.contributorsMap.get(name)!,
        this.totalAmountMap.get(name)!
      );
      this.individualSummaryMap.set(name, summary);
    }
  }

  getCalculatedAmount() {
    // return the total amount with tax and discount integrated
    this.totalFoodAmount = this.foodPalette.getTotalAmount();
    return (
      Math.round((this.totalFoodAmount + this.tax - this.discount) * 100) / 100
    );
  }

  //utility function
  addbits(s: string): number {
    const regex = /[+\-]?([0-9\.]+)/g;
    const matches = s.replace(/\s/g, '').match(regex) || [];
    let sum = 0;
    for (const val of matches) {
      sum += parseFloat(val);
    }
    return sum;
  }
}
