import { Component } from '@angular/core';
import { StatsWidget } from './components/statswidget';

@Component({
  selector: 'app-dashboard',
  imports: [StatsWidget],
  template: `
    <div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-8">
      <app-stats-widget class="contents" />
    </div>
  `,
})
export class Dashboard {}
