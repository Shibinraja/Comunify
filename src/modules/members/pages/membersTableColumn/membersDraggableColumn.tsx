import React, { ChangeEvent, Fragment, ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from 'common/draggableCard/DraggableCard';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import dragIcon from '../../../../assets/images/drag.svg';
import { ColumNames } from '../MembersTableData';
import { DraggableComponentsProps } from 'modules/members/interface/members.interface';
import membersSlice from 'modules/members/store/slice/members.slice';
import { useAppSelector } from '@/hooks/useRedux';
import { useParams } from 'react-router-dom';

const MembersDraggableColumn: React.FC<DraggableComponentsProps> = ({ MembersColumn, handleModalClose }) => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  const customizedColumn = useAppSelector((state) => state.members.customizedColumn);
  const [columns, setColumns] = useState<Array<ColumnNameProps>>(ColumNames);

  // Function to move the cards or list in drag and drop manner.
  const moveCardHandler = useCallback((dragIndex: number, hoverIndex: number) => {
    // if (dragItem) {
    setColumns((prevCard) => {
      const dragItem = prevCard[dragIndex];
      const copiedStateArray = [...prevCard];

      // remove item by "dragIndex"
      copiedStateArray.splice(dragIndex, 1);

      // remove item by "hoverIndex" and put "dragItem" instead
      copiedStateArray.splice(hoverIndex, 0, dragItem);

      return copiedStateArray;
    });
    // }
  }, []);

  // Renders the actual array in to useCallback to prevent re-renderization.
  const renderCard = useCallback(
    (card: ColumnNameProps, index: number, children: ReactElement) => (
      <Card key={card.id} index={index} id={card.id} moveCard={moveCardHandler} accepts={card.isDraggable}>
        {children}
      </Card>
    ),
    []
  );

  //Set new column change if the initial order changes.
  useEffect(() => {
    if (customizedColumn?.length > 1) {
      setColumns(customizedColumn);
    }
  }, [customizedColumn]);

  useEffect(() => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!MembersColumn) {
      dispatch(membersSlice.actions.membersColumnsUpdateList({ columnData: columns, workspaceId: workspaceId! }));
      handleModalClose();
    }
  }, [MembersColumn]);

  // Handle checkbox functionality to toggle between the required column names.
  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const columnName: string = event.target.name;

    setColumns((prevState) => {
      const copiedStateArray = [...prevState];

      const memberDataIndex = copiedStateArray.findIndex((member: ColumnNameProps) => member.id === columnName);

      const updatedMemberObj = { ...copiedStateArray[memberDataIndex], isDisplayed: event.target.checked };

      const updatedMemberData = [...copiedStateArray.slice(0, memberDataIndex), updatedMemberObj, ...copiedStateArray.slice(memberDataIndex + 1)];

      return updatedMemberData;
    });
  };

  return (
    <Fragment>
      {columns.map((item: ColumnNameProps, index: number) =>
        renderCard(
          item,
          index,
          <div key={index} className="flex flex-col mt-6">
            <div className="flex justify-between items-center px-2 rounded-0.3 h-2.81 bg-white box-border border-table shadow-inputShadow">
              <div className="flex items-center gap-1">
                <div>
                  <input
                    type="checkbox"
                    name={item.id}
                    id={item.id}
                    disabled={item.id === 'name' ? true : item.id === 'platforms' ? true : false}
                    className={`checkbox  ${item.id === 'name' || item.id === 'platforms' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    checked={item.isDisplayed}
                    onChange={handleCheckBox}
                  />
                </div>
                <div className={`font-Poppins font-normal ${item.isDisplayed ? 'text-infoBlack' : 'text-slimGray'} text-trial leading-1.31`}>
                  {item.name}
                </div>
              </div>
              <div>
                <img src={dragIcon} alt="" />
              </div>
            </div>
          </div>
        )
      )}
    </Fragment>
  );
};

export default MembersDraggableColumn;
