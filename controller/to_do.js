const mongoose = require("mongoose");
const to_do_model = require("../models/to_do_model.js");

const to_do = async (req, res, next) => {
  const {id} = req.params
  console.log("id for fetching lists :", id);
  // //console.log("fetching.................................");
  try {
    const result = await to_do_model.find({user : id});
    console.log(result);
    res.json(result); // Sending the result as JSON response
  } catch (error) {
    console.error("Error while fetching ToDo items:", error);
    res.status(500).json({ error: "Server error" }); // Sending 500 status code and error message
  }
};

const toggleEvent = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log("id:", id);

    // Find the to-do item by its ID
    const todoItem = await to_do_model.findById(id);

    // If the item is found
    if (todoItem) {
      // Toggle the completed status
      todoItem.task_status.completed = !todoItem.task_status.completed;
      todoItem.task_status.pending = !todoItem.task_status.pending;

      // Update the document
      const updatedToDo = await to_do_model.findByIdAndUpdate(
        id,
        { $set: { 
            "task_status.completed": todoItem.task_status.completed,
            "task_status.pending": todoItem.task_status.pending 
          } 
        },
        { new: true } // Return the updated document
      );

      console.log("Updated ToDo item:", updatedToDo);

      // Send the updated to-do item as response
      res.json(updatedToDo);
    } else {
      // If the to-do item with the given ID is not found
      res.status(404).json({ error: "To-do item not found" });
    }
  } catch (error) {
    console.error("Error while toggling to-do item:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const taskDel = async (req, res, next) => {
  //console.log("deleting...........");
  const { id } = req.body;
  //console.log(id);

  try {
    const todoItem = await to_do_model.findById(id);
    if (todoItem) {
      await to_do_model.deleteOne({ _id: id }); // Use _id instead of id
      //console.log("Item deleted:", todoItem);

      // Fetch updated list of items
      const updatedItems = await to_do_model.find();

      // Return the updated list of items
      res.json(updatedItems);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const addTask = async (req, res, next) => {
  try {
    const { task_des, id } = req.body;
    console.log(task_des, id);
    // Create a new task with the provided description
    const newTask = await to_do_model.create({
      task_des,
      task_status: {
        completed: false,
        pending: true,
      },
      user : id
    });
    //console.log("Task added:", newTask);

    // Optionally, you can send a success response with the new task
    
    const updatedItems = await to_do_model.find({user : id});
    console.log(updatedItems);
    res.json(updatedItems);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const editTask = async (req, res, next) => {
  const { id, task_des } = req.body;
  //console.log("edifing......................");
  try {
    // Use findByIdAndUpdate with $set to update only the task_des field
    const updatedTask = await to_do_model.findByIdAndUpdate(
      id,
      { $set: { task_des: task_des } },
      { new: true } // Return the updated document
    );

    // Check if the task was found and updated
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Fetch updated list of items
    const updatedItem = await to_do_model.find({id});

    // Return the updated list of items
    return res.status(201).json(updatedItem);
  } catch (error) {
    console.error('Error editing task:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


exports.to_do = to_do;
exports.toggleEvent = toggleEvent;
exports.taskDel = taskDel;
exports.addTask = addTask;
exports.editTask = editTask;
