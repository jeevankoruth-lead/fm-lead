from dotenv import load_dotenv
import os, imaplib, email

load_dotenv(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
M = imaplib.IMAP4_SSL(os.getenv("IMAP_HOST"), int(os.getenv("IMAP_PORT", "993")))
M.login(os.getenv("IMAP_USERNAME"), os.getenv("IMAP_PASSWORD"))
M.select("INBOX")
owner = os.getenv("OWNER_EMAIL")
q = f'(FROM "{owner}" SUBJECT "Content Approval Request- Focus Mindset - Articles - /")'
st, data = M.search(None, q)
ids = data[0].split() if st == "OK" and data and data[0] else []
print("TOPIC_THREAD_FROM_OWNER", len(ids))
for i in ids[-8:]:
    s, f = M.fetch(i, "(RFC822)")
    msg = email.message_from_bytes(f[0][1])
    print("SUBJECT", msg.get("Subject", ""))
M.logout()
