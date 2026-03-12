from pathlib import Path
from content_email_agent import load_config, ContentEmailAgent

env = Path(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
state = Path(r"C:/Hugo/bin/fmlead/tools/content_email_agent/state.json")
config = load_config(env)
agent = ContentEmailAgent(config=config, state_path=state)
agent._read_unseen_feedback()
print("processed_once")
changed = 0
for tid, topic in agent.state.get("topics", {}).items():
    if topic.get("status") != "awaiting_approval":
        changed += 1
        print("topic_changed", tid, topic.get("status"), topic.get("draft_id", ""), topic.get("title", ""))
print("changed_count", changed)
print("draft_count", len(agent.state.get("drafts", {})))
