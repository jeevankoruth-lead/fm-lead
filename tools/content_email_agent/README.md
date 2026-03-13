# Focus Mindset Email Agent

This agent does the workflow you described:

1. Create a draft "Focus Mindset" article using AI.
2. Email it to `OWNER_EMAIL` (default `jeevan@fm-lead.com`).
3. Read your reply emails.
4. If your reply is not `approved`, revise and email back.
5. If your reply is `approved`, publish to Hugo in:
   - `content/focus/articles/<slug>/index.md`
   - `content/focus/articles/<slug>/images/feature.png` (auto-generated thumbnail)
   - `content/focus/articles/<slug>/images/detail-1.png` (auto-generated in-article image)
   - `content/focus/articles/<slug>/images/detail-2.png` (auto-generated in-article image)
6. Commit and push to GitHub.

Daily approval workflow:

- Agent can send daily topic approval requests.
- Subject format is:
   - `Content Approval Request- Focus Mindset - Articles - /<article title>`
- Reply with line `approved` to a specific topic email.
- Reply with line `rejected` to explicitly reject and archive a topic idea in agent state.
- Agent then creates that topic's draft with images and emails it back.
- Every topic/draft/revision approval email includes an image mapping reminder block using exact filenames from env vars: `IMAGE_THUMB_FILENAME`, `IMAGE_BODY1_FILENAME`, `IMAGE_BODY2_FILENAME`.
- Topic idea pipeline is capped with `IDEA_PIPELINE_MAX` (default `10`) so idea volume does not grow unbounded.
- Agent can send a weekly reminder email listing topic ideas still awaiting reply (`WEEKLY_IDEA_REMINDER_ENABLED`, `WEEKLY_REMINDER_DAY_0_MON`, `WEEKLY_REMINDER_HOUR_24`).

It supports iterative source-driven editing from email replies:

- Attach `PDF`, `DOCX`, `XLSX` files in your feedback email.
- Attach `JPG`, `JPEG`, `PNG` files in your feedback email when you want to provide publish images.
- Include source `URL`s in the email body.
- Agent ingests sources, improves the draft, and emails back.
- Process repeats until your reply contains a line exactly `approved`.
- Every outgoing agent email includes an attached Excel tracker showing post status (`published`, `draft mode`, `idea`) synced from FM-Lead content and agent state.

Image filename rules for reply attachments:

- Use explicit labels in filenames:
   - `thumb` for featured image
   - `body1` for first in-post image
   - `body2` for second in-post image
- Example filenames: `thumb_site.jpg`, `body1_ops-floor.png`, `body2_dashboard.jpeg`.
- If you reply `approved` with uploaded images that do not include required labels, the agent will not publish and will email you a naming-fix request.
- Uploaded reply images are archived in per-topic folders under `tools/content_email_agent/reply_images/<topic-slug>/`.

Optional image labels in reply body:

- You can add descriptive labels that will be used as image alt text and captions in the published post.
- Add lines like:
   - `thumb label: Exterior of facility operations center at sunrise`
   - `body1 label: Technician inspecting HVAC panel during preventive maintenance`
   - `body2 label: CMMS dashboard review during weekly planning meeting`
- `body1` and `body2` labels are rendered with the in-post images. `thumb` label is saved as `featureimage_alt` in front matter when a featured image exists.

## Setup

1. Open a terminal in `C:/Hugo/bin/fmlead`.
2. Install dependencies:

```powershell
pip install -r tools/content_email_agent/requirements.txt
```

3. (Optional, local model) install Ollama and pull a model:

```powershell
ollama pull llama3.1:8b
```

4. Copy env template and fill it:

```powershell
Copy-Item tools/content_email_agent/.env.example tools/content_email_agent/.env
```

5. Edit `tools/content_email_agent/.env` with your SMTP/IMAP credentials.
6. Choose backend:

- `LLM_BACKEND=ollama` for local model (no OpenAI key required)
- `LLM_BACKEND=openai` for OpenAI API

7. Optional: tune image settings (`IMAGE_PROVIDER`, `IMAGE_QUERY_MODE`, `IMAGE_MODEL`, `IMAGE_SIZE`, `IMAGE_QUALITY`, `IMAGE_STYLE`, `GENERATE_DETAIL_IMAGE`, `IN_POST_IMAGE_COUNT`, `GENERATE_IMAGES`).
8. Optional: set tracker filename with `TRACKER_FILENAME` (default `fmlead_post_tracker.xlsx`).
9. Optional: set approval-email filename mapping (`IMAGE_THUMB_FILENAME`, `IMAGE_BODY1_FILENAME`, `IMAGE_BODY2_FILENAME`).

## Usage

Create and send a new draft:

```powershell
python tools/content_email_agent/fmlead_com_focus_a_writer.py new --brief "Write about focus mindset for facility leaders under pressure" --title "Focus Mindset Under Pressure"
```

Run the email loop (polls inbox):

```powershell
python tools/content_email_agent/fmlead_com_focus_a_writer.py watch
```

Send daily topic approval requests immediately (manual trigger):

```powershell
python tools/content_email_agent/fmlead_com_focus_a_writer.py daily-topics
```

Or run the launcher:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content_email_agent/run_watch.ps1
```

Optional: publish one approved draft manually by id:

```powershell
python tools/content_email_agent/fmlead_com_focus_a_writer.py publish --draft-id <id>
```

## Approval rules

- Reply exactly `approved` to publish.
- Any other reply text is treated as correction instructions.
- Agent replies with the corrected draft and keeps looping.
- Feedback emails can include source attachments and URLs.

## Notes

- The script only processes feedback emails from `OWNER_EMAIL`.
- Each draft email subject contains an id token like `[FM-LEAD-DRAFT:abcd1234]`.
- Keep `watch` running (or schedule it with Windows Task Scheduler).
- On publish, if `GENERATE_IMAGES=true`, agent creates 1 thumbnail (`feature.png`) and 2 in-post images (`detail-1.png`, `detail-2.png`).
- `IMAGE_PROVIDER=unsplash` gives a free image source for local workflows.
- `IMAGE_PROVIDER=openai` uses OpenAI image generation (requires API key/quota).
- `IMAGE_QUERY_MODE=source` makes the model suggest image search terms from the article before downloading images.
- Daily settings: `DAILY_TOPICS_ENABLED`, `DAILY_TOPICS_COUNT`, `DAILY_TOPICS_HOUR_24`.
- Idea pipeline cap: `IDEA_PIPELINE_MAX` (default `10`).
- Weekly unanswered-topic reminder settings: `WEEKLY_IDEA_REMINDER_ENABLED`, `WEEKLY_REMINDER_DAY_0_MON`, `WEEKLY_REMINDER_HOUR_24`.
- Source attachments are archived under `tools/content_email_agent/inbox_sources/<draft_id>/`.

## Task Scheduler (Windows)

1. Open Task Scheduler > Create Task.
2. Trigger: `At log on`.
3. Action: `Start a program`.
4. Program/script: `powershell.exe`
5. Add arguments:

```text
-ExecutionPolicy Bypass -File C:\Hugo\bin\fmlead\tools\content_email_agent\run_watch.ps1
```

6. Enable `Run whether user is logged on or not` if you want fully unattended behavior.
