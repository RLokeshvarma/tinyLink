import { neon } from '@neondatabase/serverless';
import { Link } from '../types';

const sql = neon(process.env.DATABASE_URL!);

export async function getAllLinks(): Promise<Link[]> {
  const links = await sql`
    SELECT * FROM links
    ORDER BY created_at DESC
  `;
  return links as Link[];
}

export async function getLinkByCode(code: string): Promise<Link | null> {
  const links = await sql`
    SELECT * FROM links
    WHERE code = ${code}
  `;
  return links.length > 0 ? (links[0] as Link) : null;
}

export async function createLink(code: string, targetUrl: string): Promise<Link> {
  const links = await sql`
    INSERT INTO links (code, target_url)
    VALUES (${code}, ${targetUrl})
    RETURNING *
  `;
  return links[0] as Link;
}

export async function deleteLink(code: string): Promise<void> {
  await sql`
    DELETE FROM links
    WHERE code = ${code}
  `;
}

export async function incrementClickCount(code: string): Promise<void> {
  await sql`
    UPDATE links
    SET total_clicks = total_clicks + 1,
        last_clicked = NOW()
    WHERE code = ${code}
  `;
}