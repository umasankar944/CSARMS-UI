import { useState } from "react";
import "./categories.css";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";


function Categories() {
  const [editIndex,setEditIndex]=useState(-1);
  const [editBtn, setEditBtnState] = useState(false);
  const [edit, setEdit] = useState("");
  const [task,setTask]=useState("");
  const [tasks,setTasks] = useState([]);
 
  const changeStateOfEdit = (value) => {

    console.log(value);
    setEditIndex(value);
    setEdit(tasks[value]);
    setEditBtnState(true);
  }
  const editBtnHandlde =()=>{
    console.log(editIndex);
    const newtodo=[...tasks];
    newtodo[editIndex]=edit;
    console.log(newtodo);
    setTasks(newtodo);
    setEditBtnState(false);
  }
  const  addtask=e=>{
    setEditBtnState(false);
    e.preventDefault();
    if (task===''){
      alert("task is empty fill the task")
    }
    else{
      const newtodo=[...tasks,task];
      setTasks(newtodo); 
      setTask("");
    }
    
    
  }
  const deleteTask=(val)=>{
    setEditBtnState(false);
     const newtodo=tasks.filter((task,index)=>index!==val);
     setTasks(newtodo);
  }
  // console.log(tasks);
  return (
    <div className="App">
      <div className="todolist-box">
        <h1>Get things Done !</h1>
        <div className="add-item">
          <input
            placeholder="what is the task today!"
            className="input-box"
            value={task}
            onChange={(e)=>setTask(e.target.value)}
          ></input>
          <button className="add-btn"type="submit" onClick={addtask}>Add item</button>
        </div>
        {editBtn ? (
          <>
            <div className="edit-item">
              <input className="input-box" placeholder="what is the task today!" value={edit} onChange={(e)=>setEdit(e.target.value)}></input>
              <button className="add-btn" type="submit" onClick={editBtnHandlde}>Edit item</button>
            </div>
          </>
        ) : (
          <div></div>
        )}

        {tasks.map((value) => {
          return (
            <div key={value}>
              <div className="item">
                <div className="item-text">{value}</div>
                <div className="icons">
                  <span onClick={() => changeStateOfEdit(tasks.indexOf(value))}>
                    <FaEdit />
                  </span>
                  <span onClick={()=>deleteTask(tasks.indexOf(value))}>
                    <FaTrash />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;
