package com.example.controllers;

import com.example.exceptions.ResourceNotFoundException;
import com.example.exceptions.ValidationException;
import com.example.models.Todo;
import com.example.services.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class TodoServlet extends HttpServlet {
    private final TodoService todoService;
    private final ObjectMapper objectMapper;

    public TodoServlet(TodoService todoService, ObjectMapper objectMapper) {
        this.todoService = todoService;
        this.objectMapper = objectMapper;
    }

    private void setResponseHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        setResponseHeaders(resp);

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<Todo> todos = todoService.getAllTodos();
                objectMapper.writeValue(resp.getWriter(), todos);
            } else {
                Long id = Long.parseLong(pathInfo.substring(1));
                todoService.getTodoById(id)
                    .ifPresentOrElse(
                        todo -> {
                            try {
                                objectMapper.writeValue(resp.getWriter(), todo);
                            } catch (IOException e) {
                                throw new RuntimeException("JSONの書き込みに失敗しました", e);
                            }
                        },
                        () -> {
                            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                            try {
                                objectMapper.writeValue(resp.getWriter(), 
                                    Map.of("error", "Todo not found"));
                            } catch (IOException e) {
                                throw new RuntimeException(e);
                            }
                        }
                    );
            }
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), 
                Map.of("error", "Invalid ID format"));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        setResponseHeaders(resp);
        Todo todo = objectMapper.readValue(req.getReader(), Todo.class);
        
        try {
            Todo createdTodo = todoService.createTodo(todo);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            objectMapper.writeValue(resp.getWriter(), createdTodo);
        } catch (ValidationException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), e.getErrors());
        } catch (Exception e) {
            // 予期せぬエラーのログ出力
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            objectMapper.writeValue(resp.getWriter(), 
                Map.of("error", "Internal Server Error: " + e.getMessage()));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        setResponseHeaders(resp);
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), 
                Map.of("error", "ID is required"));
            return;
        }

        try {
            Long id = Long.parseLong(pathInfo.substring(1));
            Todo todo = objectMapper.readValue(req.getReader(), Todo.class);
            todo.setId(id);

            Todo updatedTodo = todoService.updateTodo(todo);
            objectMapper.writeValue(resp.getWriter(), updatedTodo);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), 
                Map.of("error", "Invalid ID format"));
        } catch (ResourceNotFoundException e) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            objectMapper.writeValue(resp.getWriter(), 
                Map.of("error", "Todo not found"));
        } catch (ValidationException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), e.getErrors());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        setResponseHeaders(resp);
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), 
                Map.of("error", "ID is required"));
            return;
        }

        try {
            Long id = Long.parseLong(pathInfo.substring(1));
            todoService.deleteTodo(id);
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), 
                Map.of("error", "Invalid ID format"));
        } catch (ResourceNotFoundException e) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            objectMapper.writeValue(resp.getWriter(), 
                Map.of("error", "Todo not found"));
        }
    }
}
