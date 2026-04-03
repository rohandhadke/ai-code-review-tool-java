package com.rohan.codereview.controller;

import com.rohan.codereview.dto.CodeReviewRequest;
import com.rohan.codereview.dto.CodeReviewResponse;
import com.rohan.codereview.model.ReviewHistory;
import com.rohan.codereview.repository.ReviewHistoryRepository;
import com.rohan.codereview.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CodeReviewController {

    private static final Logger log = LoggerFactory.getLogger(CodeReviewController.class);

    private final GeminiService geminiService;
    private final ReviewHistoryRepository reviewHistoryRepository;

    public CodeReviewController(GeminiService geminiService,
                                ReviewHistoryRepository reviewHistoryRepository) {
        this.geminiService = geminiService;
        this.reviewHistoryRepository = reviewHistoryRepository;
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
                    request.getLanguage());

            // Save to MongoDB
            ReviewHistory history = new ReviewHistory(
                    request.getCode(),
                    request.getLanguage(),
                    response.getIssues(),
                    response.getRefactoredCode(),
                    response.getExplanation()
            );
            ReviewHistory saved = reviewHistoryRepository.save(history);
            log.info("Code review saved with id: {}", saved.getId());

            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            log.error("Code review failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(
                Map.of(
                        "status", "UP",
                        "service", "AI Code Review Service",
                        "version", "1.0"));
    }

    @GetMapping("/test")
    public ResponseEntity<?> testApi() {
        log.info("Test API called");

        return ResponseEntity.ok(
                Map.of(
                        "status", "SUCCESS",
                        "message", "API is working fine 🚀",
                        "timestamp", System.currentTimeMillis()));
    }
}
