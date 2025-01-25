package com.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class Database {
    private static Connection connection = null;

    private Database() {}

    public static Connection getConnection() {
        if (connection == null) {
            try {
                Properties props = new Properties();
                props.setProperty("foreign_keys", "true");
                props.setProperty("date_string_format", "yyyy-MM-dd HH:mm:ss");
                
                connection = DriverManager.getConnection(
                    System.getProperty("db.url"),
                    props
                );
                
                // Enable foreign key support
                connection.createStatement().execute("PRAGMA foreign_keys = ON;");
            } catch (SQLException e) {
                throw new RuntimeException("Failed to connect to database", e);
            }
        }
        return connection;
    }

    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Failed to close database connection: " + e.getMessage());
            }
        }
    }
}
