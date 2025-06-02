export default function TodoForm({ newTodoText, handleInputChange, addTodo }) {
  return (
    <>
      <p>--- TO - DO EKLE ---</p>
      <input
        type="text"
        placeholder="Yeni Görev Gir"
        value={newTodoText}
        onChange={handleInputChange}
      />
      <button onClick={addTodo}>ADD TO DO</button>
    </>
  );
}
