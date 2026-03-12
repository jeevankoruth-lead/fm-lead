from dotenv import load_dotenv
import os, imaplib, email

load_dotenv(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
M = imaplib.IMAP4_SSL(os.getenv("IMAP_HOST"), int(os.getenv("IMAP_PORT", "993")))
M.login(os.getenv("IMAP_USERNAME"), os.getenv("IMAP_PASSWORD"))
M.select("INBOX")
owner = os.getenv("OWNER_EMAIL")
status, data = M.search(None, f'(UNSEEN FROM "{owner}" SUBJECT "FM-LEAD-DRAFT")')
ids = data[0].split() if status == "OK" and data and data[0] else []
print("MATCHING_UNSEEN", len(ids))
status2, data2 = M.search(None, "UNSEEN")
ids2 = data2[0].split() if status2 == "OK" and data2 and data2[0] else []
print("TOTAL_UNSEEN", len(ids2))
for i in ids2[-5:]:
    st, fetched = M.fetch(i, "(RFC822)")
    msg = email.message_from_bytes(fetched[0][1])
    print("UNSEEN_SUBJECT", msg.get("Subject", ""))
    print("UNSEEN_FROM", msg.get("From", ""))
M.logout()
