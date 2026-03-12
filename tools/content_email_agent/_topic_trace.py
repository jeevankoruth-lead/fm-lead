from pathlib import Path
import email, imaplib
from content_email_agent import load_config, ContentEmailAgent, DRAFT_TOKEN_RE

env = Path(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
state = Path(r"C:/Hugo/bin/fmlead/tools/content_email_agent/state.json")
config = load_config(env)
agent = ContentEmailAgent(config=config, state_path=state)
processed = set(agent.state.get("processed_message_ids", []))

M = imaplib.IMAP4_SSL(config.imap_host, config.imap_port)
M.login(config.imap_username, config.imap_password)
M.select("INBOX")
status, data = M.search(None, f'(FROM "{config.owner_email}" SUBJECT "Content Approval Request- Focus Mindset - Articles - /")')
ids = data[0].split() if status == 'OK' and data and data[0] else []
print('TOTAL_MATCH', len(ids))
for msg_id in reversed(ids[-20:]):
    st, fetched = M.fetch(msg_id, '(RFC822)')
    if st != 'OK' or not fetched or fetched[0] is None:
        continue
    msg = email.message_from_bytes(fetched[0][1])
    mid = (msg.get('Message-ID','') or str(msg_id, errors='ignore')).strip()
    subject = msg.get('Subject','')
    is_reply = subject.strip().lower().startswith('re:') or bool(msg.get('In-Reply-To'))
    already = mid in processed
    title = agent._extract_title_from_topic_subject(subject)
    topic = agent._find_topic_by_title(title)
    body = agent._extract_text_body(msg).strip()
    norm = agent._normalize_feedback(body)
    appr = agent._is_approved(norm)
    print('---')
    print('MID', mid)
    print('ALREADY', already)
    print('SUBJ', subject)
    print('IS_REPLY', is_reply)
    print('TITLE', title)
    print('TOPIC_FOUND', bool(topic))
    print('NORM_HEAD', repr('\n'.join(norm.splitlines()[:3])))
    print('IS_APPROVED', appr)
M.logout()
