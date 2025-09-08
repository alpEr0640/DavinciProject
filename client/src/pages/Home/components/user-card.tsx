import { memo } from "react";
import type { User } from "@/services/users/type";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MessageSquareText } from "lucide-react";
import { initials } from "@/utils/initial";

type Props = {
  user: User;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSeePosts: () => void;
};

function _UserCard({ user, onOpen, onEdit, onDelete, onSeePosts }: Props) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[3rem_1fr] items-center gap-3 sm:gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white shrink-0 mx-auto sm:mx-0">
          {initials(user.name)}
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <div className="truncate text-sm font-semibold">{user.name}</div>
          <a
            className="block truncate text-xs hover:underline"
            href={`mailto:${user.email}`}
            onClick={(e) => e.stopPropagation()}
          >
            {user.email}
          </a>
          <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[11px]">
              @{user.username}
            </span>
            <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[11px]">
              ID: {user.id}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          size="sm"
          className="w-full sm:w-auto"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil />
          <span>Düzenle</span>
        </Button>

        <Button
          type="button"
          size="sm"
          className="w-full sm:w-auto"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 />
          <span>Sil</span>
        </Button>

        <Button
          type="button"
          size="sm"
          className="w-full sm:w-auto"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onSeePosts();
          }}
        >
          <MessageSquareText />
          <span>Gönderileri Gör</span>
        </Button>
      </div>
    </article>
  );
}

export const UserCard = memo(_UserCard);
