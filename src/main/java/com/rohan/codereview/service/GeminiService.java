package com.rohan.codereview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rohan.codereview.dto.CodeReviewResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public GeminiService(WebClient webClient, ObjectMapper objectMapper) {
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }

    public CodeReviewResponse reviewCode(String code, String language) {
        log.info("Received code review request, language: {}", language != null ? language : "not specified");

        String prompt = buildPrompt(code, language);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            log.debug("Sending request to Gemini API");

            String response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("Received response from Gemini API");
            return parseResponse(response);
        } catch (WebClientResponseException e) {
            log.error("Gemini API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Gemini API returned error: " + e.getStatusCode());
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            throw new RuntimeException("Failed to get response from Gemini API: " + e.getMessage());
        }
    }

    private String buildPrompt(String code, String language) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are a senior software engineer and code reviewer.\n\n");
        prompt.append("Analyze the given code and respond strictly in the following format:\n\n");
        prompt.append("ISSUES:\n");
        prompt.append("* List bugs and bad practices clearly\n\n");
        prompt.append("REFACTORED_CODE:\n");
        prompt.append("<Provide improved version of code>\n\n");
        prompt.append("EXPLANATION:\n");
        prompt.append("Explain the code in simple beginner-friendly English.\n\n");

        if (language != null && !language.isBlank()) {
            prompt.append("Language: ").append(language).append("\n\n");
        }

        prompt.append("CODE:\n");
        prompt.append(code);

        return prompt.toString();
    }

    private CodeReviewResponse parseResponse(String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);
        String text = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText();

        log.debug("Raw Gemini response text: {}", text);

        return parseSections(text);
    }

    private CodeReviewResponse parseSections(String text) {
        String issues = extractSection(text, "ISSUES:", new String[]{"REFACTORED_CODE:", "REFACTORED CODE:"});
        String refactoredCode = extractSection(text, new String[]{"REFACTORED_CODE:", "REFACTORED CODE:"}, new String[]{"EXPLANATION:"});
        String explanation = extractSection(text, "EXPLANATION:", null);

        // Clean up markdown code fences from refactored code
        refactoredCode = refactoredCode
                .replaceAll("```[a-zA-Z]*\\s*\\n?", "")
                .replaceAll("```\\s*", "")
                .trim();

        if (issues.isEmpty() && refactoredCode.isEmpty() && explanation.isEmpty()) {
            log.warn("Could not parse sections from Gemini response, returning full text as explanation");
            return new CodeReviewResponse("No issues parsed.", "", text.trim());
        }

        return new CodeReviewResponse(issues, refactoredCode, explanation);
    }

    private String extractSection(String text, String startMarker, String[] endMarkers) {
        return extractSection(text, new String[]{startMarker}, endMarkers);
    }

    private String extractSection(String text, String[] startMarkers, String[] endMarkers) {
        int startIdx = -1;
        String matchedMarker = null;

        for (String marker : startMarkers) {
            int idx = text.indexOf(marker);
            if (idx != -1 && (startIdx == -1 || idx < startIdx)) {
                startIdx = idx;
                matchedMarker = marker;
            }
        }

        if (startIdx == -1) {
            return "";
        }

        int contentStart = startIdx + matchedMarker.length();

        int endIdx = text.length();
        if (endMarkers != null) {
            for (String marker : endMarkers) {
                int idx = text.indexOf(marker, contentStart);
                if (idx != -1 && idx < endIdx) {
                    endIdx = idx;
                }
            }
        }

        return text.substring(contentStart, endIdx).trim();
    }
}
