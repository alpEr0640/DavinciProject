import { useEffect, useMemo, useState } from "react";
import Modal from "./modal";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { getNextPostIdLS, createPostLS } from "@/services/posts";
import { useUserActions } from "@/hooks/users";
import type { User } from "@/services/users/type";
import type { Post } from "@/services/posts/types";
import { initials } from "@/utils/initial";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultUserId?: number;
};

export default function AddPostModal({ open, onClose, defaultUserId }: Props) {
  const qc = useQueryClient();
  const { getUsers } = useUserActions();
  const users = (getUsers.data ?? []) as User[];

  const [nextPostId, setNextPostId] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Pick<Post, "title" | "body" | "userId">>({
    title: "",
    body: "",
    userId: defaultUserId ?? users[0]?.id ?? 0,
  });

  useEffect(() => {
    if (!open) return;
    setNextPostId(getNextPostIdLS());
    setError(null);
    setSaving(false);
    setForm({
      title: "",
      body: "",
      userId: defaultUserId ?? users[0]?.id ?? 0,
    });
  }, [open, defaultUserId, users]);

  const canSave = useMemo(() => {
    return (
      form.userId > 0 && form.title.trim() !== "" && form.body.trim() !== ""
    );
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || saving) return;
    try {
      setSaving(true);
      setError(null);

      await createPostLS(form);
      await qc.invalidateQueries({ queryKey: ["posts"] });

      onClose();
    } catch (err: unknown) {
      let msg = "Gönderi kaydedilemedi.";
      if (err instanceof Error) msg = err.message;
      else if (typeof err === "string") msg = err;
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Gönderi Ekle">
      <form className="flex items-start gap-4" onSubmit={handleSubmit}>
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 text-base font-bold text-white">
          {initials(form.title)}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border px-2 py-0.5 text-[11px] border-slate-700 text-slate-300">
              Oluşturulacak Post ID: {nextPostId ?? "—"}
            </span>
          </div>

          {/* Kullanıcı seçimi */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Kullanıcı
            </label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.userId}
              onChange={(e) =>
                setForm((f) => ({ ...f, userId: Number(e.target.value) }))
              }
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (@{u.username}) — ID: {u.id}
                </option>
              ))}
            </select>
          </div>

          {/* Başlık */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Başlık</label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          {/* İçerik */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">İçerik</label>
            <textarea
              rows={5}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
          </div>

          {error && <div className="text-sm text-rose-400">{error}</div>}

          <div className="pt-2 flex gap-2">
            <Button type="submit" disabled={!canSave || saving}>
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
            <Button variant="secondary" type="button" onClick={onClose}>
              İptal
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
