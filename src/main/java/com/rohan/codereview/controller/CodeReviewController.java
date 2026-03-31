package com.rohan.codereview.controller;

import com.rohan.codereview.dto.CodeReviewRequest;
import com.rohan.codereview.dto.CodeReviewResponse;
import com.rohan.codereview.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CodeReviewController {

    private static final Logger log = LoggerFactory.getLogger(CodeReviewController.class);

    private final GeminiService geminiService;

    public CodeReviewController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/review")
    public ResponseEntity<?> reviewCode(@RequestBody CodeReviewRequest request) {
        log.info("Received code review request");

        if (request.getCode() == null || request.getCode().isBlank()) {
            log.warn("Empty code submitted");
            return ResponseEntity.badRequest().body(Map.of("error", "Code cannot be empty"));
        }

        try {
            CodeReviewResponse response = geminiService.reviewCode(
                    request.getCode(),
                    request.getLanguage()
            );
            log.info("Code review completed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Code review failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
