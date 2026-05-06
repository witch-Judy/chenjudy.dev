---
author: Chen Judy
pubDatetime: 2026-02-27T00:00:00.000Z
title: "Five First Principles for Multi-Agent System Design"
lang: en
category: notes
tags:
  - AI
  - Agent
  - system-design
description: "Five universal principles for evaluating any agent system, distilled from the core findings of Google Research's paper Towards a Science of Scaling Agent Systems."
---

> Distilled from the core findings of the Google Research paper *"Towards a Science of Scaling Agent Systems."* These five principles are independent of any specific model or dataset, forming a universal lens for evaluating any agent system.

---

## Prerequisites: Five Agent Architectures

Before diving into the first principles, it's essential to understand the five canonical agent architectures evaluated in the paper. They cover the spectrum from simplest to most complex collaboration patterns, and virtually every real-world agent system can be classified as one of these or a variant.

### SAS (Single-Agent System)

One agent handles everything on its own. All perception, reasoning, and action occur in a single sequential loop, controlled by one LLM instance maintaining a unified memory stream. Even if the agent uses tool calls, self-reflection, or chain-of-thought, as long as there's only one decision-maker, it's still an SAS. Its strengths are zero communication overhead and full context retention; its weaknesses are no parallelism and no external validation.

### MAS - Independent

Multiple agents process subtasks in parallel with no communication between them. The final result is merged through simple aggregation (e.g., majority voting) or external logic. Each agent sees the same input and independently produces output. The strength is maximum parallelism and zero communication overhead; the weakness is that agents cannot correct each other's mistakes and cannot handle tasks requiring collaboration.

### MAS - Decentralized

All agents have equal status and collaborate through fully connected peer-to-peer communication. There's no "boss" — every agent is both worker and reviewer. The strength is that any error has multiple peers who might detect it; the weakness is that communication overhead grows quadratically with the number of agents, and it's prone to group polarization or information loops.

### MAS - Centralized

One coordinator agent is responsible for task allocation and result integration, while worker agents execute specific subtasks and only communicate with the coordinator (star topology). The strength is controllable communication overhead with a clear quality gate; the weakness is that the coordinator becomes a bottleneck and single point of failure, and coordination itself consumes part of the token budget.

### MAS - Hybrid

Building on the centralized model, workers can also engage in limited direct communication with each other. The coordinator handles global scheduling, but workers can exchange information directly when needed. In theory, this combines the orderliness of hierarchical control with the flexibility of lateral communication; in practice, the extra communication channels consume more tokens and may introduce information conflicts. The paper's experiments show it doesn't outperform pure centralized in most scenarios.

### Architecture Complexity at a Glance

| Architecture | Communication | Comm. Overhead | Parallelism | Validation |
|---|---|---|---|---|
| SAS | None | Zero | None | Self-check |
| Independent | None (final merge only) | Very low | Highest | None |
| Decentralized | Fully connected P2P | High | High | Peer review |
| Centralized | Star (via coordinator) | Medium | High | Coordinator validation |
| Hybrid | Star + partial P2P | Highest | High | Coordinator + peer |

**Key insight:** Increasing architectural complexity does not equal improved performance. One of the paper's most important findings is that simpler architectures (SAS or centralized) outperform more complex ones (hybrid or deep hierarchies) in most scenarios, because the cognitive budget consumed by complex communication often exceeds the information gain it provides.

---

## Principle 1: Conservation of Cognitive Budget

**In one sentence: Every message exchanged between agents directly consumes cognitive budget that could otherwise be used for problem-solving — communication is not a free add-on but a rigid cost deducted from a fixed budget.**

Under a fixed token budget (a hard constraint in the real world), every message passed between agents occupies tokens that could have been used for thinking, reasoning, and solving the problem. This is not overhead that can be optimized away — it's an intrinsic physical law of multi-agent architectures.

The paper's data shows that in centralized architectures, communication between the coordinator and workers consumes an average of 15–25% of the total token budget. In hybrid architectures, this percentage is even higher. This means that in a 3-agent centralized system, each worker's actual cognitive budget for problem-solving is only 25–28% of what a single agent would have (75% of total budget divided among 3 workers).

**Intuitive analogy:**
Imagine a company with an 8-hour workday. One person working means a solid 8 hours of actual work. A team of three seems like 24 person-hours, but meetings and coordination take time. In a flat team (centralized), maybe 2 hours go to meetings, leaving 22 person-hours for work. In a three-tier management structure (layers of reporting up), internal overhead alone might eat 4 hours. Meetings (communication) aren't free — they're directly deducted from the time available for doing actual work (reasoning).

**Evaluation criteria:**
When examining any agent system, ask two questions — What percentage of total token consumption goes to inter-agent communication? How much *irreplaceable* information gain does that communication produce? If a system has a high communication tax rate but only produces redundant confirmation of already-known information, it's wasting cognitive budget.

---

## Principle 2: Topological Amplification of Errors

**In one sentence: A system's reliability depends not on how strong each individual agent is, but on whether checkpoints exist along the error propagation path.**

How many other agents an error can affect, whether it can be corrected, and whether it gets amplified — all of this is entirely determined by the system's communication topology.

Three typical patterns form a stark contrast: The independent architecture appears to "isolate risk," but errors go uncorrected and are actually amplified 17.2× at the final aggregation stage. Fully connected decentralized systems give errors a chance to be caught by peers, but also allow errors to spread through chains of social influence. Centralized architectures, by using the coordinator as a checkpoint, achieve the best balance between error propagation and correction.

**Intuitive analogy:**
Independent is like having three students solve the same math problem independently and then taking the majority answer — fine if the problem is easy, but if it's hard enough that two students get it wrong, majority voting selects the wrong answer. Decentralized is like having three students discuss while solving — errors might be caught but can also "lead astray" (a confident wrong student convincing a hesitant correct student). Centralized is like having a teacher supervise — the teacher can make mistakes too, but at least provides an independent checkpoint.

**Evaluation criteria:**
Map out the error propagation paths in the system. Ask yourself: if an agent makes an error at step one, how far can that error propagate? How many independent checkpoints exist along the propagation path? If the answer is "it can reach the final output without any checks," the system's architecture has a serious reliability risk.

---

## Principle 3: Architecture-Task Alignment Determines the Performance Ceiling

**In one sentence: The same team of agents, placed on a matching architecture versus a mismatched one, can show performance gaps of several times — a difference an order of magnitude larger than what you'd get from switching models or tuning parameters.**

The paper's most striking finding: on the same task, with the same base model and the same number of agents, merely changing the architecture (from SAS to centralized, or from independent to decentralized) can cause performance to jump from 0.18 to 0.58, or plummet from 0.60 to 0.18. The only difference is the degree of alignment between task structure and architecture.

This means: a system's performance ceiling is determined first by architecture-task alignment, and only secondarily by agent count and model capability. Stacking more agents or swapping in a stronger model on the wrong architecture is like putting faster tires on the wrong track — diminishing or even negative returns. On the right architecture, even a weaker model can deliver respectable results.

**Intuitive formula:**

```
Actual performance = f(architecture-task alignment) × g(agent count, model capability)
```

The first term dominates the multiplication. If alignment is zero (e.g., using independent parallel architecture for a strictly sequential task), no matter how large the second term, the result is poor.

**Example:**
Moving a piano upstairs and moving 100 boxes of books upstairs require completely different organizational approaches. Moving books can be parallelized with 10 people, each carrying 10 boxes; moving a piano requires 4 people working in sync, step by step. If you organize piano-moving like book-moving (each person carries one corner of the piano?), it's not just inefficient — it simply can't be done. Wrong architecture means more people won't help.

**Evaluation criteria:**
Before choosing an architecture, analyze the task structure: How strong are the dependencies between subtasks? Can they truly be parallelized? How much shared context is needed? The answers directly point to the optimal architecture type.

---

## Principle 4: The Capability Saturation Ceiling

**In one sentence: The gains from multi-agent systems diminish as the base model gets stronger — the stronger the model, the lower the marginal value of multi-agent, down to negative.**

When the base model is powerful enough, a single agent can already handle the task well, and the incremental improvement from multi-agent doesn't cover the coordination costs. The paper's data shows that on certain tasks, a strong model's SAS outperforms the best multi-agent configuration of a weaker model. This means that as base models continue to evolve, many tasks that require multi-agent today may only need a single agent tomorrow. Products whose core moat is "multi-agent architecture" will see that moat naturally eroded by advances in base models.

**Example:**
Think of a tutoring analogy. If a student can only score 30 on a math test, having three tutors coaching from different angles might be highly effective. But if the student already scores 85, disagreements between three tutors, scheduling conflicts, and clashing teaching styles might actually confuse the student — better to have one good tutor providing sustained, focused guidance. "Multi-agent" is like multiple tutors — the weaker the student, the more useful they are; the stronger the student, the more likely they are to do more harm than good.

**Evaluation criteria:**
For the problem this multi-agent system solves, first run a single-agent baseline. If the single agent already performs quite well, seriously ask: Is the multi-agent increment truly worth the coordination cost? Or could a single agent with better prompt engineering achieve the same result?

---

## Principle 5: The Duality of Information Exploration and Task Execution

**In one sentence: Whether a task's core bottleneck is "finding the answer" or "executing the answer" determines the optimal agent topology.**

Tasks can be placed on a spectrum: at one end is "information exploration-intensive" (uncertain where the answer lies, requiring broad search), and at the other end is "execution-intensive" (knowing what to do, but the execution steps are complex with strict sequencing).

Exploration tasks naturally suit multi-agent parallel search — multiple agents simultaneously exploring different directions and consolidating discoveries. Execution tasks naturally suit single-agent sequential execution — because each step depends on the previous step's result, parallelization actually introduces synchronization overhead.

**Evaluation criteria:**
Is the system's core challenge "not knowing where the answer is" (exploration) or "knowing what to do but the execution is complex" (execution)? If the former, decentralized broad exploration may be superior; if the latter, centralized orderly scheduling is better. Does the system's topology match the task's information uncertainty?

---

## How to Use These Five Principles

These five principles form a rapid evaluation checklist. For any agent system, answer five questions in sequence:

| Principle | Core Question | Red Flag |
|---|---|---|
| Conservation of Cognitive Budget | Is the communication tax rate reasonable? | Over 30% of tokens spent on inter-agent communication with no demonstrable information gain |
| Topological Amplification of Errors | Are there checkpoints along error propagation paths? | Errors can reach the final output without any validation |
| Architecture-Task Alignment | Is the architecture choice backed by task structure analysis? | "We use multi-agent because multi-agent is more advanced" |
| Capability Saturation Ceiling | Is single-agent already good enough? | Single-agent baseline is already decent, yet multi-agent is still stacked on |
| Exploration-Execution Duality | Does the topology match information uncertainty? | Execution tasks using exploration topology, or vice versa |

If three or more of the five questions raise red flags, the system most likely needs an architecture-level redesign, not parameter-level optimization.

---

## Corollaries and Practical Methodology

### Corollary A: Tool-Intensive Tasks Favor SAS

**When an agent needs to use a large number of tools (16+), the coordination tax of multi-agent will likely exceed the parallelism gains — favor SAS.**

**Example:** A software engineering task requires the agent to use 16+ tools: reading files, writing files, running code, executing tests, searching the codebase, viewing git logs, installing dependencies, running linters, etc. If you hand this to 3 agents, each needs to learn all the tools (or a subset, requiring extra coordination on who uses which tool). Tool-related token consumption alone gets tripled, while the actual reasoning budget is severely squeezed. Better to have one proficient agent handle the whole thing end to end.

### Corollary B: Always Calculate Costs — Token Consumption Is Constant

**Cost analysis for multi-agent systems should be a prerequisite to architecture decisions, not a post-hoc optimization.**

All experiments in the paper were conducted under **fixed token budget** constraints. This isn't an experimental simplification — it reflects a hard constraint of the real world. Regardless of architecture, the underlying LLM API calls are billed per token, and budgets are always finite.

This means: multi-agent systems are not "spend more money for better results," but a zero-sum game of "given the same budget, how to allocate between reasoning vs. communication." Choose a 3-agent centralized architecture, and the token consumption per invocation is roughly fixed — this isn't a variable you can dramatically reduce through later "optimization"; it's a direct consequence of the architecture choice.

### Corollary C: The Illusion of Multi-Layered Agent Architectures

**All multi-agent architectures in the paper are flat (one layer of coordinator + workers). No experiment supports the claim that "deeper hierarchies are better."**

Yet in actual AI products, we frequently see three-layer, four-layer, or even deeper agent hierarchies. This design intuition comes from an analogy to human organizational management — "big companies have CEOs, VPs, Directors, Managers, so AI systems should have similar hierarchies."

The fundamental flaw in this analogy is: human organizational hierarchies exist because **individual humans have limited cognitive bandwidth** (one person can manage at most 7±2 direct reports), while an LLM's context window can process thousands to hundreds of thousands of tokens simultaneously. Humans need hierarchies to compress and relay information; LLMs don't.

Examining this through the paper's five first principles:

**Violates Principle 1:** Cognitive budget is consumed by the hierarchy. Each layer of summarization costs tokens and is lossy compression — details are discarded, semantics get distorted. Under a fixed token budget, a two-layer architecture might spend 40% of tokens on communication; three layers might exceed 60%.

**Violates Principle 2:** The error propagation chain is too long. Each additional layer means an error passes through one more potentially bias-introducing node before reaching the top-level decision-maker. The paper found that after 10 inter-agent interactions, world state overlap drops to only 34%.

**Violates Principle 4:** If the base model is strong enough, a single agent with sufficient context can do both coordinator and worker work — no hierarchy needed at all.

So why are there still so many multi-layered agent products? Partly because of **narrative-driven architecture design.** "We have a CEO Agent, a CTO Agent, a Product Manager Agent" — this narrative is very appealing to investors and media. But the engineering optimum and narrative appeal are often two very different things.

**The test is simple:** If an AI product advertises that it uses a "multi-layered agent system modeled after big-company management structures," based on this paper's research, the correct first reaction should be skepticism, not admiration.

---

## Practical Methodology: From Intuition to Validation

### The Cold Start Problem of the Formula

The predictive model proposed in the paper (R²=0.513, 87% architecture prediction accuracy) is academically valuable, but has a chicken-and-egg problem in practice: the model's input variables — coordination efficiency, error amplification rate, redundancy — are all empirical metrics that **require running the agent system first to measure.** You want to use the model to decide which architecture to choose, but you need to run all the architectures first to get the inputs.

This means that intuitive rules may actually be more practical — they're rough, but can be applied without running experiments first.

### Recommended Three-Step Decision Process

**Step 1: Task Analysis (5 minutes)**
- Can this task be decomposed into independent subtasks? → Yes: consider multi-agent parallelism
- Do subtasks have strict sequential dependencies? → Yes: lean toward SAS
- Is the core bottleneck exploration or execution? → Exploration: multi-agent; Execution: SAS
- How many tools are needed? → 16+: strongly favor SAS

**Step 2: SAS Baseline (1 hour)**
- Always run an SAS baseline first. This is your reference point
- If SAS already achieves 80%+ satisfaction, seriously consider whether multi-agent is really needed

**Step 3: Minimal Multi-Agent Validation (half day)**
- If SAS isn't sufficient, choose the **simplest** multi-agent architecture (usually centralized, 2–3 agents)
- Compare against the SAS baseline: How much did performance improve? How much did cost increase?
- If performance improvement < cost increase, choose SAS

### Core Mindset: Cost Awareness Throughout

Throughout the entire decision process, one implicit assumption must be kept in mind: **token consumption is essentially constant once the architecture is decided.** Choose a centralized 3-agent architecture, and the token consumption per task invocation is roughly fixed. This isn't a variable you can dramatically reduce through later "optimization" — it's a direct consequence of the architecture choice.

Therefore, cost analysis must be a **prerequisite step**, not a "let's get it running first" afterthought. When choosing an architecture in step one, you should make rough estimates: How many more tokens does this architecture consume compared to SAS? Can my budget handle it? Is this cost sustainable at scale?

Many teams make the mistake of first choosing a complex multi-agent architecture, developing for months, then discovering after launch that token costs are 10× what they expected, and then going back to simplify the architecture — the time and engineering costs wasted in this process far exceed the 10 minutes it would have taken to do a cost estimate upfront.

---

*Original paper: Yubin Kim, Xin Liu et al., "Towards a Science of Scaling Agent Systems: When and Why Agent Systems Work", Google Research, 2025.*
