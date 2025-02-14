package com.example;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import com.example.config.DatabaseConfig;
import com.example.controllers.TodoServlet;
import com.example.repositories.TodoRepository;
import com.example.services.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Application {
    private static final int PORT = 8080;

    public static void main(String[] args) throws Exception {
        // データベース設定の初期化
        DatabaseConfig.initialize();

        // 依存オブジェクトの作成
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        TodoRepository todoRepository = new TodoRepository(DatabaseConfig.getDataSource());
        TodoService todoService = new TodoService(todoRepository);
        
        // サーブレットの設定
        TodoServlet todoServlet = new TodoServlet(todoService, objectMapper);
        
        // Jettyサーバーの設定
        Server server = new Server(PORT);
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);

        // APIエンドポイントの登録
        // APIエンドポイントの登録
        context.addServlet(new ServletHolder(todoServlet), "/api/todos/*");

        try {
            server.start();
            System.out.println("Server started on port " + PORT);
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
            server.stop();
            System.exit(1);
        }
    }
}
