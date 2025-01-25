package com.example.services;

import com.example.models.Todo;
import com.example.repositories.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    public Todo createTodo(Todo todo) {
        validateTodo(todo);
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Todo todo) {
        validateTodo(todo);
        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    private void validateTodo(Todo todo) {
        if (todo.getTitle() == null || todo.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Todo title cannot be empty");
        }
        
        if (todo.getTitle().length() > 100) {
            throw new IllegalArgumentException("Todo title cannot exceed 100 characters");
        }
        
        if (todo.getDescription() != null && todo.getDescription().length() > 500) {
            throw new IllegalArgumentException("Todo description cannot exceed 500 characters");
        }
    }
}
