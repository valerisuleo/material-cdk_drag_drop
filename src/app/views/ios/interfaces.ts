import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface IApp {
    isActive: boolean;
    genre: string;
    brand: IconDefinition;
    id: number;
}

export interface IFolder {
    isOpen: boolean;
    isActive: boolean;
    genre: string;
    apps: IApp[];
    id: number;
}

export interface IMock {
    apps: IApp[];
    folders: IFolder[];
}
