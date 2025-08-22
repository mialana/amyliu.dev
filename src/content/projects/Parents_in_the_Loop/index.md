---
title: Parents in the Loop
slug: Parents_in_the_Loop
startDate: 2025-06-06
endDate: 2025-06-06
type: group
category: personal
demoVideoLink: https://youtu.be/OMv_ZlkKed4
techStack:
    - Django
    - Loveable_AI
    - Gemini_AI
    - Model_Context_Protocol
tags:
    - "2025"
    - hackathon
    - honors
    - social_impact
    - entrepreneurship
    - web
    - backend
    - image_processing
    - natural_language_processing
    - artificial_intelligence
description: 2nd Place and Popular Choice winner at Hack4Impact NYC 2025. An AI-powered interface for school systems to bridge knowledge and language barriers for immigrant parents.
code: https://github.com/mialana/Parents-in-the-Loop
externalLinks:
    - https://devpost.com/software/parent-in-the-loop
    - https://www.linkedin.com/posts/pioneering-minds-ai_mcp-hackforimpact-aiforgood-activity-7337825872734814208-VP1g
    - https://www.linkedin.com/posts/pioneering-minds-ai_agentboostr-demoday-aiforgood-activity-7338354287523086337-pNHc
---

## Summary

**Parents in the Loop** is a full-stack AI prototype that supports immigrant families in navigating complex U.S. school documents such as IEPs, disciplinary notices, and college prep materials. Built in under 8 hours at Hack4Impact NYC 2025, the project combines document parsing with AI-guided explanation, transforming opaque education language into actionable steps. The system integrates Django, a REST API, and the open-source `mcp-agent` protocol to route uploaded documents through an LLM-powered workflow. It won [2nd Place and Popular Choice awards](https://www.linkedin.com/posts/pioneering-minds-ai_mcp-hackforimpact-aiforgood-activity-7337825872734814208-VP1g) and was later showcased to founders and investors at [Pioneering Minds AI demo day](https://www.linkedin.com/posts/pioneering-minds-ai_agentboostr-demoday-aiforgood-activity-7338354287523086337-pNHc).

## Motivation

Across the U.S., over 4.8 million immigrant students rely on parents who often face structural barriers when interacting with schools—language gaps, cultural mismatches, or a lack of familiarity with the American education system. Even routine tasks like supporting homework or responding to a notice can become overwhelming without proper context.

**Parents in the Loop** was built to shift that experience—from confusion to empowered action. The platform serves as an AI-powered advocacy assistant, helping parents decode school communications, understand their rights, and take concrete next steps. Unlike tools that simply deliver information, it aims to level the playing field by making school systems navigable to all families.

Where existing tools like ClassDojo and Remind help schools talk _to_ parents, this platform helps parents speak _for_ their children. Khan Academy teaches kids; we teach parents how to navigate the system. Google Translate converts words—this tool translates opportunities and rights into action.

## Achievements

1. Implemented the full backend using Django REST Framework, including asynchronous document processing, file upload endpoints, and integration with `mcp-agent` for AI-driven document interpretation.
2. Integrated the OpenAIAugmentedLLM workflow via Model Context Protocol to return structured, contextual responses from user-uploaded educational documents.
3. Oversaw frontend development using the [Loveable AI](https://lovable.dev/) codegen platform, which scaffolded a modular, Tailwind-powered Next.js application with dynamic UI components.
4. Designed the backend-to-frontend API interface, enabling a simulated document-to-chat workflow within a conversational UI.
5. Selected as 2nd Place and Popular Choice winner at Hack4Impact NYC 2025; pitched at Pioneering Minds AI Demo Day to startup founders and investors. Received various collaboration offers.

## Next Steps

- [ ] Finalize backend integration of the `mcp-agent` workflow to enable live AI response generation.
- [ ] Implement translation support in frontend.

## Method

The backend is implemented in Django and exposes a REST API for document upload and processing. Files are stored to disk, with references managed by a `Document` model. The core logic of the system resides in `backend/hack4impact/api/agent.py`, where uploaded documents are routed through a Model Context Protocol (MCP) pipeline for AI-driven analysis.

### MCP Integration

The platform uses the [`mcp-agent`](https://github.com/modelcontextprotocol/mcp-agent) framework to mount a local document context and run structured prompts via OpenAI. The document directory is served using a filesystem-based MCP server:

```python
# backend/hack4impact/api/agent.py
settings = Settings(
    execution_engine="asyncio",
    logger=LoggerSettings(type="file", level="info"),
    mcp=MCPSettings(
        servers={
            "filesystem": MCPServerSettings(
                command="npx",
                args=["-y", "@modelcontextprotocol/server-filesystem", filepath],
            ),
        }
    ),
    openai=OpenAISettings(
        api_key=OPENAI_KEY,
        default_model="gpt-4o-mini",
    ),
)
```

A `finder_agent` is instantiated with access to the local server and a custom instruction prompt, defined in `prompt.py`. The OpenAI model is attached using:

```python
# backend/hack4impact/api/agent.py
llm = await finder_agent.attach_llm(OpenAIAugmentedLLM)
```

The main interaction runs `generate_structured()` with a custom `Result` schema, returning a dictionary of sectioned outputs parsed from the document:

```python
# backend/hack4impact/api/agent.py
result = await llm.generate_structured(
    message=message,
    response_model=Result
)
```

This design ensures that AI responses are grounded in the local document context, leveraging MCP’s agent abstraction and OpenAI’s structured output capabilities. All logic is encapsulated within an async `query()` method and invoked during API requests from `views.py`.

![Mcp Agent Demo](assets/mcp_agent_demo.gif)
