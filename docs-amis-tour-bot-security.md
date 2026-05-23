# AMIS Tour Bot Security Notes (Redacted)

- Do not commit original n8n workflow export files containing secrets.
- Use Netlify Function proxy only: `POST /.netlify/functions/amis-tour-bot`.
- Keep real webhook in env var: `AMIS_TOUR_BOT_WEBHOOK_URL`.
- Never expose provider keys on frontend (Naver/Google/ODsay/DeepL/OpenAI/Gemini).
- If documenting examples, use redacted placeholders only:
  - `NAVER_CLIENT_ID=REDACTED`
  - `NAVER_CLIENT_SECRET=REDACTED`
  - `GOOGLE_API_KEY=REDACTED`
  - `ODSAY_API_KEY=REDACTED`
  - `DEEPL_API_KEY=REDACTED`
  - `OPENAI_API_KEY=REDACTED`
  - `GEMINI_API_KEY=REDACTED`
