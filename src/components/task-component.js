import React, { useState } from "react";
import "./tasks.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

function tasks() {
  const [editIndex, setEditIndex] = useState(-1);
  const [editBtn, setEditBtnState] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSchedule, setEditSchedule] = useState("");
  const [editNotification, setEditNotification] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [taskSchedule, setTaskSchedule] = useState("");
  const [notification, setTaskNotification] = useState("");

  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false);

  const changeStateOfEdit = (index) => {
    setEditIndex(index);
    setEditName(tasks[index].name);
    setEditDescription(tasks[index].description);
    setTaskSchedule(tasks[index].schedule);
    setTaskNotification(tasks[index].notification);
    setShowEditModal(true);
  };

  const editBtnHandle = () => {
    const updatedtasks = [...tasks];
    updatedtasks[editIndex] = { name: editName, description: editDescription, schedule: editSchedule, notification: editNotification };
    settasks(updatedtasks);
    setShowEditModal(false);
    toast.success('Category Edited successfully');
  };

  const addTask = (e) => {
    e.preventDefault();
    if (categoryName === '' || description === '') {
      alert("Please fill in both category name and description");
    } else {
      const newTask = { name: categoryName, description };
      settasks([...tasks, newTask]);
      setCategoryName("");
      setDescription("");
      setShowCreateModal(false);
    }
    toast.success('Category Created successfully');
  };

  const deleteCategory = (index) => {
    setEditBtnState(false);
    const newtasks = tasks.filter((_, i) => i !== index);
    settasks(newtasks);
    toast.error('Category Deleted successfully');
  };

  const toggleCreateModal = () => setShowCreateModal(!showCreateModal); 
  const toggleEditModal = () => setShowEditModal(!showEditModal);

  return (
    <div className="App">
      <div className="item-box">
        <h1>Get things Done!</h1>
        <button className="btn" onClick={toggleCreateModal}>Create New Category</button>

        {showCreateModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleCreateModal}>&times;</span>
              <h2>Create New Category</h2>
              <div>
              <input
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="box"
              />
              </div>
              <div>
              <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="box"
              />
              </div>
              <button onClick={addCategory} className="btn">Create Category</button>
            </div>
          </div>
        )}
        {showEditModal && ( <div className="modal"> 
          <div className="modal-content"> 
            <span className="close" onClick={toggleEditModal}>&times;</span> 
            <h2>Edit Category</h2> 
            <div className="input-group"> 
              <input placeholder="Edit category name" value={editName} onChange={(e) => setEditName(e.target.value)} className="box" /> 
            </div> 
            <div className="input-group"> 
              <input placeholder="Edit description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="box" /> 
            </div> 
            <button onClick={editBtnHandle} className="btn">Edit Category</button> 
          </div> 
        </div> )}
        {tasks.length === 0 ? (
          <p>Your category list is empty, please add tasks using the Create New Category button.</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>View Tasks</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((category, index) => (
                <tr key={index}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td><button>View Tasks</button></td>
                  <td><button onClick={() => changeStateOfEdit(index)}><FaEdit /></button></td>
                  <td><button onClick={() => deleteCategory(index)}><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editBtn && (
          <div className="edit-item">
            <input className="input-box" placeholder="Edit category name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <input className="input-box" placeholder="Edit description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            <button className="add-btn" onClick={editBtnHandle}>Edit item</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default tasks;
