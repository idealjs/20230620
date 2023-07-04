"use client";
import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => setTodos(data));
  }, []);

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodo) return
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodo }),
    })
      .then(response => response.json())
      .then(data => {
        setTodos(prevTodos => [...prevTodos, data]);
        setNewTodo('');
      });
  };

  const handleTodoToggle = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => response.json())
      .then(data => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === data.id) {
            return data;
          }
          return todo;
        });
        setTodos(updatedTodos);
      });
  };

  const handleTodoDelete = (todo: Todo) => {
    const params = { id: todo.id }
    fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(response => response.json())
      .then(deletedTodo => {
        const updatedTodos = todos.filter(todo => todo.id !== deletedTodo.id);
        setTodos(updatedTodos);
      });
  };

  return (
    <div>
      <h1>Todo列表</h1>
      <form onSubmit={handleNewTodoSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={handleNewTodoChange}
          placeholder="添加一个新的Todo..."
        />
        <button type="submit">添加</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleTodoToggle(todo)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button onClick={() => handleTodoDelete(todo)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
