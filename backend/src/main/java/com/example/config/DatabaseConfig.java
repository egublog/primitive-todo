package com.example.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import java.io.File;

public class DatabaseConfig {
    private static HikariDataSource dataSource;

    public static void initialize() {
        HikariConfig config = new HikariConfig();
        
        // データベースファイルのパスを設定
        String dbPath = new File("todo.db").getAbsolutePath();
        config.setJdbcUrl("jdbc:sqlite:" + dbPath);
        config.setDriverClassName("org.sqlite.JDBC");
        
        // コネクションプールの設定
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(20000);
        
        // SQLiteの設定
        config.addDataSourceProperty("journal_mode", "WAL");
        config.addDataSourceProperty("synchronous", "NORMAL");
        
        dataSource = new HikariDataSource(config);
        
        // テーブルの初期化
        initializeDatabase();
    }

    private static void initializeDatabase() {
        try (var conn = dataSource.getConnection();
             var stmt = conn.createStatement()) {
            
            // todosテーブルの作成
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS todos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title VARCHAR(100) NOT NULL,
                    description TEXT,
                    priority VARCHAR(10) NOT NULL,
                    category VARCHAR(20) NOT NULL,
                    completed BOOLEAN NOT NULL DEFAULT 0,
                    due_date TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """);
            
        } catch (Exception e) {
            throw new RuntimeException("データベースの初期化に失敗しました", e);
        }
    }

    public static DataSource getDataSource() {
        if (dataSource == null) {
            throw new IllegalStateException("データベースが初期化されていません");
        }
        return dataSource;
    }

    public static void close() {
        if (dataSource != null) {
            dataSource.close();
        }
    }
}
