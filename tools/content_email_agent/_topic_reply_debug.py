from dotenv import load_dotenv
import os, imaplib, email

load_dotenv(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
M = imaplib.IMAP4_SSL(os.getenv("IMAP_HOST"), int(os.getenv("IMAP_PORT", "993")))
M.login(os.getenv("IMAP_USERNAME"), os.getenv("IMAP_PASSWORD"))
M.select("INBOX")
owner = os.getenv("OWNER_EMAIL")
status, data = M.search(None, f'(FROM "{owner}" SUBJECT "Content Approval Request- Focus Mindset - Articles - /")')
ids = data[0].split() if status == "OK" and data and data[0] else []
print("MATCHING_TOPIC_THREAD_MSGS", len(ids))
for i in ids[-12:]:
    st, fetched = M.fetch(i, "(RFC822)")
    msg = email.message_from_bytes(fetched[0][1])
    print("SUBJECT", msg.get("Subject", ""))
    print("MESSAGE_ID", msg.get("Message-ID", ""))
    print("IN_REPLY_TO", msg.get("In-Reply-To", ""))
    print("X_FMLEAD_AGENT", msg.get("X-FMLead-Agent", ""))
M.logout()
