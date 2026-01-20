import React, { useState, forwardRef, useEffect } from 'react';
import StylesAddModalElement from './AddModalElement.module.css';
import ModalTaskList from '../ModalTaskList/ModalTaskList';
import { useDispatch } from 'react-redux';
import { closeModal1, toggleLoader } from '../../../Redux/slice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { Url } from '../../../Utils/Url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddModalElement = () => {
    const baseUrl = Url();
    const [selectedPriority, setSelectedPriority] = useState(null);
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const uId = localStorage.getItem('id');
    const myBoard = 'toDo';
    const [checklists, setChecklists] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [completedCount, setCompletedCount] = useState(0);

    const handleCloseModal = () => {
        dispatch(closeModal1());
    };

    const handlePriorityClick = (priority) => {
        setSelectedPriority(priority);
    };

    const handleTaskCheck = (taskId, completed) => {
        console.log('Task checkbox clicked - Task ID:', taskId, 'Completed:', completed);
    };

    const handleTaskDelete = (taskId) => {
        console.log('Task delete button clicked - Task ID:', taskId);
    };

    // Update completed count when checklists change
    useEffect(() => {
        const count = checklists.filter(item => item.isChecked).length;
        setCompletedCount(count);
    }, [checklists]);

    const handleSave = () => {
        // Validate required fields
        if (!taskTitle.trim()) {
            toast.error('Please enter a task title');
            return;
        }

        if (!selectedPriority) {
            toast.error('Please select a priority');
            return;
        }

        // Filter out empty tasks from the checklist
        const nonEmptyChecklist = checklists.filter(item => item.inputValue.trim() !== '');

        // Check if there are any non-empty tasks
        if (nonEmptyChecklist.length === 0) {
            toast.error('Please add at least one task');
            return;
        }

        const dueDate = startDate ? startDate : null;
        const userId = uId;
        const board = myBoard;

        const checklist = nonEmptyChecklist.map(item => ({
            taskName: item.inputValue,
            completed: item.isChecked
        }));

        const data = {
            title: taskTitle,
            priority: selectedPriority,
            checklist,
            dueDate,
            userId,
            board
        };

        console.log(data);
        
        dispatch(toggleLoader());
        const token = localStorage.getItem('token');
        axios.post(`${baseUrl}/api/addtask`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Task added successfully:', response.data);
            toast.success(response.data.message);
            handleCloseModal();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch(error => {
            console.error('Error adding task:', error);
            toast.error(error.response?.data?.message || 'Failed to add task');
        })
        .finally(() => {
            dispatch(toggleLoader());
        });
    };

    const DateInput = forwardRef(({ value, onClick }, ref) => (
        <button
            type="button"
            className={StylesAddModalElement.button1}
            onClick={onClick}
            ref={ref}
        >
            {value || "Select Due Date"}
        </button>
    ));

    return (
        <>
            <div className={StylesAddModalElement.addModalElement}>
                {/* Title Section */}
                <div className={StylesAddModalElement.titleSection}>
                    <div className={StylesAddModalElement.title}>
                        Title<span className={StylesAddModalElement.asterisk}> *</span>
                    </div>
                    <div>
                        <input 
                            id="taskTitle" 
                            type='text' 
                            className={StylesAddModalElement.inputTitle} 
                            placeholder='Enter Task Title'
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                        />
                    </div>
                </div>

                {/* Priority Section */}
                <div className={StylesAddModalElement.prioritySection}>
                    <span className={StylesAddModalElement.priorityLabel}>
                        Select Priority<span className={StylesAddModalElement.asterisk}>*</span>
                    </span>
                    <div className={StylesAddModalElement.priorityOptions}>
                        <button 
                            type="button"
                            className={selectedPriority === "HIGH PRIORITY" ? StylesAddModalElement.addPriorityColor : StylesAddModalElement.addPriority} 
                            onClick={() => handlePriorityClick("HIGH PRIORITY")}
                            aria-label="High Priority"
                        >
                            <img src='Assets/high.svg' alt='High Priority' />
                            <span>HIGH PRIORITY</span>
                        </button>
                        <button 
                            type="button"
                            className={selectedPriority === "MODERATE PRIORITY" ? StylesAddModalElement.addPriorityColor : StylesAddModalElement.addPriority} 
                            onClick={() => handlePriorityClick("MODERATE PRIORITY")}
                            aria-label="Moderate Priority"
                        >
                            <img src='Assets/moderate.svg' alt='Moderate Priority' />
                            <span>MODERATE PRIORITY</span>
                        </button>
                        <button 
                            type="button"
                            className={selectedPriority === "LOW PRIORITY" ? StylesAddModalElement.addPriorityColor : StylesAddModalElement.addPriority} 
                            onClick={() => handlePriorityClick("LOW PRIORITY")}
                            aria-label="Low Priority"
                        >
                            <img src='Assets/low.svg' alt='Low Priority' />
                            <span>LOW PRIORITY</span>
                        </button>
                    </div>
                </div>

                {/* Checklist Section */}
                <div className={StylesAddModalElement.checklistSection}>
                    <span className={StylesAddModalElement.checklistLabel}>
                        Checklist ({completedCount}/{checklists.length})<span className={StylesAddModalElement.asterisk}>*</span>
                    </span>
                    <div className={StylesAddModalElement.checklist}>
                        <ModalTaskList 
                            checklists={checklists} 
                            setChecklists={setChecklists} 
                            onTaskCheck={handleTaskCheck} 
                            onTaskDelete={handleTaskDelete} 
                        />
                    </div>
                </div>

                {/* Buttons Section */}
                <div className={StylesAddModalElement.buttonsContainer}>
                    <div className={StylesAddModalElement.leftButtons}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            customInput={<DateInput />}
                            placeholderText='Select Due Date'
                        />
                    </div>
                    <div className={StylesAddModalElement.rightButtons}>
                        <button 
                            type="button"
                            className={StylesAddModalElement.cancel} 
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className={StylesAddModalElement.save} 
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default AddModalElement;