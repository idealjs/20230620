/*
 * @Descripttion: 
 * @version: 
 * @Author: wushide
 * @Date: 2023-06-26 08:48:18
 * @LastEditors: wushide
 * @LastEditTime: 2023-07-04 09:04:20
 */
import { NextApiRequest, NextApiResponse } from 'next';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [];

export function setTodoList() {
  
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(todos);
  } else if (req.method === 'POST') {
    const { text } = req.body;
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } else if (req.method === 'PUT') {
    const { id, completed } = req.body;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      todos[todoIndex].completed = completed;
      res.status(200).json(todos[todoIndex]);
    } else {
      res.status(404).json({ message: '未找到Todo' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    console.log(req.body)
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      const deletedTodo = todos.splice(todoIndex, 1);
      res.status(200).json(deletedTodo[0]);
    } else {
      res.status(404).json({ message: '未找到Todo' });
    }
  }
}
