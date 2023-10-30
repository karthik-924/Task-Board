// import React from 'react'

import { Button } from "@mantine/core"

const NavBar = (props) => {
    
  const { username, open, setUser, setUserid,setData } = props
  const logout = () => {
    setUser("")
    setUserid("")
    setData([])
    localStorage.removeItem("userid")
  }
    
  return (
    <div className="bg-gray-500 text-black sticky z-50 top-0 w-full h-16 flex justify-between items-center p-5">
      <p className=" font-bold text-2xl">Welcome {username ? username : ""}</p>
      {username === "" ?
        <Button variant="filled" onClick={() => open()}>Login</Button> :
        <Button variant="filled" onClick={() => logout()}>Logout</Button>
  }
    </div>
  )
}

export default NavBar
