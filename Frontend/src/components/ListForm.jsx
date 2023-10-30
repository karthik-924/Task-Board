import { Button, FocusTrap, Input, Modal, Notification } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const ListForm = (props) => {
  const { opened, close, data, setData,loginOpen } = props;
  const addList = () => {
    const uid = uuidv4();
    const name = ref.current.value;
    const userid = localStorage.getItem("userid");
    if (userid) {
      if (name) {
        const list = {
          id: uid,
          name: name,
          tasks: [],
        };
        fetch(`http://localhost:3000/addTaskboard`, {
          method: "POST",
          body: JSON.stringify({
            id: uid,
            name: name,
            userId: localStorage.getItem("userid"),
            
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
        setData([...data, list]);
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
    <Modal opened={opened} onClose={close} title="Create New List" centered>
      <div className="flex flex-col justify-center">
        <Input.Wrapper label="Name">
          
            <Input placeholder="Enter the name of Task List" ref={ref} autoFocus />
          
        </Input.Wrapper>

        <Button
          variant="filled"
          color="blue"
          className="mt-5"
          onClick={() => addList()}
        >
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default ListForm;
