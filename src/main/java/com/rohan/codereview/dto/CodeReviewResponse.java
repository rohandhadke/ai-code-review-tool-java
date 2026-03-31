package com.rohan.codereview.dto;

public class CodeReviewResponse {
    private String issues;
    private String refactoredCode;
    private String explanation;

    public CodeReviewResponse() {}

    public CodeReviewResponse(String issues, String refactoredCode, String explanation) {
        this.issues = issues;
        this.refactoredCode = refactoredCode;
        this.explanation = explanation;
    }

    public String getIssues() {
        return issues;
    }

    public void setIssues(String issues) {
        this.issues = issues;
    }

    public String getRefactoredCode() {
        return refactoredCode;
    }

    public void setRefactoredCode(String refactoredCode) {
        this.refactoredCode = refactoredCode;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
