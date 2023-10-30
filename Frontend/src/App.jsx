import { useEffect, useState } from "react";

import { DragDropContext } from "react-beautiful-dnd";
import "./App.css";
import List from "./components/List";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import { useDisclosure } from "@mantine/hooks";
// import { useDisclosure } from '@mantine/hooks';

function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState("");
  const [userid, setUserid] = useState(localStorage.getItem("userid")||"");
  const [opened, { open, close }] = useDisclosure(false);
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const list = data.find((list) => list.id === source.droppableId);
    const task = list.tasks.find((task) => task.id === draggableId);
    list.tasks.splice(source.index, 1);
    const destinationList = data.find(
      (list) => list.id === destination.droppableId
    );
    console.log(draggableId, destination.droppableId);
    fetch(`http://localhost:3000/updateTask`, {
      method: "POST",
      body: JSON.stringify({
        id: draggableId.toString(),
        taskboardid: destination.droppableId.toString(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        if (data.success) {
          console.log(data);
        } else {
          alert(data.message);
        }
      });
    }
    );
    destinationList.tasks.splice(destination.index, 0, task);
    setData([...data]);
  };

  useEffect(() => {
    // console.log(localStorage.getItem("userid"));
    if (userid) {
      console.log(userid);
      fetch(`http://localhost:3000/getTaskboards`, {
        method: "POST",
        body: JSON.stringify({
          userId: userid,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json().then((data) => {
          if (data.success) {
            console.log(data);
            setData(data.taskboards)
            setUser(data.userName)
          } else {
            alert(data.message);
          }
        });
      });
    }
  }, [userid]);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="max-w-screen min-h-screen bg-[#1e1e2a] relative flex flex-col gap-10">
        <NavBar username={user} open={open} setUser={setUser} setUserid={setUserid} setData={setData} />
        <List data={data} setData={setData} loginOpen={open} />
        <Login opened={opened} close={() => close()} user={user} setUser={setUser} setUserid={setUserid} />
      </div>
    </DragDropContext>
  );
}

export default App;
