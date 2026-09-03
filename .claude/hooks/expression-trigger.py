#!/usr/bin/env python3
"""ユーザーの発言に表現の好き嫌いが含まれていたら、/expression-rules での記録を促す UserPromptSubmit フック。"""
import json
import re
import sys

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

prompt = (data.get("prompt") or "").strip()
if not prompt or prompt.startswith("/"):
    sys.exit(0)

NG_WORDS = r"(やめて|使わないで|使うな|禁止|NG|くどい|不自然|AIっぽい|AI臭|ダサい|違和感|回りくどい|言い換えて|書き直して)"
GOOD_WORDS = r"(いいね|良いね|好き|その言い方|この言い方|この書き方|その書き方|それでいい|これでいい|採用|ナイス)"
EXPR_WORDS = r"(表現|言い回し|言い方|書き方|文体|口調|語尾|トーン|文章|フレーズ|言葉)"

is_ng = re.search(NG_WORDS, prompt) is not None
is_good = re.search(GOOD_WORDS, prompt) is not None
about_expr = re.search(EXPR_WORDS, prompt) is not None

# 表現に関する話題で、かつ好き嫌いの語があるときだけ発火（誤爆を減らす）
if not about_expr or not (is_ng or is_good):
    sys.exit(0)

kind = "NG 表現" if is_ng and not is_good else ("良い表現" if is_good and not is_ng else "NG または良い表現")
msg = (
    f"【フック通知】この発言は文章表現への指摘（{kind}）の可能性があります。"
    f"該当する場合は、返答の中で /expression-rules を実行して 40_表現ルール/ に記録してください。"
    f"表現の話ではなければ無視して構いません。"
)

print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "UserPromptSubmit",
        "additionalContext": msg,
    }
}, ensure_ascii=False))
