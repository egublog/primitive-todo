package com.example.mappers;

import com.example.dto.TodoDto;
import com.example.models.Todo;
import org.springframework.stereotype.Component;

@Component
public class TodoMapper {
    
    /**
     * TodoエンティティからDTOへの変換
     */
    public TodoDto toDto(Todo todo) {
        if (todo == null) {
            return null;
        }

        TodoDto dto = new TodoDto();
        dto.setId(todo.getId());
        dto.setTitle(todo.getTitle());
        dto.setDescription(todo.getDescription());
        dto.setPriority(todo.getPriority());
        dto.setCategory(todo.getCategory());
        dto.setDueDate(todo.getDueDate());
        dto.setCompleted(todo.isCompleted());
        dto.setCreatedAt(todo.getCreatedAt());
        dto.setUpdatedAt(todo.getUpdatedAt());

        return dto;
    }

    /**
     * DTOからTodoエンティティへの変換
     */
    public Todo toEntity(TodoDto dto) {
        if (dto == null) {
            return null;
        }

        Todo todo = new Todo();
        // IDは新規作成時にはnullになる
        if (dto.getId() != null) {
            todo.setId(dto.getId());
        }
        todo.setTitle(dto.getTitle());
        todo.setDescription(dto.getDescription());
        todo.setPriority(dto.getPriority());
        todo.setCategory(dto.getCategory());
        todo.setDueDate(dto.getDueDate());
        todo.setCompleted(dto.isCompleted());

        // 作成日時と更新日時は自動設定されるため、DTOからの設定は不要

        return todo;
    }

    /**
     * 既存のTodoエンティティの更新
     */
    public void updateEntityFromDto(TodoDto dto, Todo todo) {
        if (dto == null || todo == null) {
            return;
        }

        // タイトルが提供されている場合のみ更新
        if (dto.getTitle() != null) {
            todo.setTitle(dto.getTitle());
        }

        // 説明が提供されている場合のみ更新
        if (dto.getDescription() != null) {
            todo.setDescription(dto.getDescription());
        }

        // 優先度が提供されている場合のみ更新
        if (dto.getPriority() != null) {
            todo.setPriority(dto.getPriority());
        }

        // カテゴリーが提供されている場合のみ更新
        if (dto.getCategory() != null) {
            todo.setCategory(dto.getCategory());
        }

        // 期限が提供されている場合のみ更新
        if (dto.getDueDate() != null) {
            todo.setDueDate(dto.getDueDate());
        }

        // 完了状態は常に更新（booleanのプリミティブ型のため）
        todo.setCompleted(dto.isCompleted());
    }
}
