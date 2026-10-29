# AI Mystery Room — Project Specification

> **Primary source:** *Build Your AI Mystery Room — Guide Doc.pdf* (uploaded project guide).
>
> **Labeling convention**
> - **[GUIDE REQUIREMENT]** means the requirement is explicitly stated in the guide.
> - **[ADDITIONAL RECOMMENDATION]** means a practical detail proposed to make implementation, testing, or deployment more reliable. It is not an explicit requirement in the guide.
> - **[OPEN DECISION]** means the guide does not define the behavior and the project team must decide it before implementation.

## 1. Project Overview

### 1.1 Project name
**[GUIDE REQUIREMENT]** AI Mystery Room.

### 1.2 Purpose
**[GUIDE REQUIREMENT]** Build an AI-powered web application in which users create and solve mysteries generated using Gemini. Players investigate suspects, discover clues, request hints, and identify the culprit.

### 1.3 Project objective
**[GUIDE REQUIREMENT]** Plan the project using a detailed specification, build the application, deploy it, and demonstrate a complete mystery-solving experience on the live website.

### 1.4 Problem statement
**[ADDITIONAL RECOMMENDATION]** Many mystery games offer fixed cases and predetermined paths. AI Mystery Room will let a player provide a premise and receive a structured mystery to investigate, while preserving a consistent hidden solution and applying server-side scoring.

### 1.5 Target users
**[GUIDE REQUIREMENT]** Users who want to create and solve AI-generated mysteries.
**[ADDITIONAL RECOMMENDATION]** Design the interface for casual players who may be unfamiliar with detective-game mechanics. Use clear instructions, readable evidence, and visible progress.

## 2. Scope and Deliverables

### 2.1 Core features

The following are **[GUIDE REQUIREMENT]**:
- Enter a mystery premise.
- Select a difficulty level: Easy, Medium, or Hard.
- Generate a mystery with a title, story, suspects, clues, and hints using Gemini.
- Investigate the case and discover clues.
- Request hints.
- Select and submit an accusation.
- Reveal the verdict, culprit, explanation, and score after accusation.
- Start another mystery.
- Keep the culprit and solution on the backend until the player submits an accusation.
- Validate generated AI responses before saving them.
- Calculate and validate scoring on the backend.
- Deploy the complete application and verify the full game on the live website.

### 2.2 Optional enhancements
**[GUIDE REQUIREMENT]** The guide says to document optional enhancements but does not prescribe a particular list.
**[ADDITIONAL RECOMMENDATION]** Possible enhancements, only after all required functionality works:
- Case history for the current browser session.
- A timer or optional challenge mode.
- A shareable final-result card that excludes private solution data until the case is complete.
- Sound and animation preferences.
- Accessibility improvements such as keyboard navigation and reduced-motion support.
- Basic rate limiting and request throttling.

### 2.3 Final deliverables
**[GUIDE REQUIREMENT]**
1. A complete `SPEC.md`.
2. Complete source code in a GitHub repository.
3. A deployed live website URL.
4. A successful end-to-end mystery created and solved on the deployed website.
5. Submission through the project submission form:
   https://bit.ly/ai-mystery-room-sub-form

### 2.4 Deadline
**[GUIDE REQUIREMENT]** The guide states **2 November, 11:59 PM**. The year is not printed alongside the deadline in the document.
**[PROJECT CONTEXT]** The uploaded guide was reviewed on 29 October 2026; confirm with the organizer if the intended deadline is 2 November 2026 and confirm the applicable time zone.

## 3. Technology Stack

### 3.1 Required/suggested stack from the guide
- **Frontend:** React and Vite.
- **Styling:** Tailwind CSS.
- **Routing and HTTP:** React Router DOM and Axios are included in the guide's frontend setup commands.
- **Backend:** Node.js and Express.
- **Database:** MongoDB with Mongoose.
- **AI:** Gemini API using the `@google/genai` package.
- **Validation:** Zod.
- **Development:** Nodemon.
- **Deployment:** Frontend on Vercel; backend on a suitable hosting provider; MongoDB Atlas.

> **[GUIDE NOTE]** The guide presents the technology stack as React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, and Gemini API. Its setup commands additionally install React Router DOM, Axios, Zod, `@google/genai`, and Nodemon.

### 3.2 Environment variables
**[GUIDE REQUIREMENT]** The backend `.env` file should contain these settings:

```dotenv
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**[ADDITIONAL RECOMMENDATION]**
- Keep `.env` out of version control and commit a `.env.example` containing placeholder values only.
- Set production values in the hosting provider's environment-variable settings.
- Never put `GEMINI_API_KEY` in frontend environment variables or client-side code.
- Validate required environment variables when the backend starts and fail with a clear server log if a required value is missing.

## 4. User Flow

**[GUIDE REQUIREMENT]** The complete user journey is:

1. The user opens the website.
2. The user enters a mystery premise and selects a difficulty.
3. Gemini generates the mystery, suspects, clues, and hints.
4. The user investigates and discovers clues.
5. The user requests hints if needed.
6. The user accuses a suspect.
7. The application reveals the verdict, culprit, explanation, and score.
8. The user can start another mystery.

**[ADDITIONAL RECOMMENDATION]** Preserve the case ID during navigation and refreshes where practical. If a case cannot be recovered, show a clear message and a way to return to the home page or create a new case.

## 5. UI and Page Specifications

The guide names five main pages. Required elements below are source-derived; additional interaction details are labeled.

### 5.1 Home
**[GUIDE REQUIREMENT]**
- Project introduction.
- Start button.

**[ADDITIONAL RECOMMENDATION]**
- Explain the basic game loop in a few concise steps.
- Provide a visible indication that cases are AI-generated.
- Include loading, unavailable-service, and navigation states where relevant.

### 5.2 Create Mystery
**[GUIDE REQUIREMENT]**
- Mystery premise input.
- Difficulty selector with Easy, Medium, and Hard.
- Trigger mystery generation.

**[ADDITIONAL RECOMMENDATION]**
- Trim whitespace and validate the premise before sending it.
- Show a loading state while Gemini generates the case.
- Prevent accidental duplicate submissions while generation is in progress.
- Show a retry action if generation fails.

**[OPEN DECISION]**
- Minimum and maximum premise length are not specified by the guide.
- Whether a blank premise is allowed is not specified; recommended behavior is to reject blank input.

### 5.3 Investigation Room
**[GUIDE REQUIREMENT]**
- Story.
- Suspect cards.
- Clues.
- Hints.
- Progress display.

**[ADDITIONAL RECOMMENDATION]**
- Clearly distinguish discovered from undiscovered clues.
- Show the number of clues discovered and hints used.
- Provide a discover action for each clue.
- Do not display hidden solution fields or internal scoring data.
- Use readable evidence text and responsive suspect cards.

**[OPEN DECISION]**
- The guide does not specify whether clues begin hidden, whether clue text is progressively revealed, or whether discovery requires an action. Recommended behavior: show a clue title or locked placeholder and reveal its evidence text when discovered.

### 5.4 Accusation
**[GUIDE REQUIREMENT]**
- Suspect selection.
- Accusation submission.

**[ADDITIONAL RECOMMENDATION]**
- Require exactly one suspect selection before enabling submission.
- Prevent duplicate submissions while the request is in progress.
- Lock further case actions once an accusation is accepted.

### 5.5 Results
**[GUIDE REQUIREMENT]**
- Verdict.
- Score.
- Culprit.
- Explanation.

**[ADDITIONAL RECOMMENDATION]**
- Show the selected suspect and whether the accusation was correct.
- Show a score breakdown: base points, clue points, hint deductions, and final score.
- Provide a “Play Again” action.

### 5.6 Shared UI behavior
**[GUIDE REQUIREMENT]**
- Specify loading states.
- Specify error messages.
- Specify navigation.
- Specify responsive behavior.

**[ADDITIONAL RECOMMENDATION]**
- Provide accessible labels, visible keyboard focus, semantic headings, and sufficient contrast.
- Ensure the layout works on mobile, tablet, and desktop.
- Use consistent error messages that do not expose API keys, stack traces, database details, or hidden solutions.

## 6. Difficulty and Content Requirements

**[GUIDE REQUIREMENT]** Gemini-generated cases must contain the following counts:

| Difficulty | Number of suspects | Number of clues | Number of hints |
|---|---:|---:|---:|
| Easy | 3 | 5 | 2 |
| Medium | 4 | 7 | 3 |
| Hard | 5 | 9 | 3 |

**[GUIDE REQUIREMENT]** The mystery solution must be logically consistent and supported by the clues.

**[ADDITIONAL RECOMMENDATION]** Treat these counts as exact validation rules, not approximate targets. Reject or regenerate output that has missing, duplicate, malformed, or inconsistent items.

## 7. AI Behavior and Output Validation

### 7.1 Generation requirements
**[GUIDE REQUIREMENT]**
- Gemini generates the mystery.
- Define the expected Gemini output format.
- Validate generated responses before saving them.
- Require a logically consistent solution supported by the clues.
- Keep the culprit and solution private until the player submits an accusation.

### 7.2 Recommended internal generation format
**[ADDITIONAL RECOMMENDATION]** The following is an internal server-side data shape. Do not return the `solution` object to the client before the accusation.

```json
{
  "title": "string",
  "premise": "string",
  "story": "string",
  "difficulty": "easy | medium | hard",
  "suspects": [
    {
      "id": "stable-unique-id",
      "name": "string",
      "description": "string",
      "motive": "string",
      "alibi": "string"
    }
  ],
  "clues": [
    {
      "id": "stable-unique-id",
      "title": "string",
      "description": "string",
      "evidence": "string"
    }
  ],
  "hints": [
    {
      "id": "stable-unique-id",
      "text": "string"
    }
  ],
  "solution": {
    "culpritSuspectId": "suspect-id",
    "explanation": "string",
    "reasoning": "string"
  }
}
```

**[ADDITIONAL RECOMMENDATION]** This JSON is a proposed implementation schema, not a literal schema supplied by the guide. The guide requires the information and behavior but does not specify field names or exact JSON shape.

### 7.3 Validation rules
**[GUIDE REQUIREMENT]**
- Validate generated responses before saving.
- Ensure the generated solution is logically consistent and supported by clues.
- Do not reveal the culprit before accusation.

**[ADDITIONAL RECOMMENDATION]**
- Validate all required strings, arrays, enum values, and unique IDs with Zod.
- Enforce exact suspect/clue/hint counts based on difficulty.
- Verify that `culpritSuspectId` matches an existing suspect.
- Reject empty or duplicate IDs and duplicate suspect names where they cause ambiguity.
- Check that clues and solution explanation are present and mutually consistent. Schema validation alone cannot prove logical consistency; add explicit consistency checks and manual test cases.
- If validation fails, retry generation a limited number of times, then return a safe error without saving a malformed case.
- Never trust a client-provided culprit, score, clue count, or hint count.

## 8. Backend API Specification

**[GUIDE REQUIREMENT]** The guide suggests the six endpoints below. Request/response fields are not specified in the guide; the contracts in this section are **[ADDITIONAL RECOMMENDATION]** proposals.

### 8.1 `POST /api/cases` — Generate a mystery

**Recommended request**
```json
{
  "premise": "A priceless painting disappears during a private exhibition.",
  "difficulty": "medium"
}
```

**Recommended successful response**
```json
{
  "case": {
    "id": "case-id",
    "title": "The Missing Masterpiece",
    "premise": "A priceless painting disappears during a private exhibition.",
    "story": "Public story text...",
    "difficulty": "medium",
    "suspects": [
      {
        "id": "suspect-1",
        "name": "Alex Morgan",
        "description": "Gallery curator",
        "motive": "Publicly available narrative information",
        "alibi": "Publicly available narrative information"
      }
    ],
    "clues": [
      {
        "id": "clue-1",
        "title": "The Open Window",
        "discovered": false
      }
    ],
    "hintsRemaining": 3,
    "progress": {
      "cluesDiscovered": 0,
      "hintsUsed": 0
    }
  }
}
```

**Recommended validation**
- `premise` is a non-empty string after trimming.
- `difficulty` is exactly `easy`, `medium`, or `hard`.
- The backend obtains the Gemini key from environment configuration.
- Generated content passes the schema and consistency checks before persistence.

**Recommended errors**
- `400` invalid request.
- `429` request throttled or upstream quota/rate limit encountered, with a safe message.
- `502` Gemini generation failed or returned invalid content after retries.
- `500` unexpected internal error.

### 8.2 `GET /api/cases/:id` — Retrieve an active mystery

**[GUIDE REQUIREMENT]** Retrieve an active mystery.

**[ADDITIONAL RECOMMENDATION]** Return the public case data and current player progress only. Exclude the solution, culprit ID, private reasoning, and other secret fields. Return `404` if the case does not exist or is unavailable to the current player.

### 8.3 `POST /api/cases/:id/clues/:clueId/discover` — Discover a clue

**[GUIDE REQUIREMENT]** Discover a clue.

**[ADDITIONAL RECOMMENDATION]** On a valid request:
- Verify the case exists and is still active.
- Verify the clue belongs to that case.
- Mark the clue as discovered.
- Award clue points only once for each clue.
- Return the newly revealed clue and updated progress.

Suggested response:
```json
{
  "clue": {
    "id": "clue-1",
    "title": "The Open Window",
    "description": "A window latch shows signs of recent tampering.",
    "evidence": "The latch was opened from inside."
  },
  "progress": {
    "cluesDiscovered": 1,
    "hintsUsed": 0,
    "currentScore": 5
  }
}
```

### 8.4 `POST /api/cases/:id/hints` — Request a hint

**[GUIDE REQUIREMENT]** Request a hint.

**[ADDITIONAL RECOMMENDATION]** Return the next available hint, record its use server-side, and apply the 10-point deduction once per hint used. Reject requests after all hints are exhausted. The guide specifies the number of hints available but does not define whether hints must be requested in order; recommended behavior is to serve them in order.

Suggested response:
```json
{
  "hint": {
    "id": "hint-1",
    "text": "Compare the timeline against each suspect's alibi."
  },
  "progress": {
    "hintsUsed": 1,
    "hintsRemaining": 2,
    "currentScore": 0
  }
}
```

### 8.5 `POST /api/cases/:id/accuse` — Submit an accusation

**[GUIDE REQUIREMENT]** Submit an accusation.

**[ADDITIONAL RECOMMENDATION]** Suggested request:
```json
{
  "suspectId": "suspect-2"
}
```

The server should:
- Verify the case is active.
- Verify the suspect belongs to the case.
- Compare the submitted suspect against the private culprit ID.
- Finalize the case and calculate the score on the backend.
- Prevent repeated accusations from changing or farming the score.
- Return the verdict, culprit, explanation, and final score only after the accusation is accepted.

**[OPEN DECISION]** The guide does not state how an incorrect accusation is scored or whether the player gets another attempt. Recommended default: one final accusation per case; an incorrect accusation earns no base points but retains points earned from clues minus hint deductions, with a minimum of zero. Confirm this rule before implementation because it is not specified in the guide.

### 8.6 `GET /api/cases/:id/result` — Retrieve a completed result

**[GUIDE REQUIREMENT]** Retrieve the completed result.

**[ADDITIONAL RECOMMENDATION]** Return results only after the case is finalized. Before finalization, return a suitable conflict response such as `409` without revealing the solution. A completed result can include:
```json
{
  "result": {
    "isCorrect": true,
    "accusedSuspectId": "suspect-2",
    "culpritSuspectId": "suspect-2",
    "culpritName": "Alex Morgan",
    "verdict": "Correct accusation",
    "explanation": "The combined evidence establishes the culprit's opportunity and motive.",
    "score": {
      "basePoints": 150,
      "cluePoints": 25,
      "hintPenalty": 10,
      "finalScore": 165
    }
  }
}
```

### 8.7 API conventions
**[ADDITIONAL RECOMMENDATION]**
- Use JSON request and response bodies.
- Validate request parameters and bodies with Zod.
- Return consistent errors, for example `{ "error": { "code": "INVALID_REQUEST", "message": "Please select a valid difficulty." } }`.
- Do not return stack traces, database connection strings, API keys, or secret solution fields.
- Use an appropriate status code for malformed input, missing cases, unavailable actions, upstream AI failures, and unexpected errors.
- Add request timeouts and bounded retries for Gemini calls.
- Consider rate limiting case generation to control cost and abuse.
- If the app is intended for multiple users, decide how case ownership is represented. The guide does not require user authentication; do not assume it exists.

## 9. Database Design

**[GUIDE REQUIREMENT]** The database model must contain:
- Mystery title.
- Story.
- Difficulty.
- Suspects.
- Clues.
- Hints.
- Player progress.
- Accusation.
- Score.

**[ADDITIONAL RECOMMENDATION]** A single MongoDB/Mongoose `Case` document can embed the generated content and progress for a simple first version. Keep solution fields in the database document but omit them from public response serializers until the case is completed.

### 9.1 Proposed Case document

```json
{
  "_id": "database-generated-id",
  "title": "string",
  "premise": "string",
  "story": "string",
  "difficulty": "easy | medium | hard",
  "suspects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "motive": "string",
      "alibi": "string"
    }
  ],
  "clues": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "evidence": "string",
      "discovered": "boolean",
      "discoveredAt": "date | null"
    }
  ],
  "hints": [
    {
      "id": "string",
      "text": "string"
    }
  ],
  "solution": {
    "culpritSuspectId": "string",
    "explanation": "string",
    "reasoning": "string"
  },
  "progress": {
    "clueIdsDiscovered": ["string"],
    "hintIdsUsed": ["string"]
  },
  "accusation": {
    "suspectId": "string | null",
    "submittedAt": "date | null",
    "isCorrect": "boolean | null"
  },
  "score": {
    "basePoints": "number",
    "cluePoints": "number",
    "hintPenalty": "number",
    "finalScore": "number"
  },
  "status": "active | completed",
  "createdAt": "date",
  "updatedAt": "date"
}
```

**[ADDITIONAL RECOMMENDATION]**
- Use schema validation and timestamps.
- Store stable IDs for suspects, clues, and hints.
- Use server-side atomic updates or transactions where appropriate to avoid duplicate scoring under concurrent requests.
- Treat the embedded `discovered` flags and progress ID arrays as one source of truth; avoid maintaining conflicting duplicate values unless there is a clear reason.
- A single document is a suggested simple implementation, not a mandated database structure.

## 10. Scoring Rules

### 10.1 Rules stated by the guide
**[GUIDE REQUIREMENT]**
- Correct accusation base points:
  - Easy: 100.
  - Medium: 150.
  - Hard: 200.
- Each discovered clue: +5 points.
- Each hint used: −10 points.
- Minimum score: 0.
- Scoring and validation happen on the backend.

### 10.2 Formula
**[ADDITIONAL RECOMMENDATION]** For a correct accusation:

`finalScore = max(0, basePoints + (uniqueDiscoveredClueCount * 5) - (uniqueHintsUsedCount * 10))`

**[ADDITIONAL RECOMMENDATION]** Calculate the score from server-stored progress, not numbers supplied by the browser.

### 10.3 Incorrect accusations
**[OPEN DECISION]** The guide does not define:
- Whether an incorrect accusation earns any base points.
- Whether an incorrect accusation ends the case.
- Whether retries are allowed.
- Whether clue points and hint penalties remain in the final score after an incorrect accusation.

**[ADDITIONAL RECOMMENDATION]** Choose and document one consistent policy before implementation. The proposed API above assumes one final accusation. For an incorrect accusation, a simple default is zero base points plus clue points minus hint penalties, floored at zero. This is a recommendation and must not be mistaken for a guide requirement.

## 11. Security, Privacy, and Reliability

### 11.1 Explicit guide requirements
**[GUIDE REQUIREMENT]**
- Do not expose API keys in frontend code.
- Do not commit secrets to GitHub.
- Keep the culprit and solution on the backend until accusation.
- Validate AI-generated responses before saving them.
- Calculate and validate scores on the backend.
- Handle invalid AI responses safely.
- Handle API failures gracefully.

### 11.2 Additional recommendations
**[ADDITIONAL RECOMMENDATION]**
- Use `.gitignore` for `.env`, logs, and local secret files.
- Keep a `.env.example` with placeholders.
- Sanitize and bound user-supplied premise text.
- Add request timeouts and bounded retry logic for upstream Gemini requests.
- Avoid logging API keys, complete secret solutions, or unnecessary personal data.
- Apply rate limiting to expensive generation endpoints.
- Use HTTPS in production.
- Validate case IDs and all route parameters.
- Prevent duplicate clue awards, duplicate hint deductions, and repeated accusation submissions.
- Return only public case fields from active-case endpoints.
- Do not rely on frontend hiding as security; the solution must not be included in the frontend payload at all.

## 12. Error Handling and Loading States

**[GUIDE REQUIREMENT]** Specify loading states and error messages, and handle invalid AI responses and API failures gracefully.

**[ADDITIONAL RECOMMENDATION]** Implement at least these states:

| Situation | Expected behavior |
|---|---|
| Mystery generation in progress | Show a clear loading indicator; prevent duplicate submission |
| Empty/invalid premise | Show a field-level validation message |
| Invalid difficulty | Reject the request |
| Gemini timeout/rate limit | Show a retryable, non-technical message |
| Invalid Gemini output | Validate; retry within a bounded limit; never save malformed output |
| Case not found | Show a not-found state and a route back to Home |
| Clue already discovered | Do not award points again; return current state or a clear response |
| No hints remaining | Explain that no hints remain; do not deduct points |
| Invalid suspect ID | Reject the accusation without revealing the culprit |
| Result requested before accusation | Do not reveal the solution |
| Database unavailable | Return a safe service error; do not expose credentials |
| Unexpected server error | Show a generic message and log diagnostic details securely |

## 13. Testing and Acceptance Criteria

### 13.1 Acceptance criteria from the guide
The project is complete when:
- Users can generate mysteries at all three difficulty levels.
- Players can investigate, request hints, and submit accusations.
- The solution is not revealed prematurely.
- Scores are calculated and validated by the backend.
- Results display the correct culprit and explanation.
- The application works on the deployed website.

### 13.2 Required test plan
**[ADDITIONAL RECOMMENDATION]** Test at least the following:

#### Mystery generation
- Easy generates exactly 3 suspects, 5 clues, and 2 hints.
- Medium generates exactly 4 suspects, 7 clues, and 3 hints.
- Hard generates exactly 5 suspects, 9 clues, and 3 hints.
- Invalid or incomplete Gemini output is rejected or regenerated safely.
- A failed Gemini request does not save a broken case.

#### Investigation
- A clue can be discovered.
- Discovering the same clue twice does not award extra points.
- Hint use is recorded and deducted only once per hint.
- Hint requests fail safely after the hint allowance is exhausted.
- Progress is returned accurately by the API.

#### Accusation and results
- A valid suspect can be accused.
- Invalid suspect IDs are rejected.
- A correct accusation reveals the culprit and explanation.
- The final score matches the server-side formula.
- Results cannot reveal the culprit before the accusation.
- Repeated accusation requests cannot alter or farm the score.
- Incorrect-accusation behavior follows the chosen, documented policy.

#### Security and reliability
- Gemini API key is absent from frontend bundles and browser responses.
- Active-case API responses contain no solution fields.
- Environment secrets are not committed to GitHub.
- API failures produce safe, understandable messages.
- Production frontend can reach the production backend.
- Production backend can connect to MongoDB Atlas and Gemini.
- The complete game can be played from start to finish on the live website.

### 13.3 Example scoring tests
**[ADDITIONAL RECOMMENDATION]**
- Easy, correct accusation, 5 clues, 0 hints: `100 + 25 = 125`.
- Medium, correct accusation, 5 clues, 1 hint: `150 + 25 - 10 = 165`.
- Hard, correct accusation, 9 clues, 3 hints: `200 + 45 - 30 = 215`.
- Any computed score below zero must return `0`.

## 14. Deployment Plan

### 14.1 Guide requirements
**[GUIDE REQUIREMENT]**
- Deploy the backend to a suitable hosting provider.
- Configure MongoDB Atlas.
- Deploy the frontend to Vercel.
- Configure environment variables.
- Test the complete workflow on the production website.

### 14.2 Additional deployment recommendations
**[ADDITIONAL RECOMMENDATION]**
1. Create the MongoDB Atlas database and a least-privilege database user.
2. Deploy the backend and configure `MONGODB_URI`, `GEMINI_API_KEY`, `CLIENT_URL`, and `PORT` as appropriate for the host.
3. Configure CORS to allow the deployed frontend origin.
4. Deploy the frontend to Vercel and configure its public API base URL.
5. Confirm that no Gemini secret is included in frontend variables or output.
6. Test health/connectivity, generation, clue discovery, hints, accusation, and results using the production URLs.
7. Run a final end-to-end case on the deployed site before submitting.

**[OPEN DECISION]** The guide does not prescribe a specific backend hosting provider, a production URL, a domain name, or a CI/CD workflow.

## 15. Project Structure

**[ADDITIONAL RECOMMENDATION]** Suggested repository layout:

```text
ai-mystery-room/
├── SPEC.md
├── README.md
├── .gitignore
├── client/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── CreateMystery.jsx
│       │   ├── InvestigationRoom.jsx
│       │   ├── Accusation.jsx
│       │   └── Results.jsx
│       ├── components/
│       ├── services/
│       └── styles/
└── server/
    ├── package.json
    ├── .env.example
    └── src/
        ├── app.js
        ├── server.js
        ├── config/
        ├── models/
        ├── routes/
        ├── controllers/
        ├── services/
        │   └── geminiService.js
        ├── validators/
        └── middleware/
```

The structure is a recommendation, not a requirement from the guide.

## 16. Implementation Order

**[ADDITIONAL RECOMMENDATION]** Build incrementally in this order:

1. Finalize and review this `SPEC.md`.
2. Create the frontend and backend projects.
3. Configure environment variables and connect MongoDB.
4. Implement the Mongoose data model and Zod validation.
5. Implement `POST /api/cases` and validate generated content.
6. Implement safe public serialization that omits the solution.
7. Implement case retrieval and clue discovery.
8. Implement hints and server-side score updates.
9. Implement accusation finalization and result retrieval.
10. Build the five frontend pages and connect them to the API.
11. Test the entire workflow locally.
12. Deploy the backend, MongoDB Atlas configuration, and frontend.
13. Test the complete workflow on the deployed site.
14. Submit the GitHub repository and live website URL using the official form.

## 17. Submission Checklist

- [ ] `SPEC.md` is complete and reviewed.
- [ ] React/Vite frontend is implemented.
- [ ] Express backend is implemented.
- [ ] MongoDB Atlas connection works in production.
- [ ] Gemini integration works through the backend.
- [ ] Easy, Medium, and Hard generate the required content counts.
- [ ] Clue discovery works and awards points once per clue.
- [ ] Hints work and apply the specified deduction.
- [ ] Accusations work.
- [ ] Culprit and solution remain private until accusation.
- [ ] Results show verdict, culprit, explanation, and score.
- [ ] Backend validates AI output and score calculations.
- [ ] Error and loading states are handled.
- [ ] Secrets are not exposed or committed.
- [ ] Complete workflow is tested on the live website.
- [ ] GitHub repository URL is ready.
- [ ] Live website URL is ready.
- [ ] Submission form is completed before the stated deadline.

## 18. Source Traceability

The following are directly based on the uploaded guide:
- Project overview and objective.
- Technology stack and setup packages.
- User flow.
- Five page specifications.
- Six suggested API endpoints.
- Database content requirements.
- Difficulty counts.
- Scoring rules.
- Backend-only solution requirement.
- Acceptance criteria.
- Deployment requirements.
- GitHub/live website submission requirements.
- Submission form URL and stated deadline.

All items explicitly marked **[ADDITIONAL RECOMMENDATION]** or **[OPEN DECISION]** are proposed implementation details or gaps the guide leaves undefined; they should not be represented as mandatory instructions from the source document.
