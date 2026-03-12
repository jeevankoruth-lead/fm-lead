from dotenv import load_dotenv
import os, imaplib

load_dotenv(r"C:/Hugo/bin/fmlead/tools/content_email_agent/.env")
M = imaplib.IMAP4_SSL(os.getenv("IMAP_HOST"), int(os.getenv("IMAP_PORT", "993")))
M.login(os.getenv("IMAP_USERNAME"), os.getenv("IMAP_PASSWORD"))
M.select("INBOX")
owner = os.getenv("OWNER_EMAIL")
st, data = M.search(None, f'(FROM "{owner}")')
ids = data[0].split() if st == "OK" and data and data[0] else []
print("OWNER_EMAIL", owner)
print("IMAP_USERNAME", os.getenv("IMAP_USERNAME"))
print("FROM_OWNER_COUNT", len(ids))
M.logout()
