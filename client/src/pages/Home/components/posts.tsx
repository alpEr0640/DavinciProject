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

export default function Posts() {
  const { selectedUserId, setSelectedUserId } = useMainContext();

  const { getPosts } = usePostsActions(selectedUserId);
  const { data, isLoading, isError, refetch } = getPosts;

  const { getUsers } = useUserActions();
  const userById = useMemo(
    () => new Map((getUsers.data ?? []).map((u) => [u.id, u])),
    [getUsers.data]
  );

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editMode, setEditMode] = useState(false);
  const confirm = useConfirm();
  const [createOpen, setCreateOpen] = useState(false);

  const handleOpen = (post: Post, editable = false) => {
    setSelectedPost(post);
    setEditMode(editable);
  };

  const handleClose = () => {
    setSelectedPost(null);
    setEditMode(false);
  };

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
      toast.success(`Gönderi Güncellendi`);
    } else {
      toast.error("Güncelleme sırasında bir hata oluştu.");
    }
  };

  return (
    <section id="Posts">
      {!isLoading && !isError && (
        <div className="pt-4">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-y-4 mb-4">
            <h2 className="text-black text-2xl font-bold"> Gönderiler </h2>
            <div className="flex flex-col md:flex-row gap-y-4">
              <Button onClick={() => setCreateOpen(true)} className="mx-2">
                Yeni Gönderi Ekle
              </Button>
              <Button onClick={handleClearSelectedUser}>
                Tüm Gönderileri Gör
              </Button>
            </div>
          </div>

          {data && data.length === 0 ? (
            <div className="rounded-2xl border p-6 text-slate-600 border-slate-800 bg-slate-900 text-slate-300">
              Henüz post bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch justify-center gap-4 lg:grid-cols-2">
              {data?.map((post) => (
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
