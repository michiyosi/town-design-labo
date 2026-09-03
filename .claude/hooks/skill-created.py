#!/usr/bin/env python3
"""スキル（SKILL.md）が書き込まれたら、Obsidian への保存を Claude に促す PostToolUse フック。"""
import json
import re
import sys

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

tool_input = data.get("tool_input") or {}
path = tool_input.get("file_path") or tool_input.get("path") or ""

m = re.search(r"[\\/]\.claude[\\/]skills[\\/]([^\\/]+)[\\/]SKILL\.md$", path)
if not m:
    sys.exit(0)

skill = m.group(1)
if skill == "obsidian-memo":
    sys.exit(0)

msg = (
    f"【フック通知】スキル「{skill}」の SKILL.md が作成・更新されました。"
    f"ユーザーの指示を待たずに、今すぐ /obsidian-memo を使って "
    f"`10_スキル一覧/{skill}.md` にこのスキルの説明書を保存してください。"
    f"保存後、保存先パスを 1 行で報告してください。"
)

print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "additionalContext": msg,
    }
}, ensure_ascii=False))
