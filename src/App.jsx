import "./style.css";
import TodoForm from "./TodoForm";
import { useState, useEffect } from "react";

function App() {
  const [newTodoText, setNewTodoText] = useState("");
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Arama terimi veya todolar değiştiğinde filtreleme yap
  useEffect(() => {
    const results = todos.filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTodos(results);
  }, [searchTerm, todos]); // searchTerm veya todos değiştiğinde bu efekt çalışacak

  const handleInputChange = (evt) => {
    setNewTodoText(evt.target.value);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hour = d.getHours().toString().padStart(2, "0");
    const minute = d.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  //Yeni görevi ekledik
  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodoItem = {
        id: Date.now(),
        text: newTodoText.trim(),
        color: "red",
        textdecoration: "none",
        createdAt: new Date(),
      };
      // Yeni todoyu mevcut todolar dizisine ekle
      const updatedTodos = [...todos, newTodoItem];
      setTodos(updatedTodos); // State'i güncelle
      setNewTodoText("");
    }
  };

  //TODO'LARIN RENK DEĞİŞTİRMESİ VE ÜSTÜNE ÇİZGİ ÇEKİLMESİ
  const toggleTodoColor = (todoIdToChange) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoIdToChange) {
        const newColor = todo.color === "green" ? "red" : "green";
        const newTextDec =
          todo.textdecoration === "line-through" ? "none" : "line-through";
        return { ...todo, color: newColor, textdecoration: newTextDec };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  //TUŞA BASINCA İLGİLİ TODO SİLİNSİN
  const deleteItem = (todoIdToDelete) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoIdToDelete);
    setTodos(updatedTodos);
  };

  //İLGİLİ TODO'YU EDITLEME VE SAVELEME
  const saveEdit = (todoIdToEdit) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoIdToEdit) {
        return { ...todo, text: editingText };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditingId(null);
    setEditingText("");
  };

  //TODO LIST ITEMLARININ LİSTELENMESİ
  const todoListItems = filteredTodos.map((todo) => {
    return (
      <tr
        key={todo.id}
        style={{ cursor: "pointer" }}
        onClick={() => toggleTodoColor(todo.id)}
      >
        <td>
          {editingId === todo.id ? (
            <>
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </>
          ) : (
            <span
              style={{
                color: todo.color,
                textDecoration: todo.textdecoration,
              }}
            >
              {todo.text}
            </span>
          )}
        </td>
        <td>{formatDate(todo.createdAt)}</td>
        <td>
          {editingId === todo.id ? (
            <div className="button-group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveEdit(todo.id);
                }}
              >
                KAYDET
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(null);
                }}
              >
                İPTAL
              </button>
            </div>
          ) : (
            <div className="button-group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(todo.id);
                  setEditingText(todo.text);
                }}
              >
                EDIT
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(todo.id);
                }}
              >
                SİL
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  });

  return (
    <>
      <div>
        <h1>TO - DO LIST</h1>
        <div className="container">
          <p>--- ARAMA YAP ---</p>
          <input
            type="text"
            placeholder="Görevlerde Ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="container">
          <TodoForm
            newTodoText={newTodoText}
            handleInputChange={handleInputChange}
            addTodo={addTodo}
          />
        </div>

        <div className="container">
          <p>TO - DO LIST</p>
          <table>
            <thead>
              <tr>
                <th>GÖREV</th>
                <th>TARİH</th>
                <th>AKSİYON</th>
              </tr>
            </thead>
            <tbody>{todoListItems}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
