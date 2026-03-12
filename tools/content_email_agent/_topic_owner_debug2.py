from pathlib import Path
from dotenv import load_dotenv
import os, imaplib, email
import json

load_dotenv(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
state = json.loads(Path(r"C:/Hugo/bin/fmlead/tools/content_email_agent/state.json").read_text(encoding="utf-8"))
processed = set(state.get("processed_message_ids", []))
M = imaplib.IMAP4_SSL(os.getenv("IMAP_HOST"), int(os.getenv("IMAP_PORT", "993")))
M.login(os.getenv("IMAP_USERNAME"), os.getenv("IMAP_PASSWORD"))
M.select("INBOX")
owner = os.getenv("OWNER_EMAIL")
q = f'(FROM "{owner}" SUBJECT "Content Approval Request- Focus Mindset - Articles - /")'
st, data = M.search(None, q)
ids = data[0].split() if st == "OK" and data and data[0] else []
for i in ids:
    s, f = M.fetch(i, "(RFC822)")
    msg = email.message_from_bytes(f[0][1])
    mid = (msg.get("Message-ID", "") or str(i, errors="ignore")).strip()
    print("MID", mid)
    print("IN_PROCESSED", mid in processed)
    print("SUBJ", msg.get("Subject", ""))
    body = ""
    if msg.is_multipart():
        for p in msg.walk():
            if p.get_content_type() == "text/plain" and "attachment" not in str(p.get("Content-Disposition", "")):
                payload = p.get_payload(decode=True)
                body = (payload or b"").decode(p.get_content_charset() or "utf-8", errors="replace")
                break
    else:
        payload = msg.get_payload(decode=True)
        body = (payload or b"").decode(msg.get_content_charset() or "utf-8", errors="replace")
    print("BODY_HEAD", repr("\n".join(body.splitlines()[:5])))
M.logout()
