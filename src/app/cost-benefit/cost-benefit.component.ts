import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as fin from 'financial';
import { v4 as uuidv4 } from 'uuid';

export interface FY {
  year: number;
  quantity: number;
  amount: number;
}

export interface Cost {
  id: string,
  selected: boolean,
  costItem: string;
  costType: string;
  costDescription: string;
  costPricePerUnit: number;
  years: FY[];
}

export interface Benefit {
  id: string,
  selected: boolean,
  benefitItem: string;
  benefitType: string;
  benefitAssumption: string;
  forecastBenefitAmountPerUnit: number;
  years: FY[];
}

export interface SumFY {
  year: number;
  amount: number;
}

export interface SumCost {
  costType: string;
  years: SumFY[];
  total: number;
}

export interface SumBenefit {
  benefitType: string;
  years: SumFY[];
  total: number;
}

declare const $: any;

@Component({
  selector: 'cost-benefit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cost-benefit.component.html',
  styleUrls: ['./cost-benefit.component.scss']
})
export class CostBenefitComponent {

  costs: Cost[] = [];
  benefits: Benefit[] = [];
  costTypes: string[] = [
    'Labor Cost',
    'Promotion / Marketing Cost',
    'Implementation',
    'Infrastructure',
    'License',
    'Penetration Test',
    'Performance Test',
    'Other Cost'
  ];
  
  benefitTypes: string[] = [
    'Net Interest Income',
    'Fee Based Income',
    'Cost Saving',
    'Other Benefit'
  ];

  ngOnInit() {
    this.costs = [];

    this.benefits = [];
  }

  tab: number = 1;
  showTab(tab: number){
    this.selectAll = false;
    this.selectDeselectAll();
    this.tab = tab;
    setTimeout(() => {
      $('.sheet > table').tableHeadFixer({"head" : true, "left" : 4});
    }, 1000);
    this.populateCBA();
    
  }

  ngAfterViewInit() {
    $('.sheet > table').tableHeadFixer({"head" : true, "left" : 4});
    console.log($('.sheet > table'));
  }

  getTotalAmount(year: string){
    return 0;
  }

  getTotalCostAmount(year: number){
    let totalCostAmount = 0;
    for (const cost of this.costs) {
      totalCostAmount += cost.years.find(y => y.year === year)?.amount || 0;
    }
    return totalCostAmount;
  }

  getTotalBenefitAmount(year: number){
    let totalBenefitAmount = 0;
    for (const benefit of this.benefits) {
      totalBenefitAmount += benefit.years.find(y => y.year === year)?.amount || 0;
    }
    return totalBenefitAmount;
  }

  sumCosts: SumCost[] = [];
  sumBenefits: SumBenefit[] = [];
  costPerYear: SumFY[] = [];
  benefitPerYear: SumFY[] = [];
  cashFlow: SumFY[] = [];
  paybackFlow: SumFY[] = [];
  totalCost!: number;
  totalBenefit!: number;

  populateCBA(){
    this.sumCosts = [];
    for (const cost of this.costs) {
      const existingSumCost = this.sumCosts.find(sumCost => sumCost.costType === cost.costType);
      if (existingSumCost) {
        for (const year of cost.years) {
          const existingYear = existingSumCost.years.find(sumYear => sumYear.year === year.year);
          if (existingYear) {
            existingYear.amount += year.amount;
          } else {
            existingSumCost.years.push({ year: year.year, amount: year.amount });
          }
        }
      } else {
        const newSumCost: SumCost = {
          costType: cost.costType,
          years: cost.years.map(year => ({ year: year.year, amount: year.amount })),
          total: cost.years.reduce((acc, curr) => acc + curr.amount, 0)
        };
        this.sumCosts.push(newSumCost);
      }
    }

    this.totalCost = this.sumCosts.reduce((acc, curr) => acc + curr.total, 0);

    this.sumBenefits = [];
    for (const benefit of this.benefits) {
      const existingSumBenefit = this.sumBenefits.find(sumBenefit => sumBenefit.benefitType === benefit.benefitType);
      if (existingSumBenefit) {
        for (const year of benefit.years) {
          const existingYear = existingSumBenefit.years.find(sumYear => sumYear.year === year.year);
          if (existingYear) {
            existingYear.amount += year.amount;
          } else {
            existingSumBenefit.years.push({ year: year.year, amount: year.amount });
          }
        }
      } else {
        const newSumBenefit: SumBenefit = {
          benefitType: benefit.benefitType,
          years: benefit.years.map(year => ({ year: year.year, amount: year.amount })),
          total: benefit.years.reduce((acc, curr) => acc + curr.amount, 0)
        };
        this.sumBenefits.push(newSumBenefit);
      }
    }

    this.totalBenefit = this.sumBenefits.reduce((acc, curr) => acc + curr.total, 0);

    this.costPerYear = [];
    for (const sumCost of this.sumCosts) {
      for (const year of sumCost.years) {
        const existingYear = this.costPerYear.find(costYear => costYear.year === year.year);
        if (existingYear) {
          existingYear.amount += year.amount;
        } else {
          this.costPerYear.push({ year: year.year, amount: year.amount });
        }
      }
    }

    this.benefitPerYear = [];
    for (const sumBenefit of this.sumBenefits) {
      for (const year of sumBenefit.years) {
        const existingYear = this.benefitPerYear.find(benefitYear => benefitYear.year === year.year);
        if (existingYear) {
          existingYear.amount += year.amount;
        } else {
          this.benefitPerYear.push({ year: year.year, amount: year.amount });
        }
      }
    }

    this.cashFlow = this.benefitPerYear.map(benefitYear => {
      const correspondingCostYear = this.costPerYear.find(costYear => costYear.year === benefitYear.year);
      const amount = benefitYear.amount - (correspondingCostYear ? correspondingCostYear.amount : 0);
      return { year: benefitYear.year, amount };
    });

    this.paybackFlow = [];

    for (let i = 0; i < this.cashFlow.length; i++) {
      const year = this.cashFlow[i];
      const lastYearCashFlow = this.cashFlow[i - 1] ? this.cashFlow[i - 1].amount : 0;
      const lastYearPaybackFlow = this.paybackFlow[i - 1] ? this.paybackFlow[i - 1].amount : 0;
      this.paybackFlow.push({ year: year.year, amount: lastYearCashFlow + lastYearPaybackFlow });
    }

    this.calculate();

  }

  pvFactor: number = 11;
  npvInvestment!: number;
  npvCashflow!: number;
  roi!: number;
  irr!: number;

  calculate(){

    const costPerYearAmounts = this.costPerYear.map(costYear => costYear.amount);
    this.npvInvestment = fin.npv(this.pvFactor, costPerYearAmounts);
    const cashFlowAmounts = this.cashFlow.map(cashYear => cashYear.amount);
    this.npvCashflow = fin.npv(this.pvFactor, cashFlowAmounts);
    this.roi = this.npvCashflow / this.npvInvestment;
    this.irr = fin.irr(cashFlowAmounts);

  }

  addRow(){
      if (this.tab === 1)
      this.costs.push({
        id: uuidv4(),
        selected: false,
        costItem: '',
        costType: '',
        costDescription: '',
        costPricePerUnit: 0,
        years: [
          { year: 0, quantity: 0, amount: 0 },
          { year: 1, quantity: 0, amount: 0 },
          { year: 2, quantity: 0, amount: 0 },
          { year: 3, quantity: 0, amount: 0 },
          { year: 4, quantity: 0, amount: 0 },
          { year: 5, quantity: 0, amount: 0 }
        ]
      });

      if (this.tab === 2)
      this.benefits.push({
        id: uuidv4(),
        selected: false,
        benefitItem: '',
        benefitType: '',
        benefitAssumption: '',
        forecastBenefitAmountPerUnit: 0,
        years: [
          { year: 0, quantity: 0, amount: 0 },
          { year: 1, quantity: 0, amount: 0 },
          { year: 2, quantity: 0, amount: 0 },
          { year: 3, quantity: 0, amount: 0 },
          { year: 4, quantity: 0, amount: 0 },
          { year: 5, quantity: 0, amount: 0 }
        ]
      });
    
    
  }

  selectAll: boolean = false;
  selectDeselectAll(){
    if (this.tab === 1) this.costs.forEach(cost => {
      cost.selected = this.selectAll;
    });
    if (this.tab === 2) this.benefits.forEach(benefit => {
      benefit.selected = this.selectAll;
    });
  }

  delete(){
     if (this.tab === 1) this.costs = this.costs.filter(cost => !cost.selected);
     if (this.tab === 2) this.benefits = this.benefits.filter(benefit => !benefit.selected);
  }

  calcItem(item: Cost){
    console.log(item)
    item.years.forEach(fy => { 
      fy.amount = fy.quantity * item.costPricePerUnit; 
      console.log(fy)
    });
   
  }

}
