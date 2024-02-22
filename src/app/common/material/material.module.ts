import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [CommonModule, DragDropModule],
    exports: [DragDropModule],
    declarations: [],
    providers: [],
})
export class MaterialModule {}
