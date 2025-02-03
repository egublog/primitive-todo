package com.example.controllers;

import com.example.dto.TodoDto;
import com.example.mappers.TodoMapper;
import com.example.models.Todo;
import com.example.services.TodoService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
@Validated
public class TodoController {
    private final TodoService todoService;
    private final TodoMapper todoMapper;

    public TodoController(TodoService todoService, TodoMapper todoMapper) {
        this.todoService = todoService;
        this.todoMapper = todoMapper;
    }

    /**
     * 全てのTodoを取得
     */
    @GetMapping
    public ResponseEntity<List<TodoDto>> getAllTodos() {
        List<TodoDto> todos = todoService.getAllTodos().stream()
                .map(todoMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(todos);
    }

    /**
     * IDに基づいてTodoを取得
     */
    @GetMapping("/{id}")
    public ResponseEntity<TodoDto> getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id)
                .map(todoMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 新規Todoを作成
     */
    @PostMapping
    public ResponseEntity<TodoDto> createTodo(@Valid @RequestBody TodoDto todoDto) {
        Todo todo = todoMapper.toEntity(todoDto);
        Todo createdTodo = todoService.createTodo(todo);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(todoMapper.toDto(createdTodo));
    }

    /**
     * 既存のTodoを更新
     */
    @PutMapping("/{id}")
    public ResponseEntity<TodoDto> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoDto todoDto) {
        return todoService.getTodoById(id)
                .map(existingTodo -> {
                    todoMapper.updateEntityFromDto(todoDto, existingTodo);
                    Todo updatedTodo = todoService.updateTodo(existingTodo);
                    return ResponseEntity.ok(todoMapper.toDto(updatedTodo));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Todoを削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        return todoService.getTodoById(id)
                .map(todo -> {
                    todoService.deleteTodo(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
