import React, { useState, useEffect,useContext } from "react";
import "./categories.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import AppContext from "../Context/AppContext";


function Categories() {
  const [editIndex, setEditIndex] = useState(-1);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewCatId,setViewCatId]= useState("");
  const { fields } = useContext(AppContext);
  let user_id = fields.USERID;
  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/categories/${fields.USERID}`);
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    }
  };

 
  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCreateModal = () => setShowCreateModal(!showCreateModal);
  const toggleEditModal = () => setShowEditModal(!showEditModal);

  const addCategory = async (e) => {
    e.preventDefault();
    if (categoryName === "" || description === "") {
      alert("Please fill the details");
      return;
    }

    try {
      const newCategory = {
        name:categoryName,
        description:description,
        userId:user_id
      };
      const response = await axios.post("http://localhost:5000/categories", newCategory)
      setCategories([...categories, response.data]);
      setShowCreateModal(false);
      toast.success("Category created successfully");
      fetchCategories();
      setCategoryName("");
      setDescription("");
    } catch (error) {
      toast.error(`Failed to create category ${error}`);
      console.error(error);
    }
  };

  const deleteCategory = async (index) => {
    const categoryId = categories[index].CATEGORYID; // Assuming `_id` is the unique identifier
    try {
      await axios.delete(`http://localhost:5000/categories/${categoryId}`);
      setCategories(categories.filter((_, i) => i !== index));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  const changeStateOfEdit = (index) => {
    setEditIndex(index);
    setEditName(categories[index].CATEGORYNAME);
    setEditDescription(categories[index].CATEGORYDESCRIPTION);
    setShowEditModal(true);
  };

  const editBtnHandle = async () => {
    const categoryId = categories[editIndex].CATEGORYID; // Assuming `_id` is the unique identifier
    try {
      const response = await axios.put(
        `http://localhost:5000/categories/${categoryId}`,
        {
          name: editName,
          description: editDescription,
        }
      );
      // const updatedCategories = [...categories];
      // updatedCategories[editIndex] = response.data;
      // setCategories(updatedCategories);
      fetchCategories();
      setShowEditModal(false);
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    }
  };
  const Navigate = useNavigate();
 const viewTasks=(cat)=>{
      // setViewCatId(cat);
      Navigate(`/tasks/${cat}`)
 }
  return (
    <div className="App">
      <ToastContainer />
      <div className="item-box">
        <h1>Manage Categories</h1>
        <button className="btn" onClick={toggleCreateModal}>
          Create New Category
        </button>

        {showCreateModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleCreateModal}>
                &times;
              </span>
              <h2>Create New Category</h2>
              <input
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="box"
              />
              <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="box"
              />
              <button onClick={addCategory} className="btn">
                Create Category
              </button>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleEditModal}>
                &times;
              </span>
              <h2>Edit Category</h2>
              <input
                placeholder="Edit category name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="box"
              />
              <input
                placeholder="Edit description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="box"
              />
              <button onClick={editBtnHandle} className="btn">
                Edit Category
              </button>
            </div>
          </div>
        )}

        {categories.length === 0 ? (
          <h4>Your category list is empty. Please add categories.</h4>
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
                  <td>{category.CATEGORYNAME}</td>
                  <td>{category.CATEGORYDESCRIPTION}</td>
                  <td>

    <Button onClick={()=>viewTasks(category.CATEGORYID)}>View Tasks</Button>

</td>

                  <td>
                    <button onClick={() => changeStateOfEdit(index)}>
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => deleteCategory(index)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Categories;
