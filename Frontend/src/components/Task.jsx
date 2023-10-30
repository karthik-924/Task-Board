import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Task = (props) => {
    const { id, item, data, setData, index } = props;
    const updateTask = (id) => {
        const status = document.getElementById(id).checked;
        fetch(`http://localhost:3000/updateTaskStatus`, {
            method: "POST",
            body: JSON.stringify({
                id: id.toString(),
                status: status,
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
        console.log(newdata, item);
        const taskboardid = item.listid||item.taskboardid;
        const list = newdata.find((list) => list.id === taskboardid);
        console.log(list);
        const task = list.tasks.find((task) => task.id === id);
        task.status = status;
        setData(newdata);
    };

    
    if (item !== undefined) {

        return (
            <Draggable draggableId={item.id.toString()} index={index}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="flex items-center gap-5 hover:scale-105 bg-[#262839] p-5 mb-5"
                    >
                        <input
                            type="checkbox"
                            className=" h-5 w-5"
                            name={item.name}
                            id={item.id}
                            onChange={() => updateTask(item.id)}
                        />
                        <p className="text-xl text-white">{item.name}</p>
                    </div>
                )}
            </Draggable>
        );
    }
};

export default Task;
