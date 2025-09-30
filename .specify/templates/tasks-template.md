# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Configure Next.js static export for GitHub Pages compatibility
- [ ] T003 [P] Install GPU.js for parallel computation
- [ ] T004 [P] Configure TypeScript for mathematical precision
- [ ] T005 [P] Set up WebGL shader development environment

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Mathematical accuracy test for Logistic map in tests/math/test_logistic_accuracy.ts
- [ ] T007 [P] Mathematical accuracy test for Hénon map in tests/math/test_henon_accuracy.ts
- [ ] T008 [P] Mathematical accuracy test for Standard map in tests/math/test_standard_accuracy.ts
- [ ] T009 [P] Mathematical accuracy test for CML in tests/math/test_cml_accuracy.ts
- [ ] T010 [P] GPU performance test (60fps target) in tests/performance/test_gpu_performance.ts
- [ ] T011 [P] GitHub Pages static export test in tests/deployment/test_static_export.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T012 [P] Logistic map implementation in lib/maps/logistic.ts
- [ ] T013 [P] Hénon map implementation in lib/maps/henon.ts
- [ ] T014 [P] Standard map implementation in lib/maps/standard.ts
- [ ] T015 [P] CML implementation in lib/maps/cml.ts
- [ ] T016 [P] GPU.js parallel computation layer in lib/computation/gpu.ts
- [ ] T017 [P] WebGL shader implementations in lib/shaders/
- [ ] T018 [P] Web Workers for background calculations in lib/workers/
- [ ] T019 Progressive enhancement feature detection in lib/utils/feature-detection.ts

## Phase 3.4: Integration
- [ ] T020 Integrate GPU.js with map calculations
- [ ] T021 Connect Web Workers to UI without blocking
- [ ] T022 Implement real-time parameter updates
- [ ] T023 Add Canvas 2D fallback for older browsers
- [ ] T024 Mobile touch controls optimization

## Phase 3.5: Polish
- [ ] T025 [P] Documentation for mathematical formulas in docs/math/
- [ ] T026 Performance optimization for 60fps target
- [ ] T027 [P] Update README with GitHub Pages deployment instructions
- [ ] T028 Remove duplication and optimize bundle size
- [ ] T029 Cross-browser compatibility testing
- [ ] T030 Mobile responsive design validation

## Dependencies
- Tests (T006-T011) before implementation (T012-T019)
- T012 blocks T020
- T016 blocks T020
- T018 blocks T021
- Implementation before integration (T020-T024)
- Integration before polish (T025-T030)

## Parallel Example
```
# Launch T006-T011 together:
Task: "Mathematical accuracy test for Logistic map in tests/math/test_logistic_accuracy.ts"
Task: "Mathematical accuracy test for Hénon map in tests/math/test_henon_accuracy.ts"
Task: "Mathematical accuracy test for Standard map in tests/math/test_standard_accuracy.ts"
Task: "Mathematical accuracy test for CML in tests/math/test_cml_accuracy.ts"
Task: "GPU performance test (60fps target) in tests/performance/test_gpu_performance.ts"
Task: "GitHub Pages static export test in tests/deployment/test_static_export.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All mathematical implementations have accuracy tests
- [ ] All GPU computations have performance tests
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] GitHub Pages static export validation included
- [ ] Progressive enhancement fallbacks specified