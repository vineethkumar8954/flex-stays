package com.flexstays.service;

import com.flexstays.dto.request.AiMessageRequest;
import com.flexstays.dto.response.AiMessageResponse;

public interface AiService {
    AiMessageResponse processMessage(AiMessageRequest request);
}
