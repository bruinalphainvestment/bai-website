import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request): Promise<Response> {
  const draft = await draftMode();
  draft.disable();

  const url = new URL(request.url);
  const requestedPath = url.searchParams.get('redirect') ?? '/';
  const safePath =
    requestedPath.startsWith('/') && !requestedPath.startsWith('//')
      ? requestedPath
      : '/';

  redirect(safePath);
}
