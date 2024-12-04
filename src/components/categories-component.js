import React, { useState } from "react";
import "./categories.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

function Categories() {
  const [editIndex, setEditIndex] = useState(-1);
  const [editBtn, setEditBtnState] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false);

  const changeStateOfEdit = (index) => {
    setEditIndex(index);
    setEditName(categories[index].name);
    setEditDescription(categories[index].description);
    setShowEditModal(true);
  };

  const editBtnHandle = () => {
    const updatedCategories = [...categories];
    updatedCategories[editIndex] = { name: editName, description: editDescription };
    setCategories(updatedCategories);
    setShowEditModal(false);
    toast.success('Category Edited successfully');
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (categoryName === '' || description === '') {
      alert("Please fill the details");
    } else {
      const newCategory = { name: categoryName, description };
      setCategories([...categories, newCategory]);
      setCategoryName("");
      setDescription("");
      setShowCreateModal(false);
      toast.success('Category Created successfully');
    }
  };

  const deleteCategory = (index) => {
    setEditBtnState(false);
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
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
        {categories.length === 0 ? (
          <h4>Your category list is empty, please add categories using the Create New Category button.</h4>
        ) : (
          <table className="categories-table">
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
              {categories.map((category, index) => (
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

export default Categories;
