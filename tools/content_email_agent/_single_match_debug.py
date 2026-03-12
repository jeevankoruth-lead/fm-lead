from pathlib import Path
import os, imaplib, email
from dotenv import load_dotenv
from content_email_agent import load_config, ContentEmailAgent

env = Path(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
state = Path(r"C:/Hugo/bin/fmlead/tools/content_email_agent/state.json")
config = load_config(env)
agent = ContentEmailAgent(config=config, state_path=state)

load_dotenv(env)
M = imaplib.IMAP4_SSL(os.getenv("IMAP_HOST"), int(os.getenv("IMAP_PORT", "993")))
M.login(os.getenv("IMAP_USERNAME"), os.getenv("IMAP_PASSWORD"))
M.select("INBOX")
q = f'(FROM "{os.getenv("OWNER_EMAIL")}" SUBJECT "5 Essential Questions to Ask Your Team for Better FM Decision-Making")'
st, data = M.search(None, q)
ids = data[0].split() if st == 'OK' and data and data[0] else []
print('IDS', len(ids))
if ids:
    i = ids[-1]
    s, f = M.fetch(i, '(RFC822)')
    msg = email.message_from_bytes(f[0][1])
    subject = msg.get('Subject','')
    body = agent._extract_text_body(msg).strip()
    title = agent._extract_title_from_topic_subject(subject)
    t1 = agent._find_topic_by_title(title)
    t2 = agent._find_topic_by_feedback_text(body)
    print('SUBJ', subject)
    print('TITLE_EXTRACT', repr(title))
    print('T1', bool(t1), t1.get('id') if t1 else None)
    print('BODY_HEAD', repr('\n'.join(body.splitlines()[:6])))
    print('T2', bool(t2), t2.get('id') if t2 else None)
M.logout()
