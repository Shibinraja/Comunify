import { ReactElement } from 'react';

export type ColumnNameProps = {
  name: string;
  id: number;
};

export type DraggableCardProps = {
  id: number;
  index: number;
  moveCard: (dragIndex:number , hoverIndex:number)=> void;
  children: ReactElement
}