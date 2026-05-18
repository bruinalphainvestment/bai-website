import { draftMode } from 'next/headers';

export async function DraftModeBanner() {
  const draft = await draftMode();
  if (!draft.isEnabled) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      role="status"
      aria-label="Draft mode active — click to exit live preview"
      className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-[#C5A059] bg-[#002147] px-4 py-2 text-sm font-medium text-[#F5F5F0] shadow-lg transition hover:bg-[#0A1428] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
    >
      <span aria-hidden="true">✏️</span>
      <span>Editing draft — click to exit</span>
    </a>
  );
}
