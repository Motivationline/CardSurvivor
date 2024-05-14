declare class CircleType {
    constructor(element: HTMLElement);
    radius(value: number): CircleType;
    radius(): number;
    dir(value: 1 | -1): CircleType;
    dir(): number;
    forceWidth(value: boolean): CircleType;
    forceWidth(): boolean;
    forceHeight(value: boolean): CircleType;
    forceHeight(): boolean;
    refresh(): CircleType;
    destroy(): CircleType;
}