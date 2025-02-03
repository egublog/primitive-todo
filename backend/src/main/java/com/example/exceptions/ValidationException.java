package com.example.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {
    private final List<String> errors;

    /**
     * バリデーションエラーの例外
     * @param message エラーメッセージ
     */
    public ValidationException(String message) {
        super(message);
        this.errors = new ArrayList<>();
        this.errors.add(message);
    }

    /**
     * 複数のバリデーションエラーを持つ例外
     * @param message エラーメッセージ
     * @param errors エラーリスト
     */
    public ValidationException(String message, List<String> errors) {
        super(message);
        this.errors = errors;
    }

    /**
     * エラーリストを取得
     * @return エラーリスト
     */
    public List<String> getErrors() {
        return errors;
    }
}
