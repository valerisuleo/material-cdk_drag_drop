import { NgModule } from '@angular/core';
import { IosComponent } from './ios.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../common/material/material.module';
import { IconIOSComponent } from '../../common/library/ios-app-icon/icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [CommonModule, MaterialModule, FontAwesomeModule],
    exports: [IosComponent, IconIOSComponent],
    declarations: [IosComponent, IconIOSComponent],
    providers: [],
})
export class IOSModule {}
