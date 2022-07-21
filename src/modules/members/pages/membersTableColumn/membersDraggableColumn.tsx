import { Card } from 'common/draggableCard/draggableCard';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import { FC, Fragment, ReactElement, useCallback, useState } from 'react';
import dragIcon from '../../../../assets/images/drag.svg';
import { ColumNames } from '../MembersTableData';


const MembersDraggableColumn: FC = () => {
    const [columns, setColumns] = useState<Array<ColumnNameProps>>(ColumNames);

    // Function to move the cards or list in drag and drop manner.
    const moveCardHandler = useCallback((dragIndex: number, hoverIndex: number) => {
        // if (dragItem) {
        setColumns(prevCard => {
            const dragItem = prevCard[dragIndex];
            const coppiedStateArray = [...prevCard];

            // remove item by "dragIndex"
            coppiedStateArray.splice(dragIndex, 1);

            // remove item by "hoverIndex" and put "dragItem" instead
            coppiedStateArray.splice(hoverIndex, 0, dragItem);

            return coppiedStateArray;
        });
        // }
    }, []);

    // Renders the actual array in to useCallback to prevent re-renderization.
    const renderCard = useCallback((card: ColumnNameProps, index: number, children: ReactElement) => {
        return (
            <Card key={card.id} index={index} id={card.id} moveCard={moveCardHandler}>
                {children}
            </Card>
        );
    }, []);

    return (
        <Fragment>
            {columns.map((item: ColumnNameProps, index: number) =>
                renderCard(
                    item,
                    index,
                    <div key={index} className="flex flex-col mt-6">
                        <div className="flex justify-between items-center px-2 cursor-pointer rounded-0.3 h-2.81 bg-white box-border border-table shadow-inputShadow">
                            <div className="flex items-center gap-1">
                                <div>
                                    <input type="checkbox" name="" id="" />
                                </div>
                                <div className="font-Poppins font-normal text-infoBlack text-trial leading-1.31">{item.name}</div>
                            </div>
                            <div>
                                <img src={dragIcon} alt="" />
                            </div>
                        </div>
                    </div>,
                ),
            )}
        </Fragment>
    );
};

export default MembersDraggableColumn;
