#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web remote sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install the rtk CLI (https://github.com/rtk-ai/rtk) if not already present.
if ! command -v rtk >/dev/null 2>&1; then
  cargo install --git https://github.com/rtk-ai/rtk
fi

# Register the rtk PreToolUse hook globally so it applies for every session.
rtk init -g --auto-patch
