# Backend Engineering Guide for Code Agents

> **Purpose**: Deliver reliable, observable, maintainable backend systems. Prioritize correctness, clarity, and durability.

---

## 1. Principles

**Data is the source of truth.**  
The system exists to transform and move data correctly.

**Predictability over cleverness.**  
Optimizations are justified with measurement.

**Failure is a design constraint.**  
Every service must assume the network is unreliable, dependencies fail, and input is malformed.

**Small, reversible changes.**  
Iterate through narrowly scoped commits.

**APIs are contracts.**  
They must be stable, versioned, and documented.

---

## 2. Workflow

### 2.1 Incoming task handling

Before coding, answer:
```
1. What user or system behavior changes?
2. Which data flows will be affected?
3. What’s the smallest deployable slice?
```
Unclear? Request clarification.

### 2.2 Solution design

Create a minimal plan:
```
Domain entities involved:
Inputs/outputs (payloads, structures):
Persistence impact:
Failure cases & retry paths:
Observability (logging/metrics/tracing):
```
No code before this exists.

### 2.3 Implementation rules

- Keep business logic isolated from handlers, frameworks, drivers
- Stateless request handlers, stateful domain logic
- Prefer pure functions for core logic

```
Handler -> Service -> Domain Logic -> Persistence
```

---

## 3. Structure & Files

### 3.1 Boundaries

Code separation:
- `api/` — request/response & routing
- `domain/` — business rules, core entities
- `infra/` — databases, messaging, external calls

Domain never depends on infra.

### 3.2 Naming

Name by intent:
```
UserService.ts      // good
processor.ts        // unclear
```

---

## 4. Data & State

**Single ownership of state.**  
Avoid scattering persistence or caching logic.

- Derived data is computed, not stored
- Prefer immutable structures in-domain

---

## 5. Error Handling

Errors reveal system boundaries.

Rules:
```
Fail clearly
Fail early
Fail with context
```

Never swallow errors.

```
throw new DomainError("User not found", { userId })
```

---

## 6. Observability

Every deployed slice must be introspectable.

Minimum requirements:
- Structured logs
- Trace identifiers
- Metrics with dimensionality (labels)

```
log.info("user.created", { userId })
```

If you can’t see it, you can’t fix it.

---

## 7. Performance

Performance decisions require measurement.

Questions:
```
Is this code on the hot path?
Can we batch or debounce instead of optimize loops?
Can we push computation to where data lives?
```

Prefer simplification before optimization.

---

## 8. Testing Expectations

Types:
- **Unit** tests cover business logic
- **Integration** tests validate persistence + external calls
- **Contract** tests guard API stability

```
expect(userRepo.findById("123")).toEqual({...})
```

---

## 9. Communication Protocol

When blocked:
```
State: Blocked
Cause: dependency or unclear requirement
Next action: request clarification
```

When submitting a change:
```
✅ Done
🧩 What changed
🔍 Verification: tests, logs observed, metrics checked
```

---

## 10. Decision-Making for System Design

1. **Minimize surface area.**  
   Every exposed endpoint or feature becomes a permanent contract.

2. **Bias toward boring solutions.**  
   Novelty increases operational cost.

3. **Design for recovery, not perfection.**  
   Systems must fail safely and restart cleanly.

4. **Simplicity reduces incidents.**  
   If a diagram requires explaining, simplify.

5. **Truth lives closest to the data.**  
   Push validation, filtering, and shaping toward where data originates.

6. **Latency compounds across chains.**  
   Reduce hops and synchronous dependencies.

7. **Every dependency is a liability.**  
   Add one only when justification outweighs cost.

---

**End of document.**

