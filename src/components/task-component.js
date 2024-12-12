import React, { useState,useEffect,useContext} from "react";
import "./tasks.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TextField, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import { useParams } from "react-router-dom";
import {sendToNotificationQueue} from '../services/auth-service'
import AppContext from "../Context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from "@mui/x-data-grid";
import { styled } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
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
  const [sourceId, setSourceId] = useState("");
  const { fields } = useContext(AppContext);
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
  // const [searchText, setSearchText] = useState('');
  // const [filteredTasks, setFilteredTasks] = useState(tasks);

  // // Function to handle search and filter
  // const handleSearch = (searchValue) => {
  //   setSearchText(searchValue);
  //   const filtered = tasks.filter((task) =>
  //     task.TASK_NAME.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     task.TASK_DESCRIPTION.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     task.TASK_SCHEDULE.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     task.NOTIFICATION.toLowerCase().includes(searchValue.toLowerCase())
  //   );
  //   setFilteredTasks(filtered);
  // };
 
  const [files, setFiles] = React.useState([]);
  // const [roomId, setRoomId] = React.useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles(file); // Save the selected file
    }
  };
  const addTask = async (e) => {
    e.preventDefault();
  
    if (!files || !taskName || !description || !notification || !taskSchedule) {
      toast.error("Please fill the details!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", files); // Append the file
    formData.append("taskName", taskName);
    formData.append("taskDescription", description);
    formData.append("taskSchedule", formatDateForOracle(new Date(taskSchedule)));
    formData.append("notification", notification);
    formData.append("categoryId", cat);

    const formattedDate = formatDateForOracle(new Date(taskSchedule));
    let currentSourceId = '';
    console.log(notification)
    if (notification === "email") {
      currentSourceId = fields.EMAIL; // Assign directly to the local variable
    } else if (notification === "phone") {
      currentSourceId = fields.PHONE; // Assign directly to the local variable
    }
    else{
      currentSourceId = "";
    }
    const notifications_formData = {
      name: taskName,
      description : description,
      scheduler: formattedDate,
      notification:notification,
      source_id: currentSourceId,
      file:files,
    };
  
    try {
      const response = await axios.post(`${API_URL}/tasks`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Task created successfully!");
        fetchTasks(); // Refresh tasks
        setTaskName("");
        setDescription("");
        setFiles(null);
        setShowCreateModal(false);
        if(response.status === 200 || response.status === 201){
          toast.success("Task updated successfully!");
          toast.success(`Task ${taskName} has been scheduled for a remainder at ${formattedDate} using ${notification} notification` );
        }
        const notification_response = await sendToNotificationQueue(notifications_formData);
        if(notification_response.status === 200 || notification_response.status === 201){
          if(notification === 'push' ){
            toast.success(`Reminder for Task ${taskName}. Please Complete the Task ASAP`, { autoClose: false });
          }
          else{
            toast.success("notification sent sucessfully");
          }
  
        }
      }
    } catch (error) {
      toast.error("Failed to create task.");
      console.error(error);
    }
  };
  const columns = [
    {
      field: 'TASK_NAME',
      headerName: 'Task Name',
      flex: 1,
    },
    {
      field: 'TASK_DESCRIPTION',
      headerName: 'Description',
      flex: 2,
    },
    {
      field: 'TASK_SCHEDULE',
      headerName: 'Schedule',
      flex: 1,
    },
    {
      field: 'NOTIFICATION',
      headerName: 'Notification',
      flex: 1,
    },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => changeStateOfEdit(params.row.id)} color="primary">
          <FaEdit />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => deleteTask(params.row.id)} color="secondary">
          <FaTrash />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'TASK_ATTACHMENT',
      headerName: 'Download',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => downloadFile(params.row.id)} color="secondary">
          <DownloadIcon />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
  ];
  const getMinTime = () => { const now = new Date(); return now; }; 
  const getMaxTime = () => { return new Date(new Date().setHours(23, 59, 59, 999)); };
  const downloadFile = (index) => {
    const filePath = tasks[index].TASK_ATTACHMENT; // assuming this is the relative path to the file

    // Base URL for localhost (update this if your server runs on a different port)
    const baseUrl = 'http://localhost:5000/download/'; // Change this to your actual server URL

    // Combine base URL with the file path
    const fullUrl = baseUrl + filePath;

    // Create an anchor element
    const link = document.createElement('a');
    link.href = fullUrl; // Set the full URL of the file
    link.download = filePath.split('/').pop(); // Set the filename to be downloaded

    // Append the link to the DOM temporarily
    document.body.appendChild(link);

    // Trigger the download by simulating a click
    link.click();

    // Remove the link from the DOM after the download is triggered
    document.body.removeChild(link);
};

  const editBtnHandle = async () => {
    const formattedDate = formatDateForOracle(new Date(editSchedule));
    const updatedTask = {
      taskName: editName,
      taskDescription: editDescription,
      taskSchedule: formattedDate,
      notification: editNotification,
      categoryId:cat,
      file:files,
    };
    // Use a local variable for sourceId
    let currentSourceId = '';
    console.log(editNotification)
    if (editNotification === "email") {
      currentSourceId = fields.EMAIL; // Assign directly to the local variable
    } else if (editNotification === "phone") {
      currentSourceId = fields.PHONE; // Assign directly to the local variable
    }
    else{
      currentSourceId = "";
    }
    const formData = {
      name: editName,
      description : editDescription,
      scheduler: formattedDate,
      notification:editNotification,
      source_id: currentSourceId,
      file:files,
    };
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${tasks[editIndex].TASK_ID}`,
        updatedTask
      );
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = response.data;
      setTasks(updatedTasks);
      fetchTasks();
      setShowEditModal(false);
      if(response.status === 200 || response.status === 201){
        toast.success("Task updated successfully!");
        toast.success(`Task ${taskName} has been scheduled for a remainder at ${formattedDate} using ${editNotification} notification` );
      }
      const notification_response = await sendToNotificationQueue(formData);
      if(notification_response.status === 200 || notification_response.status === 201){
        if(notification === 'push' ){
          toast.success(`Reminder for Task ${taskName}. Please Complete the Task ASAP`, { autoClose: false });
        }
        else{
          toast.success("notification sent sucessfully");
        }

      }
      // if(notification_response.status === 200 || notification_response.status === 201){
        
      // }
      // else{
      //   toast.error(`Failed to send out the remainder ${notification_response}`);
      // }
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
  
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const toggleCreateModal = () => setShowCreateModal(!showCreateModal);
  const toggleEditModal = () => setShowEditModal(!showEditModal);

  return (
    <div className="App">
      <ToastContainer />
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
               <option value="" disabled hidden>
                  Select Notification Method
                </option>
                <option value="email">Email</option> 
                <option value="phone">Phone</option> 
                <option value="push">Push Notification</option> 
              </select>
              </div>
              <div>
              <Button
      component="label"
      role={undefined}
      fullWidth
      sx={{
        border: '1px solid #888',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:'8px'
      }}
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileChange}
        multiple
      />
    </Button>
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
              <select id="notification-select" value={editNotification} onChange={(e) => setEditNotification(e.target.value)} className="box" fullWidth > 
              <option value="" disabled hidden>
                Edit Notification Method
              </option>
                <option value="email">Email</option> 
                <option value="phone">Phone</option> 
                <option value="push">Push Notification</option> 
              </select>
              </div>
              <div>
              <Button
      component="label"
      role={undefined}
      fullWidth
      sx={{
        border: '1px solid #888',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:'8px'
      }}
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileChange}
        multiple
      />
    </Button>
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
          <Paper sx={{ height: 400, width: '98.5%', marginRight:'10px', marginLeft:'10px', bgcolor:'white'}}>
      <DataGrid
        rows={tasks.map((task, index) => ({ id: index, ...task }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        sx={{
          '& .MuiDataGrid-row': {
            bgcolor: 'white', // Row background color
            '&:hover': {
              bgcolor: 'grey', // Row background color on hover
            },
            '&.Mui-selected': { bgcolor: 'white', // Row background color on click (selected)
            },
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'white', // Header background color
            color: 'gold',  // Header text color
          },
          '& .MuiDataGrid-cell': {
            color: 'black',  // Text color in cells
          },
        }}
      />
    </Paper>       )}
      </div>
    </div>
  );
}

export default Tasks;
