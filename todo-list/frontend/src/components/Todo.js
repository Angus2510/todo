import React, { useState, useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap";
import axios from "axios";
import "../App.css";

const GroupList = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [objId, setId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setToken(user.token);
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      console.log(user.token);
      const config = {
        headers: {
          authorization: user.token
        }
      }
      const response = await axios.get("/getToDo/get", config); 
      console.log(response);
      // setId(response.id);
      setTodos(response.data.todo.map(item => item));
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const config = {
        headers: {
          authorization: token
        }
      }
      if (inputValue.trim() !== "") {
        const newItem = { todo: inputValue };

        // Make a POST request to add the item using axios
        await axios.post("/addToDo/add", { value: newItem }, config);
       
        setTodos([...todos, newItem]);
        setInputValue("");
        console.log("its working")
      }
    } catch (error) {
      console.error("An error occurred while adding the item:", error);
    }
  };

  const handleEditItem = async (index) => {
    
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const config = {
        headers: {
          authorization: token
        }
      }
      if (inputValue.trim() !== "") {
        const updatedTodos = [...todos];
        updatedTodos[index] = { todo: inputValue };
        setTodos(updatedTodos);
        setInputValue("");

        // Make a PUT request to update the item using axios
        await axios.put(`/editToDo/updateOne/${index}`, {
          value: { todo: inputValue }, 
        },config);
      }
      setEditIndex(null);
    } catch (error) {
      console.error("An error occurred while updating the item:", error);
    }
  };

  const handleRemoveItem = async (index) => {
    const user = JSON.parse(sessionStorage.getItem("user"))
    const config = {
      headers: {
        authorization: token
      }
    }
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    if (editIndex === index) {
      setEditIndex(null);
      setInputValue("");
    }

    try {
      // Make a DELETE request to remove the item using axios
      await axios.delete(`/deleteToDo/delete/${index}`, config);
      console.log("Item removed successfully");
    } catch (error) {
      console.error("An error occurred while removing the item:", error);
    }
  };

  const getColorVariant = (index) => {
    const colors = [
      "primary",
      "secondary",
      "success",
      "danger",
      "warning",
      "info",
      "light",
    ];

    return colors[index % colors.length];
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <Button onClick={handleAddItem} variant="success" size="sm">
        Add Item
      </Button>
      <ListGroup className="lists">
        {todos.map((item, index) => (
          <ListGroup.Item
            key={index}
            variant={getColorVariant(index)}
            className="innerList"
          >
            {editIndex === index ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
              />
            ) : (
              item.todo
            )}
            {editIndex === index ? (
              <Button
                variant="success"
                size="sm"
                className="confirm-button"
                onClick={() => handleEditItem(index)}
              >
                Confirm
              </Button>
            ) : (
              <Button
                variant="info"
                size="sm"
                className="edit-button"
                onClick={() => setEditIndex(index)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              className="remove-button"
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default GroupList;
