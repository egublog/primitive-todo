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
    private static final String ALLOWED_ORIGIN = "http://127.0.0.1:5500";
    private static final String ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS";
    private static final String ALLOWED_HEADERS = "Content-Type, Accept";

    private final TodoService todoService;
    private final ObjectMapper objectMapper;

    public TodoServlet(TodoService todoService, ObjectMapper objectMapper) {
        this.todoService = todoService;
        this.objectMapper = objectMapper;
    }

    private void setResponseHeaders(HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
        resp.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
        resp.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    }

    private Long extractIdFromPath(HttpServletRequest req) throws ValidationException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            throw new ValidationException("ID is required", List.of("ID is required"));
        }
        try {
            return Long.parseLong(pathInfo.substring(1));
        } catch (NumberFormatException e) {
            throw new ValidationException("Invalid ID format", List.of("Invalid ID format"));
        }
    }

    private void handleError(HttpServletResponse resp, Exception e) throws IOException {
        if (e instanceof NumberFormatException) {
            sendErrorResponse(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid ID format");
        } else if (e instanceof ResourceNotFoundException) {
            sendErrorResponse(resp, HttpServletResponse.SC_NOT_FOUND, "Todo not found");
        } else if (e instanceof ValidationException) {
            ValidationException ve = (ValidationException) e;
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            objectMapper.writeValue(resp.getWriter(), Map.of("errors", ve.getErrors()));
        } else {
            e.printStackTrace(); // 予期せぬエラーのログ出力
            sendErrorResponse(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Internal Server Error: " + e.getMessage());
        }
    }

    private void sendErrorResponse(HttpServletResponse resp, int status, String message) 
            throws IOException {
        resp.setStatus(status);
        objectMapper.writeValue(resp.getWriter(), Map.of("error", message));
    }

    private <T> void writeJsonResponse(HttpServletResponse resp, T data) 
            throws IOException {
        objectMapper.writeValue(resp.getWriter(), data);
    }

    private <T> void writeJsonResponse(HttpServletResponse resp, T data, int status) 
            throws IOException {
        resp.setStatus(status);
        writeJsonResponse(resp, data);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        setResponseHeaders(resp);
        try {
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                writeJsonResponse(resp, todoService.getAllTodos());
                return;
            }
            
            Long id = extractIdFromPath(req);
            todoService.getTodoById(id)
                .ifPresentOrElse(
                    todo -> {
                        try {
                            writeJsonResponse(resp, todo);
                        } catch (IOException e) {
                            throw new RuntimeException("JSONの書き込みに失敗しました", e);
                        }
                    },
                    () -> {
                        try {
                            sendErrorResponse(resp, HttpServletResponse.SC_NOT_FOUND, "Todo not found");
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                );
        } catch (Exception e) {
            handleError(resp, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        setResponseHeaders(resp);
        try {
            Todo todo = objectMapper.readValue(req.getReader(), Todo.class);
            Todo createdTodo = todoService.createTodo(todo);
            writeJsonResponse(resp, createdTodo, HttpServletResponse.SC_CREATED);
        } catch (Exception e) {
            handleError(resp, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        setResponseHeaders(resp);
        try {
            Long id = extractIdFromPath(req);
            Todo todo = objectMapper.readValue(req.getReader(), Todo.class);
            todo.setId(id);
            Todo updatedTodo = todoService.updateTodo(todo);
            writeJsonResponse(resp, updatedTodo);
        } catch (Exception e) {
            handleError(resp, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        setResponseHeaders(resp);
        try {
            Long id = extractIdFromPath(req);
            todoService.deleteTodo(id);
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } catch (Exception e) {
            handleError(resp, e);
        }
    }
}
