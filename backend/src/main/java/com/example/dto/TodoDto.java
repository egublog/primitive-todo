package com.example.dto;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TodoDto {
    private Long id;

    @NotBlank(message = "タイトルは必須です")
    @Size(min = 1, max = 100, message = "タイトルは1文字以上100文字以下で入力してください")
    private String title;

    @Size(max = 500, message = "説明は500文字以下で入力してください")
    private String description;

    private LocalDateTime dueDate;
    private boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String priority = "medium";
    private String category = "none";

    // Getters
    public String getPriority() {
        return priority;
    }

    public String getCategory() {
        return category;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
