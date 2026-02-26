---
author: Chen Judy
pubDatetime: 2026-02-27T00:00:00.000Z
title: "Towards a Science of Scaling Agent Systems"
category: collections
tags:
  - AI
  - Agent
  - Research
description: "Google Research 通过 180 种 agent 配置的实验，揭示了多智能体系统的量化 scaling 规律：多 agent 协作在可并行任务上显著提升性能，但在顺序任务上反而会降低。他们的预测模型能在 87% 的未知任务上找到最优架构。"
externalUrl: https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/
---

![Agent Scaling](/chenjudy.dev/assets/blog/agent-scaling.webp)

Google Research 这篇文章做了一件很扎实的事情：不是凭感觉说「多 agent 好」或「单 agent 够」，而是通过 180 种配置的系统实验，给出了量化的 scaling 规律。

**核心发现：**

- 多 agent 协作在**可并行任务**上大幅提升性能，但在**顺序任务**上反而有害
- 他们构建的预测模型能在 87% 的未知任务上正确推荐最优架构
- 不是 agent 越多越好，关键是任务结构决定了最优的 agent 拓扑

这对我们实际做 AI 产品很有参考价值——别一上来就搞复杂的 multi-agent，先想清楚任务能不能拆分并行。

**Paper:** [arxiv.org/pdf/2512.08296](https://arxiv.org/pdf/2512.08296)
