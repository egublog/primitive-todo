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

    public Todo updateTodo(Todo updates) {
        Todo existingTodo = todoRepository.findById(updates.getId())
            .orElseThrow(() -> new IllegalArgumentException("Todo not found with id: " + updates.getId()));

        // 更新されたフィールドのみを反映
        if (updates.getTitle() != null) {
            existingTodo.setTitle(updates.getTitle());
        }
        if (updates.getDescription() != null) {
            existingTodo.setDescription(updates.getDescription());
        }
        if (updates.getPriority() != null) {
            existingTodo.setPriority(updates.getPriority());
        }
        if (updates.getCategory() != null) {
            existingTodo.setCategory(updates.getCategory());
        }
        if (updates.getDueDate() != null) {
            existingTodo.setDueDate(updates.getDueDate());
        }
        // completedフィールドは特別扱い(nullでも更新可能)
        existingTodo.setCompleted(updates.isCompleted());

        // 更新後のTodoを検証
        validateTodo(existingTodo);
        return todoRepository.save(existingTodo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    private static final List<String> VALID_PRIORITIES = List.of("low", "medium", "high");
    private static final List<String> VALID_CATEGORIES = List.of("none", "work", "personal", "shopping", "study");

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

        if (todo.getPriority() == null || !VALID_PRIORITIES.contains(todo.getPriority())) {
            throw new IllegalArgumentException("Invalid priority value. Must be one of: " + String.join(", ", VALID_PRIORITIES));
        }

        if (todo.getCategory() == null || !VALID_CATEGORIES.contains(todo.getCategory())) {
            throw new IllegalArgumentException("Invalid category value. Must be one of: " + String.join(", ", VALID_CATEGORIES));
        }
    }
}
