import React from 'react';
import StylesModalTaskListEdit from './ModalTaskListEdit.module.css';

const ModalTaskListEdit = ({ checklists, setChecklists, onTaskCheck, onTaskDelete }) => {

  const handleAddNewClick = () => {
    const newChecklistId = `checklist-${Date.now()}`;
    const newChecklist = {
      _id: newChecklistId,
      taskName: '',
      completed: false,
    };
    setChecklists([...checklists, newChecklist]);
  };

  const handleInputChange = (e, id) => {
    const updatedChecklists = checklists.map((checklist) => {
      if (checklist._id === id) {
        return { ...checklist, taskName: e.target.value };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
  };

  const handleCheckboxChange = (id) => {
    const updatedChecklists = checklists.map((checklist) => {
      if (checklist._id === id) {
        return { ...checklist, completed: !checklist.completed };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
    // Pass the updated data to the parent component
    onTaskCheck(id, updatedChecklists.find(checklist => checklist._id === id).completed);
  };

  const handleDeleteClick = (id) => {
    const filteredChecklists = checklists.filter((checklist) => checklist._id !== id);
    setChecklists(filteredChecklists);
    // Pass the updated data to the parent component
    onTaskDelete(id);
  };

  return (
    <>
      {checklists.map((checklist) => (
        <div 
          key={checklist._id} 
          className={`${StylesModalTaskListEdit.checklist} ${checklist.completed ? StylesModalTaskListEdit.completed : ''}`}
        >
          <input
            type="checkbox"
            checked={checklist.completed}
            onChange={() => handleCheckboxChange(checklist._id)}
            className={StylesModalTaskListEdit.checkbox}
            aria-label={`Mark task "${checklist.taskName || 'unnamed task'}" as ${checklist.completed ? 'incomplete' : 'complete'}`}
          />
          <input
            type="text"
            placeholder="Add a Task"
            value={checklist.taskName}
            onChange={(e) => handleInputChange(e, checklist._id)}
            className={StylesModalTaskListEdit.inputTask}
            aria-label="Task input"
          />
          <button 
            className={StylesModalTaskListEdit.deleteButton} 
            onClick={() => handleDeleteClick(checklist._id)}
            aria-label={`Delete task "${checklist.taskName || 'unnamed task'}"`}
          >
            <img src="Assets/delete.svg" alt="Delete" />
          </button>
        </div>
      ))}
      
      <button 
        className={StylesModalTaskListEdit.addButton} 
        onClick={handleAddNewClick}
        aria-label="Add new task"
      >
        <img src='Assets/AddButton.svg' alt='Add' />&nbsp;&nbsp;Add New
      </button>
    </>
  );
};

export default ModalTaskListEdit;