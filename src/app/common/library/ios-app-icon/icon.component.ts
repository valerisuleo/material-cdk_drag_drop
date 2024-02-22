import { Component, Input } from '@angular/core';
import { IApp } from '../../../views/ios/interfaces';

@Component({
    selector: 'ios-app',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
})
export class IconIOSComponent {
    @Input() public props: IApp;
    public item: IApp;

    constructor() {}
}
