import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
  @Output() filterChange = new EventEmitter<any>();

  searchText = '';
  yearMin = 2004;
  yearMax = 2025;
  kmMin = 1;
  kmMax = 1469315;
  priceMin = 10133;
  priceMax = 22971488;

  emitFilters() {
    this.filterChange.emit({
      searchText: this.searchText,
      yearMin: this.yearMin,
      yearMax: this.yearMax,
      kmMin: this.kmMin,
      kmMax: this.kmMax,
      priceMin: this.priceMin,
      priceMax: this.priceMax
    });
  }

  // Handle input from either the range thumbs or the numeric inputs
  onRangeInput(group: 'year' | 'km' | 'price', which: 'min' | 'max', value: any) {
    const val = Number(value);
    if (group === 'year') {
      if (which === 'min') this.yearMin = Math.min(val, this.yearMax);
      else this.yearMax = Math.max(val, this.yearMin);
    } else if (group === 'km') {
      if (which === 'min') this.kmMin = Math.min(val, this.kmMax);
      else this.kmMax = Math.max(val, this.kmMin);
    } else if (group === 'price') {
      if (which === 'min') this.priceMin = Math.min(val, this.priceMax);
      else this.priceMax = Math.max(val, this.priceMin);
    }
    // normalize values to ensure min <= max
    this.normalizeValues(group);
    this.emitFilters();
  }

  // Ensure the numeric values respect min/max ordering and bounds
  normalizeValues(group: 'year' | 'km' | 'price') {
    if (group === 'year') {
      if (this.yearMin > this.yearMax) [this.yearMin, this.yearMax] = [this.yearMax, this.yearMin];
      this.yearMin = Math.max(1990, Math.min(2025, this.yearMin));
      this.yearMax = Math.max(1990, Math.min(2025, this.yearMax));
    }
    if (group === 'km') {
      this.kmMin = Math.max(0, Math.min(1000000, this.kmMin));
      this.kmMax = Math.max(0, Math.min(1000000, this.kmMax));
      if (this.kmMin > this.kmMax) [this.kmMin, this.kmMax] = [this.kmMax, this.kmMin];
    }
    if (group === 'price') {
      this.priceMin = Math.max(0, Math.min(10000000, this.priceMin));
      this.priceMax = Math.max(0, Math.min(10000000, this.priceMax));
      if (this.priceMin > this.priceMax) [this.priceMin, this.priceMax] = [this.priceMax, this.priceMin];
    }
  }

  // Returns a CSS linear-gradient background for the filled portion between thumbs
  getRangeBackground(group: 'year' | 'km' | 'price') {
    let min = 0, max = 100, lo = 0, hi = 100;
    if (group === 'year') {
      min = 1990; max = 2025;
      lo = Math.round(((this.yearMin - min) / (max - min)) * 100);
      hi = Math.round(((this.yearMax - min) / (max - min)) * 100);
    } else if (group === 'km') {
      min = 0; max = 1000000;
      lo = Math.round(((this.kmMin - min) / (max - min)) * 100);
      hi = Math.round(((this.kmMax - min) / (max - min)) * 100);
    } else if (group === 'price') {
      min = 0; max = 10000000;
      lo = Math.round(((this.priceMin - min) / (max - min)) * 100);
      hi = Math.round(((this.priceMax - min) / (max - min)) * 100);
    }
    // gradient: dimmed color up to lo, active color between lo..hi, dimmed after hi
    return `linear-gradient(90deg, #e6e6e6 ${lo}%, #1f6feb ${lo}%, #1f6feb ${hi}%, #e6e6e6 ${hi}%)`;
  }
}
