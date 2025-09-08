import Modal from "./modal";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { initials } from "@/utils/initial";

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

type Props = {
  post: Post | null;
  open: boolean;
  onClose: () => void;
  onSeeUserPosts?: (userId: number) => void;
  editable?: boolean;
  onSave?: (p: Post) => void;
  handleEditClick: (e: React.MouseEvent, post: Post) => void;
  onDelete?: (e: React.MouseEvent, post: Post) => void;
};

export default function PostDetailModal({
  post,
  open,
  onClose,
  onSeeUserPosts,
  editable = false,
  onSave,
  handleEditClick,
  onDelete,
}: Props) {
  const [form, setForm] = useState<Post | null>(post);

  useEffect(() => {
    setForm(post);
  }, [post, open]);

  const isDirty = useMemo(() => {
    if (!editable || !post || !form) return false;
    return post.title !== form.title || post.body !== form.body;
  }, [editable, post, form]);

  const canSave =
    editable && !!form && form.title.trim() !== "" && form.body.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSave && form && onSave) onSave(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editable ? "Gönderiyi Düzenle" : "Post Detayı"}
    >
      {!post ? null : (
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-base font-bold text-white">
            {initials(post.title)}
          </div>

          {!editable ? (
            <div className="min-w-0 flex-1">
              <h3 className="text-md font-semibold">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-200">{post.body}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border px-2 py-0.5 text-md border-slate-700 text-slate-300">
                  Post ID: {post.id}
                </span>
                <span className="rounded-full border px-2 py-0.5 text-md border-slate-700 text-slate-300">
                  User ID: {post.userId}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                {!!onSeeUserPosts && (
                  <Button
                    variant="outline"
                    onClick={(e) => onDelete?.(e, post)}
                  >
                    Gönderiyi Sil
                  </Button>
                )}
                <Button onClick={(e) => handleEditClick(e, post)}>
                  Gönderiyi Düzenle
                </Button>
                <Button variant={"destructive"} onClick={onClose}>
                  Kapat
                </Button>
              </div>
            </div>
          ) : (
            <form className="min-w-0 flex-1 space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form?.title ?? ""}
                  onChange={(e) =>
                    form && setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  İçerik
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form?.body ?? ""}
                  onChange={(e) =>
                    form && setForm({ ...form, body: e.target.value })
                  }
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="submit" disabled={!canSave || !isDirty}>
                  Kaydet
                </Button>
                <Button variant="secondary" type="button" onClick={onClose}>
                  İptal
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}
