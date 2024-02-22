import { Component, OnInit } from '@angular/core';
import { mock } from './mock';
import { IApp, IFolder, IMock } from './interfaces';
import {
    CdkDragDrop,
    CdkDragEnter,
    CdkDragExit,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faFolder, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'ios-interface',
    templateUrl: './ios.component.html',
    styleUrls: ['./ios.component.scss'],
})
export class IosComponent implements OnInit {
    public state: IMock = mock;
    public folders: IFolder[] = [];
    public iconClose: IconDefinition = faTimesCircle;
    public iconfolder: IconDefinition = faFolder;
    private hoverTimer: any;
    private blinkingFolder: any;
    public isMenuOpen = false;
    public dropdownPosition = { x: 0, y: 0 };
    public isIpadOn = false;
    public width = 0;

    constructor() {}

    public ngOnInit(): void {
        this.startProgressBar();
    }

    private startProgressBar() {
        const duration = 5000;
        const steps = 50;
        const intervalTime = duration / steps; // 100 updates for 100%

        const interval = setInterval(() => {
            this.width = this.width + 1;
            if (this.width > 100) {
                clearInterval(interval);
                this.isIpadOn = true;
            }
        }, intervalTime);
    }

    public handleRightClick(e: MouseEvent): void {
        this.isMenuOpen = true;

        e.preventDefault();
        const offsetX = window.innerWidth > 1440 ? 600 : 450;
        const offsetY = 100;

        this.dropdownPosition = {
            x: e.clientX - offsetX,
            y: e.clientY - offsetY,
        };
    }

    public createFolder() {
        this.state.folders = [
            ...this.state.folders,
            {
                isActive: false,
                isOpen: false,
                genre: 'untitled folder',
                apps: [],
                id: this.state.folders.length,
            },
        ];

        this.isMenuOpen = false;
    }

    public drop(event: CdkDragDrop<IApp[]>): void {
        console.log(event);

        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    public dragEntered(event: CdkDragEnter<IFolder[]>, current: IFolder): void {
        // Clear any existing timer to prevent multiple triggers
        // console.log('event', event)

        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
        }

        if (this.blinkingFolder) {
            clearInterval(this.blinkingFolder);
        }

        if (!current.isOpen) {
            this.blinkingFolder = setInterval(() => {
                current.isActive = !current.isActive;
            }, 100);
        }

        // Start a new timer
        this.hoverTimer = setTimeout(() => {
            current.isOpen = true;
            current.isActive = true;

            current.genre = this.findPropsWithHighestArrayLength(current);

            if (this.blinkingFolder) {
                clearInterval(this.blinkingFolder);
                this.blinkingFolder = null;
            }
        }, 500);
    }

    public dragExited(event: CdkDragExit<IFolder[]>, current: IFolder): void {
        // Clear the timer if the draggable item leaves the drop list
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
        if (this.blinkingFolder) {
            clearInterval(this.blinkingFolder);
            this.blinkingFolder = null; // Reset the interval reference
        }
        // current.isOpen = false;
        current.isActive = false;
    }

    public onDoubleClick(current: IFolder) {
        current.isOpen = true;
    }

    public handleClose(current: IFolder) {
        current.isOpen = false;
        current.isActive = false;
    }

    private findPropsWithHighestArrayLength(current: IFolder): string {
        const groupBy = current.apps.reduce((acc, item) => {
            acc[item.genre] = acc[item.genre] || [];
            acc[item.genre].push(item.genre);
            return acc;
        }, {});

        let maxLength = 0;
        let maxKey = '';

        for (const key in groupBy) {
            if (groupBy.hasOwnProperty(key)) {
                const arrLength = groupBy[key].length;
                if (arrLength > maxLength) {
                    maxLength = arrLength;
                    maxKey = key;
                }
            }
        }

        return maxKey; // Return the key with the longest array
    }
}
