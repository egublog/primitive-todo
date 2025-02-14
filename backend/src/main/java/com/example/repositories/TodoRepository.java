package com.example.repositories;

import com.example.models.Todo;
import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public class TodoRepository {
    private final DataSource dataSource;

    public TodoRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<Todo> findAll() {
        List<Todo> todos = new ArrayList<>();
        String sql = "SELECT * FROM todos ORDER BY created_at DESC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                todos.add(mapResultSetToTodo(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Todoの取得に失敗しました", e);
        }

        return todos;
    }

    public Optional<Todo> findById(Long id) {
        String sql = "SELECT * FROM todos WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToTodo(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Todoの取得に失敗しました", e);
        }

        return Optional.empty();
    }

    public Todo save(Todo todo) {
        if (todo.getId() == null) {
            return insert(todo);
        } else {
            return update(todo);
        }
    }

    private Todo insert(Todo todo) {
        String sql = """
            INSERT INTO todos (title, description, priority, category, completed, due_date)
            VALUES (?, ?, ?, ?, ?, ?);
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            setTodoParameters(stmt, todo);
            stmt.executeUpdate();

            // SQLiteの場合、last_insert_rowid()で最後に挿入された行のIDを取得
            try (Statement idStmt = conn.createStatement();
                 ResultSet rs = idStmt.executeQuery("SELECT last_insert_rowid()")) {
                if (rs.next()) {
                    todo.setId(rs.getLong(1));
                    return findById(todo.getId()).orElseThrow();
                } else {
                    throw new SQLException("Todoの作成に失敗しました、IDが生成されませんでした");
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Todoの保存に失敗しました", e);
        }
    }

    private Todo update(Todo todo) {
        String sql = """
            UPDATE todos 
            SET title = ?, description = ?, priority = ?, category = ?, 
                completed = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            setTodoParameters(stmt, todo);
            stmt.setLong(7, todo.getId());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Todoの更新に失敗しました、該当するIDが見つかりません");
            }

            return findById(todo.getId()).orElseThrow();
        } catch (SQLException e) {
            throw new RuntimeException("Todoの更新に失敗しました", e);
        }
    }

    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM todos WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Todoの存在確認に失敗しました", e);
        }
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM todos WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Todoの削除に失敗しました", e);
        }
    }

    private void setTodoParameters(PreparedStatement stmt, Todo todo) throws SQLException {
        stmt.setString(1, todo.getTitle());
        stmt.setString(2, todo.getDescription());
        stmt.setString(3, todo.getPriority());
        stmt.setString(4, todo.getCategory());
        stmt.setBoolean(5, todo.isCompleted());
        if (todo.getDueDate() != null) {
            stmt.setTimestamp(6, Timestamp.valueOf(todo.getDueDate()));
        } else {
            stmt.setNull(6, Types.TIMESTAMP);
        }
    }

    private Todo mapResultSetToTodo(ResultSet rs) throws SQLException {
        Todo todo = new Todo();
        todo.setId(rs.getLong("id"));
        todo.setTitle(rs.getString("title"));
        todo.setDescription(rs.getString("description"));
        todo.setPriority(rs.getString("priority"));
        todo.setCategory(rs.getString("category"));
        todo.setCompleted(rs.getBoolean("completed"));
        
        Timestamp dueDate = rs.getTimestamp("due_date");
        if (dueDate != null) {
            todo.setDueDate(dueDate.toLocalDateTime());
        }
        
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            todo.setCreatedAt(createdAt.toLocalDateTime());
        }
        
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            todo.setUpdatedAt(updatedAt.toLocalDateTime());
        }
        
        return todo;
    }
}
