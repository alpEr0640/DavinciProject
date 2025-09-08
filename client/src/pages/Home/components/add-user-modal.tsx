import { useEffect, useMemo, useState } from "react";
import Modal from "./modal";
import { initials } from "@/utils/initial";
import { createUserLS, getNextUserIdLS } from "@/services/users";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components";

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddUserModal({ open, onClose }: Props) {
  const qc = useQueryClient();

  const [form, setForm] = useState<Pick<User, "name" | "username" | "email">>({
    name: "",
    username: "",
    email: "",
  });

  const [nextUserId, setNextUserId] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm({ name: "", username: "", email: "" });
    setError(null);
    setNextUserId(getNextUserIdLS());
  }, [open]);

  const canSave = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      form.username.trim() !== "" &&
      /\S+@\S+\.\S+/.test(form.email)
    );
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || saving) return;

    try {
      setSaving(true);
      setError(null);

      await createUserLS(form);
      await qc.invalidateQueries({ queryKey: ["users"] });

      onClose();
    } catch (err: unknown) {
      let msg = "Kullanıcı kaydedilemedi.";
      if (err instanceof Error) msg = err.message;
      else if (typeof err === "string") msg = err;
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Kullanıcı Ekle">
      <form className="flex items-start gap-4" onSubmit={handleSubmit}>
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-base font-bold text-white">
          {initials(form.name)}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border px-2 py-0.5 text-[11px] border-slate-700 text-slate-300">
              Oluşturulacak ID: {nextUserId ?? "—"}
            </span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">E-posta</label>
            <input
              type="email"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
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
