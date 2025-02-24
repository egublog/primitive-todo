package com.example.models;

import java.time.LocalDateTime;
import java.util.Objects;
import com.example.exceptions.ValidationException;

public class Todo {
    public enum Priority {
        HIGH, MEDIUM, LOW
    }

    public enum Category {
        WORK, PERSONAL, SHOPPING, OTHER
    }

    private final Long id;
    private final String title;
    private final String description;
    private final Priority priority;
    private final Category category;
    private boolean completed;
    private final LocalDateTime dueDate;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Todo(Builder builder) {
        this.id = builder.id;
        this.title = builder.title;
        this.description = builder.description;
        this.priority = builder.priority;
        this.category = builder.category;
        this.completed = builder.completed;
        this.dueDate = builder.dueDate;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Priority getPriority() {
        return priority;
    }

    public Category getCategory() {
        return category;
    }

    public boolean isCompleted() {
        return completed;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setterは状態が変更可能なフィールドのみに制限
    public void setCompleted(boolean completed) {
        this.completed = completed;
        this.updatedAt = LocalDateTime.now();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private Priority priority;
        private Category category;
        private boolean completed;
        private LocalDateTime dueDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder(String title) {
            this.title = title;
            this.completed = false;
            this.createdAt = LocalDateTime.now();
            this.updatedAt = this.createdAt;
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder priority(Priority priority) {
            this.priority = priority;
            return this;
        }

        public Builder category(Category category) {
            this.category = category;
            return this;
        }

        public Builder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public Todo build() {
            validate();
            return new Todo(this);
        }

        private void validate() {
            if (title == null || title.trim().isEmpty()) {
                throw new ValidationException("タイトルは必須です");
            }
            if (title.length() > 100) {
                throw new ValidationException("タイトルは100文字以内で入力してください");
            }
            if (description != null && description.length() > 500) {
                throw new ValidationException("説明は500文字以内で入力してください");
            }
            if (dueDate != null && createdAt != null && dueDate.isBefore(createdAt)) {
                throw new ValidationException("期限は作成日時より後である必要があります");
            }
            if (priority == null) {
                this.priority = Priority.MEDIUM;
            }
            if (category == null) {
                this.category = Category.OTHER;
            }
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Todo todo = (Todo) o;
        return Objects.equals(id, todo.id) &&
               Objects.equals(title, todo.title) &&
               Objects.equals(description, todo.description) &&
               priority == todo.priority &&
               category == todo.category &&
               completed == todo.completed &&
               Objects.equals(dueDate, todo.dueDate) &&
               Objects.equals(createdAt, todo.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, priority, category, completed, dueDate, createdAt);
    }

    @Override
    public String toString() {
        return "Todo{" +
               "id=" + id +
               ", title='" + title + '\'' +
               ", description='" + description + '\'' +
               ", priority=" + priority +
               ", category=" + category +
               ", completed=" + completed +
               ", dueDate=" + dueDate +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}
