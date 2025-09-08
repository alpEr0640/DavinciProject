import { useMemo, useState } from "react";
import PostDetailModal, { type Post } from "./post-modal";
import { useMainContext } from "../../../context/main-context";
import { removePostByIdLS, updatePostByIdLS } from "@/services/posts";
import { usePostsActions } from "@/hooks/posts";
import { useUserActions } from "@/hooks/users";
import AddPostModal from "./add-post-modal";
import { useConfirm } from "@/components/confirm-dialog";
import PostCard from "./post-card";
import { Button } from "@/components";
import toast from "react-hot-toast";
import { useDebouncedValue } from "@/hooks/debounce";

type PostSortKey = "id" | "title" | "userId";

export default function Posts() {
  const { selectedUserId, setSelectedUserId } = useMainContext();
  const confirm = useConfirm();

  const { getPosts } = usePostsActions(selectedUserId);
  const { data, isLoading, isError, refetch } = getPosts;

  const { getUsers } = useUserActions();
  const userById = useMemo(
    () => new Map((getUsers.data ?? []).map((u) => [u.id, u])),
    [getUsers.data]
  );

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  /* arama ve sıralama */
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 300);
  const [sortBy, setSortBy] = useState<PostSortKey>("id");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    let rows = data ?? [];
    const s = dq.trim().toLocaleLowerCase("tr");
    if (s) {
      rows = rows.filter((p) => {
        const author = userById.get(p.userId)?.name ?? "";
        return [p.title, p.body ?? "", author, String(p.userId), String(p.id)]
          .filter(Boolean)
          .some((v) => String(v).toLocaleLowerCase("tr").includes(s));
      });
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
  }, [data, dq, sortBy, dir, userById]);

  /* Modal Kontrol */
  const handleOpen = (post: Post, editable = false) => {
    setSelectedPost(post);
    setEditMode(editable);
  };

  const handleClose = () => {
    setSelectedPost(null);
    setEditMode(false);
  };

    /* etkileşim fonksiyonları */
  const handleSeeUserPosts = (userId: number) => {
    handleClose();
    setSelectedUserId(userId);
  };

  const handleClearSelectedUser = () => setSelectedUserId(undefined);

  const handleEditClick = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    handleOpen(post, true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    const ok = await confirm({
      title: `${post.id} numaralı gönderi silinsin mi?`,
      description: <p>Bu işlem geri alınamaz.</p>,
      actionText: "Evet, Sil",
      cancelText: "Vazgeç",
      variant: "destructive",
    });
    if (!ok) return;

    const removed = removePostByIdLS(post.id);
    if (removed) {
      refetch?.();
      handleClose();
      toast.success(`Gönderi silindi`);
    } else {
      toast.error("Silme sırasında bir hata oluştu.");
    }
  };

  const handleSavePost = (post: Post) => {
    const ok = updatePostByIdLS(post);
    if (ok) {
      refetch?.();
      handleClose();
      toast.success(`Gönderi güncellendi`);
    } else {
      toast.error("Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <section id="Posts" className="scroll-mt-20">
      {!isLoading && !isError && (
        <div className="pt-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-4">
            <h2 className="text-black text-2xl font-bold">Gönderiler</h2>

            <div className="flex w-full flex-col sm:flex-row sm:flex-wrap gap-2 items-stretch">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ara: başlık, içerik, yazar"
                className="w-full min-w-12 sm:flex-1 min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as PostSortKey)}
                className="w-full sm:w-48 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="id">ID</option>
                <option value="title">Başlık</option>
                <option value="userId">Kullanıcı ID</option>
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
                onClick={() => setCreateOpen(true)}
              >
                Yeni Gönderi Ekle
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleClearSelectedUser}
              >
                Tüm Gönderileri Gör
              </Button>
            </div>
          </div>

          {rows && rows.length === 0 ? (
            <div className="rounded-2xl border p-6 text-slate-600 border-slate-800 bg-slate-900 text-slate-300">
              Sonuç bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {rows?.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  authorName={userById.get(post.userId)?.name}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <PostDetailModal
        post={selectedPost}
        open={!!selectedPost}
        onClose={handleClose}
        onSeeUserPosts={handleSeeUserPosts}
        editable={editMode}
        handleEditClick={handleEditClick}
        onSave={handleSavePost}
        onDelete={handleDeleteClick}
        authorName={
          selectedPost
            ? userById.get(selectedPost.userId)?.name ??
              `User #${selectedPost.userId}`
            : undefined
        }
      />

      <AddPostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultUserId={selectedUserId}
      />
    </section>
  );
}
