import React, { useState,useEffect } from "react";
import "./tasks.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TextField, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import { useParams } from "react-router-dom";
const API_URL = "http://localhost:5000";
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
  const { cat } = useParams();
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks/${cat}`);
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks.");
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  

  const changeStateOfEdit = (index) => {
    setEditIndex(index);
    setEditName(tasks[index].TASK_NAME);
    setEditDescription(tasks[index].TASK_DESCRIPTION);
    setEditSchedule(new Date(tasks[index].TASK_SCHEDULE));
    setEditNotification(tasks[index].NOTIFICATION);
    setShowEditModal(true);
  };

  const formatDateForOracle = (date) => {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const addTask = async (e) => {
    e.preventDefault();
    const formattedDate = formatDateForOracle(new Date(taskSchedule));
    const newTask = {
      taskName,
      taskDescription:description,
      taskSchedule: formattedDate,
      notification,
      categoryId:cat,
    };
    try {
      const response = await axios.post(`${API_URL}/tasks`, newTask);
      setTasks([...tasks, response.data]);
      toast.success("Task created successfully!");
      setShowCreateModal(false);
      fetchTasks();
      setTaskName('');
      setDescription("");
    } catch (error) {
      toast.error("Failed to create task.");
    }
  };
  

  const getMinTime = () => { const now = new Date(); return now; }; 
  const getMaxTime = () => { return new Date(new Date().setHours(23, 59, 59, 999)); };

  const editBtnHandle = async () => {
    const formattedDate = formatDateForOracle(new Date(editSchedule));
    const updatedTask = {
      taskName: editName,
      taskDescription: editDescription,
      taskSchedule: formattedDate,
      notification: editNotification,
      categoryId:cat,
    };
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${tasks[editIndex].TASK_ID}`,
        updatedTask
      );
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = response.data;
      setTasks(updatedTasks);
      toast.success("Task updated successfully!");
      fetchTasks();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };

  const deleteTask = async (index) => {
    try {
      await axios.delete(`${API_URL}/tasks/${tasks[index].TASK_ID}`);
      setTasks(tasks.filter((_, i) => i !== index));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task.");
    }
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
                  selected={editSchedule}
                  onChange={(date) => setEditSchedule(date)}
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
              <select id="notification-select" value={notification} onChange={(e) => setEditNotification(e.target.value)} className="box" fullWidth > 
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
                  <td>{task.TASK_NAME}</td>
                  <td>{task.TASK_DESCRIPTION}</td>
                  <td>{task.TASK_SCHEDULE}</td>
                  <td>{task.NOTIFICATION}</td>
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
