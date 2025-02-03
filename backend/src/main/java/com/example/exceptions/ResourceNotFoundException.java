package com.example.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    
    /**
     * リソースが見つからない場合の例外
     * @param resourceName リソース名
     * @param fieldName フィールド名
     * @param fieldValue フィールド値
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s が %s: '%s' のリソースが見つかりません", 
            resourceName, fieldName, fieldValue));
    }

    /**
     * リソースが見つからない場合の例外（シンプルなメッセージ）
     * @param message エラーメッセージ
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
