# Session Context

## User Prompts

### Prompt 1

帮我安装一个claude-squad并配置好，我需要可以同时看多个项目，然后每个项目有多个session，然后可以使用claude和codex

### Prompt 2

I would like to ask whether there will be an audible notification once this project has finished running.

### Prompt 3

我还是需要一段铃声，然后声音好听点

### Prompt 4

# Update Config Skill

Modify Claude Code configuration by updating settings.json files.

## When Hooks Are Required (Not Memory)

If the user wants something to happen automatically in response to an EVENT, they need a **hook** configured in settings.json. Memory/preferences cannot trigger automated actions.

**These require hooks:**
- "Before compacting, ask me what to preserve" → PreCompact hook
- "After writing files, run prettier" → PostToolUse hook with Write|Edit matcher
- "When I run ...

### Prompt 5

然后我现在怎么在我需要的项目下面打开这个？这是一个 UI 吗，还是什么？

