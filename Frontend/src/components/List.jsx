// import React from 'react'

import { useDisclosure } from "@mantine/hooks";
import ListItem from "./ListItem"
import {BsPlusCircleFill} from 'react-icons/bs'
import ListForm from "./ListForm";


const List = (props) => {
    const { data, setData,loginOpen } = props
    const [opened, { open, close }] = useDisclosure(false);
    
  return (
      <div className='w-full h-fit mb-10 flex justify-center items-center'>
          <div className="w-[90%] h-fit grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5">
              {data.map((list, index) => {
              console.log(list);
              return (
                  <ListItem key={index} id={list.id} title={list.name} data={list.tasks} maindata={data} setData={setData} loginOpen={loginOpen} />
              )
          })}
              <div className="h-fit w-full flex flex-col gap-3 items-center border rounded-lg border-white">
                  <p className="text-2xl text-white mt-2 font-bold">Create new list</p>
                  <BsPlusCircleFill size={80} className='text-white mb-5 cursor-pointer' onClick={()=>open()}/>
                </div>
          </div>
          <ListForm opened={opened} close={close} data={data} setData={setData} loginOpen={loginOpen} />
    </div>
  )
}

export default List
