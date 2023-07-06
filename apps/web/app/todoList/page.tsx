"use client";
import { useState, useEffect, useRef } from 'react';

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
    if (!newTodo) return;
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => response.json())
      .then(data => {
        data.id = todo.id;
        const updatedTodos = todos.map(item => {
          if (item.id === todo.id) {
            return data;
          }
          return item;
        });
        setTodos(updatedTodos);
      });
  };

  const handleTodoDelete = (todo: Todo) => {
    const params = { id: todo.id };
    fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(response => response.json())
      .then(deletedTodo => {
        const updatedTodos = todos.filter(item => todo.id !== item.id);
        setTodos(updatedTodos);
      });
  };

  const dragItem = useRef<Todo | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, todo: Todo) => {
    dragItem.current = todo;
    e.dataTransfer?.setData('text/plain', ''); // Required for Firefox
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, todo: Todo) => {
    e.preventDefault();
    if (dragItem.current && dragItem.current.id !== todo.id) {
      const dragIndex = todos.findIndex(item => item.id === dragItem.current?.id);
      const dropIndex = todos.findIndex(item => item.id === todo.id);
      const updatedTodos =[...todos];
      updatedTodos.splice(dropIndex, 0, updatedTodos.splice(dragIndex, 1)[0]);
      setTodos(updatedTodos);
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const incompletedTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Todo列表</h1>
      <div className="flex mb-4">
        <form className="flex" onSubmit={handleNewTodoSubmit}>
          <input
            className="input input-bordered input-primary mr-2 w-64"
            type="text"
            value={newTodo}
            onChange={handleNewTodoChange}
            placeholder="添加一个新的Todo..."
          />
          <button className="btn btn-primary" type="submit">
            添加
          </button>
        </form>
      </div>
      <div className="flex">
        <div className="w-1/2 pr-2">
          <h2 className="text-xl font-bold">已完成</h2>
          <ul>
            {completedTodos.map(todo => (
              <li
                key={todo.id}
                className="flex items-center mb-2 p-4 rounded bg-green-900 transition-colors duration-300"
                draggable
                onDragStart={e => handleDragStart(e, todo)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, todo)}
              >
                <button
                  className={`btn btn-link ${
                    todo.completed ? 'text-green-200' : 'text-white'
                  }`}
                  onClick={() => handleTodoToggle(todo)}
                >
                  {todo.completed ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-xl line-through">{todo.title}</span>
                <button
                  className="btn btn-error ml-auto"
                  onClick={() => handleTodoDelete(todo)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 pl-2">
          <h2 className="text-xl font-bold">未完成</h2>
          <ul>
            {incompletedTodos.map(todo => (
              <li
                key={todo.id}
                className="flex items-center mb-2 p-4 rounded bg-red-900 transition-colors duration-300"
                draggable
                onDragStart={e => handleDragStart(e, todo)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, todo)}
              >
                <button
                  className={`btn btn-link ${
                    todo.completed ? 'text-red-200' : 'text-white'
                  }`}
                  onClick={() => handleTodoToggle(todo)}
                >
                  {todo.completed ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-xl font-bold underline">{todo.title}</span>
                <button
                  className="btn btn-error ml-auto"
                  onClick={() => handleTodoDelete(todo)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
