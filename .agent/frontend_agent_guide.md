# Front‑End Engineering Guide for Code Agents

> **Purpose**: Consistent, predictable, high‑quality front‑end work. Clear expectations. Reduced ambiguity.

---

## 1. Principles

**Ship features, not artifacts.**  
Every change must improve the product for the user or developer.

**Maintain clarity.**  
Prefer explicitness over cleverness. Code should read like a short explanation of itself.

**Accessibility by default.**  
Assume real humans with real constraints.

**Performance is part of the UX.**  
Slow UI is broken UI.

**Small changes move fast.**  
Incremental delivery > big rewrites.


---

## 2. Workflow

### 2.1 Incoming task handling

When receiving a task, the agent answers:

```
1. What is the user story? (Who, what, why)
2. What part of the UI is impacted?
3. What is the smallest functional unit that can be shipped?
```

If any question has unclear inputs, ask for clarification.


### 2.2 Solution design

Produce a short plan:

```
Component(s) affected:
Data dependencies:
Render logic:
State ownership:
Side effects:
Testing / validation approach:
```

No implementation until the plan is stable.


### 2.3 Implementation rules

- Keep components pure where possible
- Use local state sparingly (favor pushing state up or using data flows)
- Keep side effects isolated

```
function Component() {
  const data = useData();        // data retrieval
  const ui = useComponentState(); // pure UI state

  return <UI data={data} ui={ui} />;
}
```


---

## 3. Files & Structure

### 3.1 Co-location

Components own their:
- Styles
- Tests
- Subcomponents

```
/components
  /Button
    Button.tsx
    Button.css
    Button.test.ts
```

Avoid global CSS unless foundational.


### 3.2 Naming

**Clear > short**.

Avoid:
```
utils.ts
index.tsx
```

Prefer:
```
formatCurrency.ts
UserProfileCard.tsx
```


---

## 4. State & Data Flow

**Principle:** Data flows down, actions flow up.

- One component owns state
- Children request changes via callbacks or event handlers

```
<Parent>
  <Child onUpdate={updateParentState} />
</Parent>
```

Never keep redundant state. Derived state must be computed.


---

## 5. Accessibility (A11y)

Minimum checklist:

- Keyboard operations always supported
- Semantic HTML first (buttons are `<button>`, not clickable `<div>`)
- ARIA only when semantics are insufficient
- Sufficient color contrast


---

## 6. Performance

A code agent considers performance **before** coding.

Questions to answer:
```
1. Can this render be lighter?
2. Can we avoid unnecessary re-renders?
3. Can we defer work until needed?
```

Guidelines:
- Use memoization when expensive computations are stable
- Prefer streaming / incremental data handling


---

## 7. Testing Expectations

Types of tests:
- **Unit**: component logic
- **Integration**: interactions between components
- **Smoke**: “page loads without crashing”

```
test("formats amount", () => {
  expect(formatCurrency(1200)).toBe("$1,200.00");
});
```


---

## 8. Communication Protocol

When blocked:

```
State: Blocked
Cause: Missing input X
Next action needed: [ask for input]
```

When delivering work:

```
✅ Completed
🧩 What changed:
- Component modified:
- Behavior added:
- Non-obvious decisions:

🔍 Validation done:
- Tested in browser
- Accessibility checked

👉 Next step:
```


---

## 9. Definition of Done

A task is **done** when:

- UI works and looks correct
- Code reviewed or self-reviewed
- Accessible via keyboard + screen reader
- No console errors or warnings
- Tests pass

Not when the PR is opened.


---

## 10. Decision-Making for Front-End Design

When choosing between options, use this mental model:

1. **Remove until nothing breaks.**  
   If the feature or visual element stops adding clarity, eliminate it.

2. **Function defines form.**  
   Visual decisions follow the core task the user needs to complete.

3. **Restraint is a feature.**  
   If adding something requires explaining it, simplify instead.

4. **Consistency creates trust.**  
   Reuse patterns. Predictability reduces cognitive load.

5. **Honest materials.**  
   If something behaves like a button, style and structure it as a button. No fakery.

6. **Clarity beats novelty.**  
   Familiar interactions > Clever interactions.

7. **Every pixel must justify its existence.**  
   The interface is done when there's nothing more to remove, not when there's nothing more to add.

---

**End of document.****

