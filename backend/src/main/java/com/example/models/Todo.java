package com.example.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Column(nullable = false)
    private String priority = "medium";

    @Column(nullable = false)
    private String category = "none";

    @Column
    private LocalDateTime dueDate;

    @Column(nullable = false)
    private boolean completed = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Todo() {}

    public Todo(String title, String description, String priority, String category, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.category = category;
        this.dueDate = dueDate;
    }
}
