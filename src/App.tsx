import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import TodoList from './TodoList';
import './App.css';

export type Todo = {
	id: number;
	title: string;
	dt_create: Date;
	finished: boolean;
};

function App() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [todoTitle, setTodoTitle] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');

	useEffect(() => {
		const localStorageTodos = localStorage.getItem('todos');
		if (localStorageTodos) {
			setTodos(JSON.parse(localStorageTodos));
		} else {
			setIsLoading(true);
			const fetchTodos = async () => {
				try {
					const response = await axios.get('http://localhost:3002/todos');
					setTodos(response.data);
				} catch (error) {
					console.error('Error fetch:', error);
				} finally {
					setIsLoading(false);
				}
			};

			fetchTodos();
		}
	}, []);

	useEffect(() => {
		if (todos.length) {
			localStorage.setItem('todos', JSON.stringify(todos));
		}
	}, [todos]);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (todoTitle.length > 45) {
			return;
		}

		const newTodo: Todo = { id: 0, title: todoTitle, dt_create: new Date(), finished: false};

		try {
			const response = await axios.post('http://localhost:3002/todos', newTodo);
			setTodos((prevTodos) => [...prevTodos, response.data]);
			setTodoTitle('');
			setErrorMessage('');
		} catch (error) {
			console.error('Error add:', error);
		}
	};

	const onDeleteTodo = async (id: number) => {
		try {
			const response = await axios.delete(`http://localhost:3002/todos/${id}`);
			if (response.status === 200) {
				setTodos((prevTodos) => {
					const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
					localStorage.setItem('todos', JSON.stringify(updatedTodos));
					return updatedTodos;
				});
			}
		} catch (error) {
			console.error('Error delete todo:', error);
		}
	};

	const onToggleFinish = (id: number) => {
		setTodos((prevTodos) =>
			prevTodos.map((todo) =>
				todo.id === id ? { ...todo, finished: !todo.finished } : todo
			)
		);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (value.length <= 40) {
			setTodoTitle(value);
			setErrorMessage('');
		} else {
			setErrorMessage('You cannot enter more than 40 characters');
		}
	};

	return (
		<div className="app">
			<header className="app__header">
				<h1>To-do-do</h1>
			</header>
			<div className="todo">
				{isLoading ? (
					<div className="loading">Loading...</div>
				) : todos.length ? (
					<TodoList
						todos={todos}
						onDeleteTodo={onDeleteTodo}
						onToggleFinish={onToggleFinish}
					/>
				) : (
					<div className="todo__list">No tasks to display</div>
				)}

				<form onSubmit={onSubmit} className="todo__submit">
					<input
						className={`todo__input ${errorMessage ? 'error' : ''}`}
						type="text"
						value={todoTitle}
						placeholder="Enter task"
						onChange={handleChange}
					/>
					<button className="todo__button" type="submit" disabled={todoTitle.length > 40}>
						Submit
					</button>
					{errorMessage && <div className="error-message">{errorMessage}</div>}
				</form>
			</div>
		</div>
	);
}

export default App;
