import Modal from "./modal";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { initials } from "@/utils/initial";

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type Props = {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSeePosts?: (userId: number) => void;
  editable?: boolean;
  onSave?: (u: User) => void;
  handleEditClick: (e: React.MouseEvent, user: User) => void;
};

export default function UserDetailModal({
  user,
  open,
  onClose,
  onSeePosts,
  editable = false,
  onSave,
  handleEditClick,
}: Props) {
  const [form, setForm] = useState<User | null>(user);

  useEffect(() => {
    setForm(user);
  }, [user, open]);

  const isDirty = useMemo(() => {
    if (!editable || !user || !form) return false;
    return (
      user.name !== form.name ||
      user.username !== form.username ||
      user.email !== form.email
    );
  }, [editable, user, form]);

  const canSave =
    editable &&
    !!form &&
    form.name.trim() !== "" &&
    form.username.trim() !== "" &&
    /\S+@\S+\.\S+/.test(form.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSave && form && onSave) onSave(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editable ? "Kullanıcıyı Düzenle" : "Kullanıcı Detayı"}
    >
      {!user ? null : (
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-base font-bold text-white">
            {initials(user.name)}
          </div>

          {!editable ? (
            <div className="min-w-0 flex-1">
              <div className="text-md font-semibold">{user.name}</div>
              <a
                href={`mailto:${user.email}`}
                className="block truncate text-sm text-slate-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {user.email}
              </a>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border px-2 py-0.5 text-md border-slate-700 text-slate-300">
                  @{user.username}
                </span>
                <span className="rounded-full border px-2 py-0.5 text-md border-slate-700 text-slate-300">
                  ID: {user.id}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                {!!onSeePosts && (
                  <Button variant="outline" onClick={() => onSeePosts(user.id)}>
                    Gönderilerini Gör
                  </Button>
                )}
                <Button onClick={(e) => handleEditClick(e, user)}>
                  {" "}
                  Kullanıcıyı Düzenle
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
                  Ad Soyad
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form?.name ?? ""}
                  onChange={(e) =>
                    form && setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form?.username ?? ""}
                  onChange={(e) =>
                    form && setForm({ ...form, username: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form?.email ?? ""}
                  onChange={(e) =>
                    form && setForm({ ...form, email: e.target.value })
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
