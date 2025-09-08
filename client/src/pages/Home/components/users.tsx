import { useEffect, useMemo, useRef, useState } from "react";
import { UserCard } from "./user-card";
import UserDetailModal from "./user-modal";
import { useUserActions } from "@/hooks/users";
import type { User } from "@/services/users/type";
import { useMainContext } from "@/context/main-context";
import AddUserModal from "./add-user-modal";
import { useConfirm } from "@/components/confirm-dialog";
import { Button } from "@/components";
import toast from "react-hot-toast";
import { useDebouncedValue } from "@/hooks/debounce";

type UserSortKey = "id" | "name" | "username" | "email";

export default function Users() {
  const { getUsers, updateUser, removeUser } = useUserActions();
  const { data, isLoading, isError } = getUsers;

  const [editMode, setEditMode] = useState(false);
  const { selectedUserId, setSelectedUserId, scrollToId } = useMainContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createUser, setCreateUser] = useState<boolean>(false);
  const confirm = useConfirm();

  /* arama ve sıralama */
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 300);
  const [sortBy, setSortBy] = useState<UserSortKey>("id");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    let rows = data ?? [];
    const s = dq.trim().toLocaleLowerCase("tr");
    if (s) {
      rows = rows.filter((u) =>
        [u.name, u.username, u.email]
          .filter(Boolean)
          .some((v) => String(v).toLocaleLowerCase("tr").includes(s))
      );
    }
    rows = [...rows].sort((a, b) => {
      const av = a[sortBy] as string | number;
      const bv = b[sortBy] as string | number;
      if (typeof av === "number" && typeof bv === "number") {
        return dir === "asc" ? av - bv : bv - av;
      }
      return dir === "asc"
        ? String(av).localeCompare(String(bv), "tr")
        : String(bv).localeCompare(String(av), "tr");
    });
    return rows;
  }, [data, dq, sortBy, dir]);
  /* Bekleme Aralığı */
  const timerRef = useRef<number | null>(null);

  /* modal kontrol */
  const handleCloseDetailModal = () => {
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleOpenDetailModal = (user: User, editable = false) => {
    setSelectedUser(user);
    setEditMode(editable);
  };

  const handleOpenCreateUserModal = () => setCreateUser(true);
  const handleCloseCreateUserModal = () => setCreateUser(false);

  /* Etkileşim Fonksiyonları */
  const handleSeePosts = (userId: number) => {
    setSelectedUserId(userId);
    handleCloseDetailModal();
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      scrollToId("Posts");
      timerRef.current = null;
    }, 2000);
  };

  const requestDelete = async (user: User) => {
    const ok = await confirm({
      title: `${user.name} silinsin mi?`,
      description: (
        <div className="space-y-2">
          <p>Bu işlem geri alınamaz.</p>
          <p className="font-medium">
            KULLANICIYA AİT TÜM GÖNDERİLER SİLİNECEKTİR!
          </p>
        </div>
      ),
      actionText: "Evet, Sil",
      cancelText: "Vazgeç",
      variant: "destructive",
    });
    if (!ok) return;

    removeUser.mutate(user.id, {
      onSuccess: (ok, deletedId) => {
        if (!ok) {
          toast.error("Kullanıcı bulunamadı veya zaten silinmiş.");
        } else {
          if (selectedUserId === deletedId) setSelectedUserId(undefined);
          toast.success(`${user.name} silindi`);
        }
      },
      onError: () => toast.error("Silme sırasında bir hata oluştu."),
    });
  };

  const handleSaveUser = (payload: User) => {
    updateUser.mutate(payload, {
      onSuccess: (ok) => {
        if (ok) {
          handleCloseDetailModal();
          toast.success(`${payload.name} güncellendi`);
        } else {
          toast.error("Güncelleme sırasında bir hata oluştu.");
        }
      },
    });
  };

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <section id="Users">
      {!isLoading && !isError && (
        <div className="pt-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-4">
            <h2 className="text-black text-2xl font-bold">Kullanıcılar</h2>

            {/* 🔧 toolbar */}
            <div className="flex w-full flex-col sm:flex-row sm:flex-wrap gap-2 items-stretch">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ara: ad, kullanıcı adı, e-posta"
                className="w-full sm:flex-1 min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as UserSortKey)}
                className="w-full sm:w-48 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="id">ID</option>
                <option value="name">Ad</option>
                <option value="username">Kullanıcı Adı</option>
                <option value="email">E-posta</option>
              </select>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}
                title="Sıralama yönü"
              >
                {dir === "asc" ? "↑" : "↓"}
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleOpenCreateUserModal}
              >
                Yeni Kullanıcı Ekle
              </Button>
            </div>
          </div>

          {!rows || rows.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Sonuç bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {rows.map((u: User) => (
                <UserCard
                  key={u.id}
                  user={u}
                  onOpen={() => handleOpenDetailModal(u)}
                  onEdit={() => handleOpenDetailModal(u, true)}
                  onDelete={() => requestDelete(u)}
                  onSeePosts={() => handleSeePosts(u.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <UserDetailModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={handleCloseDetailModal}
        onSeePosts={handleSeePosts}
        editable={editMode}
        onSave={handleSaveUser}
        handleEditClick={(_, user) => handleOpenDetailModal(user, true)}
      />
      <AddUserModal open={createUser} onClose={handleCloseCreateUserModal} />
    </section>
  );
}
