import React, { useRef } from "react";
import { Button, Input, Modal, PasswordInput } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";

const Login = (props) => {
  const { opened, close, user, setUser, setUserid } = props;
  const nameref = useRef();
  const passwordref = useRef();
  const login = () => {
    const username = nameref.current.value;
    const password = passwordref.current.value;
    fetch(`http://localhost:3000/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        if (data.success) {
          setUser(username);
          setUserid(data.id);
          localStorage.setItem("userid", data.id);
          close();
        } else {
          alert(data.message);
        }
      });
    });
  };
  const register = () => {
    const username = nameref.current.value;
    const password = passwordref.current.value;
    const id = uuidv4();
    console.log(username, password, id);
    fetch(`http://localhost:3000/register`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        if (data.success) {
          setUser(username);
          setUserid(id);
          localStorage.setItem("userid", id);
          // localStorage.setItem("username", username);
          close();
        } else {
          alert(data.message);
        }
      });
    });
  };

  return (
    <Modal opened={opened} onClose={close} title="Login or Register" centered>
      <div className="flex flex-col justify-center">
        <Input.Wrapper label="Username">
          <Input placeholder="Enter username" ref={nameref} autoFocus />
        </Input.Wrapper>
        <PasswordInput
          label="Enter password"
          placeholder="Enter password"
          ref={passwordref}
        />
        <div className="flex gap-10 justify-center items-center">
          <Button
            variant="filled"
            color="blue"
            className="mt-5"
            onClick={() => login()}
          >
            Login
          </Button>
          <Button
            variant="filled"
            color="blue"
            className="mt-5"
            onClick={() => register()}
          >
            Register
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Login;
