package com.example.services;

import com.example.exceptions.ResourceNotFoundException;
import com.example.exceptions.ValidationException;
import com.example.models.Todo;
import com.example.repositories.TodoRepository;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TodoService {
    private final TodoRepository todoRepository;

    private static final List<String> VALID_PRIORITIES = List.of("low", "medium", "high");
    private static final List<String> VALID_CATEGORIES = List.of("none", "work", "personal", "shopping", "study");
    private static final int MAX_TITLE_LENGTH = 100;
    private static final int MAX_DESCRIPTION_LENGTH = 500;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * 全てのTodoを取得
     */
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    /**
     * IDに基づいてTodoを取得
     */
    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    /**
     * 新規Todoを作成
     */
    public Todo createTodo(Todo todo) {
        List<String> validationErrors = validateTodo(todo);
        if (!validationErrors.isEmpty()) {
            throw new ValidationException("Todoの検証に失敗しました", validationErrors);
        }
        return todoRepository.save(todo);
    }

    /**
     * Todoを更新
     */
    public Todo updateTodo(Todo updates) {
        Todo existingTodo = todoRepository.findById(updates.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Todo", "id", updates.getId()));

        updateTodoFields(existingTodo, updates);
        
        List<String> validationErrors = validateTodo(existingTodo);
        if (!validationErrors.isEmpty()) {
            throw new ValidationException("更新されたTodoの検証に失敗しました", validationErrors);
        }

        return todoRepository.save(existingTodo);
    }

    /**
     * Todoを削除
     */
    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Todo", "id", id);
        }
        todoRepository.deleteById(id);
    }

    /**
     * Todoのフィールドを更新
     */
    private void updateTodoFields(Todo existingTodo, Todo updates) {
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
        existingTodo.setCompleted(updates.isCompleted());
    }

    /**
     * Todoのバリデーション
     * @return バリデーションエラーのリスト
     */
    private List<String> validateTodo(Todo todo) {
        List<String> errors = new ArrayList<>();

        // タイトルのバリデーション
        if (todo.getTitle() == null || todo.getTitle().trim().isEmpty()) {
            errors.add("タイトルは必須です");
        } else if (todo.getTitle().length() > MAX_TITLE_LENGTH) {
            errors.add(String.format("タイトルは%d文字以内で入力してください", MAX_TITLE_LENGTH));
        }

        // 説明のバリデーション
        if (todo.getDescription() != null && todo.getDescription().length() > MAX_DESCRIPTION_LENGTH) {
            errors.add(String.format("説明は%d文字以内で入力してください", MAX_DESCRIPTION_LENGTH));
        }

        // 優先度のバリデーション
        if (todo.getPriority() == null || !VALID_PRIORITIES.contains(todo.getPriority())) {
            errors.add("優先度は以下のいずれかを選択してください: " + String.join(", ", VALID_PRIORITIES));
        }

        // カテゴリーのバリデーション
        if (todo.getCategory() == null || !VALID_CATEGORIES.contains(todo.getCategory())) {
            errors.add("カテゴリーは以下のいずれかを選択してください: " + String.join(", ", VALID_CATEGORIES));
        }

        return errors;
    }
}
