from pathlib import Path
import json
state = json.loads(Path(r"C:/Hugo/bin/fmlead/tools/content_email_agent/state.json").read_text(encoding="utf-8"))
mid = "<CADM_tyfZK7M8jRO0URGVkRYnMcqmD7=1SGxRN1TbnNU21NC-yg@mail.gmail.com>"
print('IN_PROCESSED', mid in set(state.get('processed_message_ids', [])))
print('COUNT', len(state.get('processed_message_ids', [])))
