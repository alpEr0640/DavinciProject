import { initials } from "@/utils/initial";

export type Post = { id: number; userId: number; title: string; body: string };

type Props = {
  post: Post;
  authorName?: string;
  onOpen: (post: Post) => void;
};

export default function PostCard({ post, authorName, onOpen }: Props) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(post)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(post)}
      className="group h-full rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-800 bg-slate-900 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 text-sm font-bold text-white">
          {initials(post.title)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-100">
            {post.title}
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-slate-300">
            {post.body}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border px-2 py-0.5 text-[11px] border-slate-700 text-slate-300">
              {authorName ? authorName : `User #${post.userId}`}
            </span>
            <span className="rounded-full border px-2 py-0.5 text-[11px] border-slate-700 text-slate-400">
              ID: {post.id}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
