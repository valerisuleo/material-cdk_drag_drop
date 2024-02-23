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
    public isIpadOn = true;
    public width = 0;
    activeApp;
    hoveredApp;

    constructor() {}

    public ngOnInit(): void {
        this.progressBarStart();
    }

    isFolder = false;

    isDragging: boolean = false;

    dragStart() {
        this.isDragging = true;
    }

    dragEnd() {
        this.isDragging = false;
    }
    private lastElementUnderCursor = null; // Track the last element under the cursor

    handleMouseMove(event) {
        // Early exit if not dragging
        if (!this.isDragging) {
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const elementUnderCursor = document.elementFromPoint(x, y);

        // Check if the element under cursor is the same as the last one
        if (this.lastElementUnderCursor !== elementUnderCursor) {
            // If the element has changed, clear the existing timer
            if (this.hoverTimer) {
                clearTimeout(this.hoverTimer);
                this.hoverTimer = null;
            }

            // Update the lastElementUnderCursor
            this.lastElementUnderCursor = elementUnderCursor;

            // Reset isFolder if not hovering over the target element
            if (!elementUnderCursor || !elementUnderCursor.classList.contains('cazzo')) {
                this.isFolder = false;
            }
        }

        // Only set the timer if hovering over the target element and no timer is currently set
        if (
            elementUnderCursor &&
            elementUnderCursor.classList.contains('cazzo') &&
            !this.hoverTimer
        ) {
            this.hoverTimer = setTimeout(() => {
                // Check again if still on the correct element after 1 second
                const currentElement = document.elementFromPoint(x, y);
                if (currentElement === elementUnderCursor) {
                    this.isFolder = true;
                    console.log('a');
                } else {
                    this.isFolder = false;
                    console.log('b');
                }
                this.hoverTimer = null;
            }, 1000);
        }
    }

    private progressBarStart() {
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

    public drop(event: CdkDragDrop<IApp[]>): void {
        const list = event.container.data;

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }

        console.log('this.isFolder', this.isFolder);

        if (this.isFolder) {
            this.folderCreate(list[event.previousIndex], list[event.currentIndex]);
        }
    }

    private areAppsInAnyFolder(appId1: number, appId2: number): boolean {
        return this.state.folders.some((folder) =>
            folder.apps.some((app) => app.id === appId1 || app.id === appId2)
        );
    }

    private folderCreate(first: IApp, second: IApp) {
        const clone = { ...this.state };
        const newFolder = {} as IFolder;

        newFolder.apps = [];
        newFolder.isOpen = true;
        newFolder.id = this.state.folders.length;
        newFolder.isActive = false;
        newFolder.apps = [...newFolder.apps, first, second];
        newFolder.genre = newFolder.apps[1].genre;

        clone.folders = [...clone.folders, newFolder];
        clone.apps = clone.apps.filter((app) => app.id !== first.id && app.id !== second.id);
        this.state = clone;

        console.log('asss', this.state);
    }

    public dragEntered(event: CdkDragEnter<IFolder[]>, current?: IFolder): void {
        // Clear any existing timer to prevent multiple triggers
        console.log('event', event);

        // if (this.hoverTimer) {
        //     clearTimeout(this.hoverTimer);
        // }

        // if (this.blinkingFolder) {
        //     clearInterval(this.blinkingFolder);
        // }

        // if (!current.isOpen) {
        //     this.blinkingFolder = setInterval(() => {
        //         current.isActive = !current.isActive;
        //     }, 100);
        // }

        // // Start a new timer
        // this.hoverTimer = setTimeout(() => {
        //     current.isOpen = true;
        //     current.isActive = true;

        //     current.genre = this.findPropsWithHighestArrayLength(current);

        //     if (this.blinkingFolder) {
        //         clearInterval(this.blinkingFolder);
        //         this.blinkingFolder = null;
        //     }
        // }, 500);
    }

    public dragExited(event: CdkDragExit<IFolder[]>, current: IFolder): void {
        // Clear the timer if the draggable item leaves the drop list
        // if (this.hoverTimer) {
        //     clearTimeout(this.hoverTimer);
        //     this.hoverTimer = null;
        // }
        // if (this.blinkingFolder) {
        //     clearInterval(this.blinkingFolder);
        //     this.blinkingFolder = null; // Reset the interval reference
        // }
        // // current.isOpen = false;
        // current.isActive = false;
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
