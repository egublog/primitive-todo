package com.example.controllers;

import com.example.dto.TodoDto;
import com.example.mappers.TodoMapper;
import com.example.models.Todo;
import com.example.services.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @MockBean
    private TodoMapper todoMapper;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    private TodoDto createSampleTodoDto() {
        TodoDto dto = new TodoDto();
        dto.setId(1L);
        dto.setTitle("テストタスク");
        dto.setDescription("これはテスト用のタスクです");
        dto.setCompleted(false);
        dto.setDueDate(LocalDateTime.now().plusDays(1));
        dto.setPriority("medium");
        dto.setCategory("work");
        return dto;
    }

    private Todo createSampleTodo() {
        Todo todo = new Todo();
        todo.setId(1L);
        todo.setTitle("テストタスク");
        todo.setDescription("これはテスト用のタスクです");
        todo.setCompleted(false);
        todo.setDueDate(LocalDateTime.now().plusDays(1));
        todo.setPriority("medium");
        todo.setCategory("work");
        return todo;
    }

    @Test
    void getAllTodos_正常系() throws Exception {
        Todo todo = createSampleTodo();
        TodoDto todoDto = createSampleTodoDto();
        
        when(todoService.getAllTodos()).thenReturn(Arrays.asList(todo));
        when(todoMapper.toDto(any(Todo.class))).thenReturn(todoDto);

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("テストタスク"))
                .andExpect(jsonPath("$[0].description").value("これはテスト用のタスクです"));
    }

    @Test
    void getTodoById_正常系() throws Exception {
        Todo todo = createSampleTodo();
        TodoDto todoDto = createSampleTodoDto();
        
        when(todoService.getTodoById(1L)).thenReturn(Optional.of(todo));
        when(todoMapper.toDto(todo)).thenReturn(todoDto);

        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title").value("テストタスク"));
    }

    @Test
    void getTodoById_存在しないID() throws Exception {
        when(todoService.getTodoById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/todos/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createTodo_正常系() throws Exception {
        TodoDto inputDto = createSampleTodoDto();
        Todo todo = createSampleTodo();
        
        when(todoMapper.toEntity(any(TodoDto.class))).thenReturn(todo);
        when(todoService.createTodo(any(Todo.class))).thenReturn(todo);
        when(todoMapper.toDto(todo)).thenReturn(inputDto);

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("テストタスク"));
    }

    @Test
    void createTodo_バリデーション違反() throws Exception {
        TodoDto invalidDto = new TodoDto();
        // タイトルを空にしてバリデーションエラーを発生させる
        invalidDto.setTitle("");
        invalidDto.setDescription("説明");

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateTodo_正常系() throws Exception {
        TodoDto updateDto = createSampleTodoDto();
        Todo existingTodo = createSampleTodo();
        Todo updatedTodo = createSampleTodo();
        updatedTodo.setTitle("更新後のタスク");
        
        when(todoService.getTodoById(1L)).thenReturn(Optional.of(existingTodo));
        when(todoService.updateTodo(any(Todo.class))).thenReturn(updatedTodo);
        when(todoMapper.toDto(updatedTodo)).thenReturn(updateDto);

        mockMvc.perform(put("/api/todos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk());
    }

    @Test
    void updateTodo_存在しないID() throws Exception {
        TodoDto updateDto = createSampleTodoDto();
        
        when(todoService.getTodoById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/todos/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteTodo_正常系() throws Exception {
        Todo todo = createSampleTodo();
        when(todoService.getTodoById(1L)).thenReturn(Optional.of(todo));

        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteTodo_存在しないID() throws Exception {
        when(todoService.getTodoById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/todos/99"))
                .andExpect(status().isNotFound());
    }
}
