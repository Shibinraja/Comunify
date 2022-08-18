import { ReactElement } from 'react';

export type ColumnNameProps = {
  name: string;
  id: string;
  isDisplayed:boolean;
  isDraggable:string;
};

export type DraggableCardProps = {
  id: string;
  index: number;
  // eslint-disable-next-line no-unused-vars
  moveCard: (dragIndex:number, hoverIndex:number)=> void;
  children: ReactElement;
  accepts?:string
}
