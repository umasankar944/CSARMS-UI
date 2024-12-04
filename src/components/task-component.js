import React, { useState } from "react";
import "./tasks.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TextField, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Tasks() {
  const [editIndex, setEditIndex] = useState(-1);
  const [editBtn, setEditBtnState] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSchedule, setEditSchedule] = useState(new Date());
  const [editNotification, setEditNotification] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [taskSchedule, setTaskSchedule] = useState(new Date());
  const [notification, setTaskNotification] = useState("");

  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const changeStateOfEdit = (index) => {
    setEditIndex(index);
    setEditName(tasks[index].name);
    setEditDescription(tasks[index].description);
    setEditSchedule(new Date(tasks[index].schedule));
    setEditNotification(tasks[index].notification);
    setShowEditModal(true);
  };

  const editBtnHandle = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editIndex] = { name: editName, description: editDescription, schedule: taskSchedule.toISOString(), notification: editNotification };
    setTasks(updatedTasks);
    setShowEditModal(false);
    toast.success('Task Edited successfully');
  };

  const addTask = (e) => {
    e.preventDefault();
    if (taskName === '' || description === '' || !taskSchedule || notification === '' ) {
      alert("Please fill the Details");
    } else {
      const newTask = {name: taskName, description, schedule: taskSchedule.toISOString(), notification };
      setTasks([...tasks, newTask]);
      setTaskName("");
      setDescription("");
      setTaskSchedule(new Date());
      setTaskNotification("");
      setShowCreateModal(false);
      toast.success('Task Created successfully');
      const formattedSchedule = new Date(taskSchedule).toLocaleString(); 
      toast.success(`Your task- ${taskName} remainder has been set at ${formattedSchedule} through ${notification} notification`);
    }
    
  };

  const getMinTime = () => { const now = new Date(); return now; }; 
  const getMaxTime = () => { return new Date(new Date().setHours(23, 59, 59, 999)); };

  const deleteTask = (index) => {
    setEditBtnState(false);
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    toast.error('Task Deleted successfully');
  };

  const toggleCreateModal = () => setShowCreateModal(!showCreateModal);
  const toggleEditModal = () => setShowEditModal(!showEditModal);

  return (
    <div className="App">
      <div className="item-box">
        <h1>Create. Schedule. Get Remainder. Repeat !!!</h1>
        <button className="btn" onClick={toggleCreateModal}>Create New Task</button>

        {showCreateModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleCreateModal}>&times;</span>
              <h2>Create New Task</h2>
              <div>
                <input
                  placeholder="Task Name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="box"
                  fullWidth
                />
              </div>
              <div>
                <input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="box"
                  fullWidth
                />
              </div>
              <div>
                <DatePicker
                  placeholder="December 2, 2024 12:00 PM"
                  selected={taskSchedule}
                  onChange={(date) => setTaskSchedule(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  minTime={taskSchedule && new Date(taskSchedule).toLocaleDateString() === new Date().toLocaleDateString() ? getMinTime() : new Date().setHours(0,0,0,0)} 
                  maxTime={taskSchedule && new Date(taskSchedule).toLocaleDateString() === new Date().toLocaleDateString() ? getMaxTime() : new Date().setHours(23,59,59,999)}
                  className="box"
                  fullWidth
                />
              </div>
              <div>
               <select id="notification-select" value={notification} onChange={(e) => setTaskNotification(e.target.value)} className="box" fullWidth > 
                <option value="email">Email</option> 
                <option value="phone">Phone</option> 
                <option value="push">Push Notification</option> 
              </select>
              </div>
              <Button onClick={addTask} variant="contained" color="primary">
                Create Task
              </Button>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleEditModal}>&times;</span>
              <h2>Edit Task</h2>
              <div className="input-group">
                <input
                  placeholder="Edit Task name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="box"
                  fullWidth
                />
              </div>
              <div className="input-group">
                <input
                  placeholder="Edit description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="box"
                  fullWidth
                />
              </div>
              <div>
              <DatePicker
                  placeholder="December 2, 2024 12:00 PM"
                  selected={taskSchedule}
                  onChange={(date) => setTaskSchedule(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  minTime={taskSchedule && new Date(taskSchedule).toLocaleDateString() === new Date().toLocaleDateString() ? getMinTime() : new Date().setHours(0,0,0,0)} 
                  maxTime={taskSchedule && new Date(taskSchedule).toLocaleDateString() === new Date().toLocaleDateString() ? getMaxTime() : new Date().setHours(23,59,59,999)}
                  className="box"
                  fullWidth
                />
              </div>
              <div>
              <select id="notification-select" value={notification} onChange={(e) => setTaskNotification(e.target.value)} className="box" fullWidth > 
                <option value="email">Email</option> 
                <option value="phone">Phone</option> 
                <option value="push">Push Notification</option> 
              </select>
              </div>
              <Button onClick={editBtnHandle} variant="contained" color="primary">
                Edit Task
              </Button>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <h4>Your Task list is empty, please add tasks using the Create New Task button.</h4>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Description</th>
                <th>Schedule</th>
                <th>Notification</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.schedule}</td>
                  <td>{task.notification}</td>
                  <td><button onClick={() => changeStateOfEdit(index)}><FaEdit /></button></td>
                  <td><button onClick={() => deleteTask(index)}><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Tasks;
