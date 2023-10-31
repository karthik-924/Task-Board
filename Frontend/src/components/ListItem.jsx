import { Button, ScrollArea } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";
import { useDisclosure } from "@mantine/hooks";
import ListItemForm from "./ListItemForm";
import "./ListItem.css"

const ListItem = (props) => {
  const { id, title, data, maindata, setData,loginOpen } = props;
  const [opened, { open, close }] = useDisclosure(false);
  
  return (
    <Droppable droppableId={id} index={title} key={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="h-fit max-h-[70vh] w-full flex flex-col gap-3 items-center border rounded-lg border-white"
        >
          <p className="text-2xl text-white mt-2 font-bold">{title}</p>
          <div className="flex flex-col gap-5 w-full overflow-x-hidden justify-center items-center">
            <div className="max-h-[53vh] h-fit w-[90%] overflow-x-hidden overflow-y-auto custom-scrollbar">
              {data.map((item, index) => {
                if (item.status===false){
                  return <Task key={index} id={id} item={item} data={maindata} setData={setData} index={index} />;
                }
              })}
              {provided.placeholder}
            </div>
          </div>
          <Button leftSection={<IconPlus size={14} />} variant="outline" className="mb-3" onClick={open}>
            Add Item
          </Button>
          <ListItemForm opened={opened} close={close} data={maindata} setData={setData} listid={id} loginOpen={loginOpen} />
        </div>
      )}
    </Droppable>
  );
};

export default ListItem;
