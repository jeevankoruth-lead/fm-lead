from dotenv import load_dotenv
import os, imaplib, email

load_dotenv(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
M = imaplib.IMAP4_SSL(os.getenv("IMAP_HOST"), int(os.getenv("IMAP_PORT", "993")))
M.login(os.getenv("IMAP_USERNAME"), os.getenv("IMAP_PASSWORD"))
M.select("INBOX")
owner = os.getenv("OWNER_EMAIL")
status, data = M.search(None, f'(FROM "{owner}")')
ids = data[0].split() if status == "OK" and data and data[0] else []
print("OWNER_MSG_COUNT", len(ids))
for i in ids[-15:]:
    st, fetched = M.fetch(i, "(RFC822)")
    msg = email.message_from_bytes(fetched[0][1])
    subj = msg.get("Subject", "")
    frm = msg.get("From", "")
    print("SUBJECT", subj)
    print("FROM", frm)
M.logout()
