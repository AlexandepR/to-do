import React from 'react';
import { Todo } from './App';

type TodoListProps = {
	todos: Todo[];
	onDeleteTodo: (id: number) => void;
	onToggleFinish: (id: number) => void;
};

const TodoList: React.FC<TodoListProps> = ({ todos, onDeleteTodo, onToggleFinish }) => {
	return (
		<div className="todo__list">
			<ul className="todo__items">
				{todos.map((todo) => (
					<li key={todo.id} className={`todo__item ${todo.finished ? 'completed' : ''}`}>
						<input
							type="checkbox"
							checked={todo.finished}
							onChange={() => onToggleFinish(todo.id)}
							className="todo__checkbox"
						/>
						<span className="todo__title">{todo.title}</span>
						<button
							className="todo__delete-button"
							onClick={() => onDeleteTodo(todo.id)}
						>
							✖
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TodoList;
