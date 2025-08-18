
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpDeskComponent } from './help-desk.component';
import { HelpDeskRoutingModule } from './help-desk-routing.module';

@NgModule({
    declarations: [HelpDeskComponent],
    imports: [CommonModule, HelpDeskRoutingModule],
})
export class HelpDeskModule {}

