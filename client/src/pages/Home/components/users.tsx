import { useState } from "react";
import { UserCard } from "./user-card";
import UserDetailModal from "./user-modal";
import { useUserActions } from "@/hooks/users";
import type { User } from "@/services/users/type";
import { useMainContext } from "@/context/main-context";
import { Button } from "@/components/ui/button";

import AddUserModal from "./add-user-modal";
import { useConfirm } from "@/components/confirm-dialog";

export default function Users() {
  const { getUsers, updateUser, removeUser } = useUserActions();
  const { data, isLoading, isError } = getUsers;
  const [editMode, setEditMode] = useState(false);
  const { selectedUserId, setSelectedUserId, scrollToId } = useMainContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createUser, setCreateUser] = useState<boolean>(false);

  const confirm = useConfirm();

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

  const handleSeePosts = (userId: number) => {
    setSelectedUserId(userId);
    handleCloseDetailModal();
    requestAnimationFrame(() => scrollToId("Posts"));
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
        if (!ok) alert("Kullanıcı bulunamadı veya zaten silinmiş.");
        else if (selectedUserId === deletedId) setSelectedUserId(undefined);
      },
      onError: () => alert("Bir hata oluştu."),
    });
  };

  const handleSaveUser = (payload: User) => {
    updateUser.mutate(payload, {
      onSuccess: (ok) => {
        if (ok) handleCloseDetailModal();
        else alert("Kullanıcı bulunamadı veya güncellenemedi.");
      },
    });
  };

  return (
    <section id="Users">
      {!isLoading && !isError && (
        <div className="pt-4">
          <div className="text-right mb-4">
            <Button onClick={handleOpenCreateUserModal}>
              Yeni Kullanıcı Ekle
            </Button>
          </div>

          {!data || data.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Aramanıza uygun sonuç bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch justify-center gap-4 lg:grid-cols-2">
              {data.map((u: User) => (
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
