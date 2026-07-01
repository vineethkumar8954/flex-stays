package com.flexstays.controller;

import com.flexstays.dto.request.AiMessageRequest;
import com.flexstays.dto.response.AiMessageResponse;
import com.flexstays.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AiController {

    private final AiService aiService;

    @Autowired
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/message")
    public ResponseEntity<AiMessageResponse> handleMessage(@RequestBody AiMessageRequest request) {
        AiMessageResponse response = aiService.processMessage(request);
        return ResponseEntity.ok(response);
    }
}
