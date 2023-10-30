import { Button, Input, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const ListItemForm = (props) => {
  const { opened, close, data, setData, listid, loginOpen } = props;

  const addTask = () => {
    const uid = uuidv4();
    const name = ref.current.value;
    const userid = localStorage.getItem("userid");
    if (userid) {
      if (name) {
        const task = {
          id: uid,
          name: name,
          listid: listid,
          status: false,
        };
        fetch(`http://localhost:3000/addTask`, {
          method: "POST",
          body: JSON.stringify({
            id: uid,
            name: name,
            taskboardid: listid,
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
        });
        const newdata = [...data];
        const list = newdata.find((list) => list.id === listid);
        list.tasks.push(task);
        setData(newdata);
        close();
      }
    }
    else {
      close();
      loginOpen();
    }
  };

  const ref = useRef();

  return (
    <Modal opened={opened} onClose={close} title="Create New Task" centered>
      <div className="flex flex-col justify-center">
        <Input.Wrapper label="Name">
          <Input placeholder="Enter the name of Task" ref={ref} autoFocus />
        </Input.Wrapper>

        <Button
          variant="filled"
          color="blue"
          className="mt-5"
          onClick={() => addTask()}
        >
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default ListItemForm;
