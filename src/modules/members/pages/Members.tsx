import MembersCard from 'common/membersCard/membersCard';
import Modal from 'react-modal';
import  './Members.css';


Modal.setAppElement('#root');
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import editIcon from '../../../assets/images/edit.svg';
import dragIcon from '../../../assets/images/drag.svg';
import slackIcon from '../../../assets/images/slack.svg';
import { useState } from 'react';
import Button from 'common/button';



const Members = () => {
  const data = [
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
    {
      name: 'Randy Dias',
      platform: {
        img1: slackIcon,
        img2: slackIcon,
      },
      tags: '---',
      lastActivity: '30 April 2022',
      organization: 'Neoito',
      location: 'Texas',
      email: 'randy123@mail.com',
    },
  ];
  const dummyData = [
    {
      name: 'Hari',
      id: '1',
    },
    {
      name: 'Amal',
      id: '2',
    },
    {
      name: 'Harik',
      id: '3',
    },
    {
      name: 'Amalk',
      id: '4',
    },
  ];
  const [isModalOpen, setisModalOpen] = useState(false);
  const [list, setList] = useState(dummyData);

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(dummyData);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    console.log(result);
    return result;
  };

  const onDragEnd = (result: any) => {
    console.log(result);
    const items = reorder(list, result.source.index, result.destination.index);
    setList(items);
  };

  const handleModalClose=()=>{
    setisModalOpen(false);
  }
  return (
  <div className="container flex flex-col">
     <h3 className="font-Poppins font-semibold text-infoBlack text-infoData leading-9">
        Members
      </h3>
      <div className="member-card">
        <MembersCard/>
      </div>
    <div className="memberTable mt-1.8">
      <div className="py-2 overflow-x-auto mt-1.868">
        <div className="inline-block min-w-full overflow-hidden align-middle w-61.68 rounded-t-0.6 border-table no-scroll-bar overflow-x-auto overflow-y-auto h-[100vh] sticky top-0 fixTableHead">
          <table className="min-w-full relative  rounded-t-0.6 ">
            <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky ">
              <tr className="min-w-full">
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray ">
                  Name
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Platforms Connected
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Tags
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Last Activity
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Organization
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Location
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((data, i) => (
                <tr className="border-b" key={i}>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-x-2">
                      <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        <img src={data.platform.img1} alt="" />
                      </div>
                      <div className="font-Poppins  font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        <img src={data.platform.img1} alt="" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.tags}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.lastActivity}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.organization}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.email}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="fixed bottom-10 right-32">
            <div
              className="btn-drag flex items-center justify-center cursor-pointer shadow-dragButton rounded-0.6 "
              onClick={() => setisModalOpen(true)}
            >
              <img src={editIcon} alt="" />
            </div>
          </div>
          <Modal
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={true}
            onRequestClose={() => setisModalOpen(false)}
            className="w-24.31 mx-auto mt-[147px]  pb-20 bg-white border-fetching-card rounded-lg shadow-modal"
          >
            <div className="flex flex-col px-1.68 relative">
              <h3 className="font-Inter font-semibold text-xl mt-1.8  leading-6">
                Customize Column
              </h3>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="1212323">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} className="pb-10">
                      {dummyData.map((item: any, index: number) => (
                        <Draggable
                          draggableId={item.id}
                          key={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="flex flex-col mt-6">
                                <div className="flex drag-item  justify-between items-center px-2 cursor-pointer">
                                  <div className="flex items-center gap-1">
                                    <div>
                                      <input type="checkbox" name="" id="" />
                                    </div>
                                    <div className="font-Poppins font-normal text-infoBlack text-trial leading-1.31">
                                      {item.name}
                                    </div>
                                  </div>
                                  <div>
                                    <img src={dragIcon} alt="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <div className="felx buttons absolute -bottom-16 right-[27px]">
                   <Button
                      text="CANCEL"
                      type="submit"
                      className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border  h-2.81 w-5.25 rounded border-none"
                      onClick={handleModalClose}
                   />
                    <Button
                      text="SAVE"
                      type="submit"
                      className="save text-white font-Poppins text-error font-medium leading-5 cursor-pointer rounded shadow-contactBtn w-7.68 border-none h-2.81"
                   />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Members;
