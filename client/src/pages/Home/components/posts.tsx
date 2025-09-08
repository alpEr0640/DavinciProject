import { useState } from "react";
import PostDetailModal from "./post-modal";
import { useMainContext } from "../../../context/main-context";
import { Button } from "@/components/ui/button";
import { removePostByIdLS, updatePostByIdLS } from "@/services/posts";
import { usePostsActions } from "@/hooks/posts";
import AddPostModal from "./add-post-modal";
import { useConfirm } from "@/components/confirm-dialog";
import { initials } from "@/utils/initial";
type Post = { id: number; userId: number; title: string; body: string };



export default function Posts() {
  const { selectedUserId } = useMainContext();
  const { getPosts } = usePostsActions(selectedUserId);
  const { data, isLoading, isError, refetch } = getPosts;

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { setSelectedUserId } = useMainContext();
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
  const handleClearSelectedUser = () => {
    setSelectedUserId(undefined);
  };
  const handleEditClick = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    handleOpen(post, true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    const ok = await confirm({
      title: `${post.id} numaralı gönderi silinsin mi?`,
      description: (
        <div className="space-y-2">
          <p>Bu işlem geri alınamaz.</p>
        </div>
      ),
      actionText: "Evet, Sil",
      cancelText: "Vazgeç",
      variant: "destructive",
    });
    if (!ok) return;

    if (ok) {
      removePostByIdLS(post.id);
      refetch?.();
      handleClose();
    } else {
      alert("Post bulunamadı veya silinemedi");
    }
  };

  const handleSaveUser = (post: Post) => {
    const ok = updatePostByIdLS(post);
    if (ok) {
      refetch?.();
      handleClose();
    } else {
      alert("Post bulunamadı veya güncellenemedi");
    }
  };

  return (
    <section>
      {isLoading && (
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-800 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 rounded bg-slate-800" />
                  <div className="h-3 w-64 rounded bg-slate-800" />
                  <div className="h-3 w-40 rounded bg-slate-800" />
                </div>
              </div>
              <div className="mt-4 h-2 w-24 rounded bg-slate-700" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4  border-rose-900 bg-rose-950/40 text-rose-200">
          Postlar getirilemedi.
          {refetch && (
            <button
              onClick={() => refetch()}
              className="ml-2 rounded-lg border border-rose-700 bg-rose-700 px-2 py-1 text-sm text-white hover:opacity-90"
            >
              Tekrar dene
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="pt-4 ">
          <div className=" text-right mb-4 ">
            {" "}
            <Button onClick={() => setCreateOpen(true)} className="mx-2">
              Yeni Gönderi Ekle
            </Button>
            <Button onClick={handleClearSelectedUser}>
              {" "}
              Tüm Gönderileri Gör{" "}
            </Button>
          </div>
          {data && data.length === 0 ? (
            <div className="rounded-2xl border p-6 text-slate-600 border-slate-800 bg-slate-900 text-slate-300">
              Henüz post bulunamadı.
            </div>
          ) : (
            <div className=" grid cursor-pointer grid-cols-1 items-stretch justify-center gap-4 lg:grid-cols-2">
              {data &&
                (data as Post[]).map((post) => (
                  <article
                    key={post.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpen(post)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && handleOpen(post)
                    }
                    className="group h-full rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-800 bg-slate-900"
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
                            User #{post.userId}
                          </span>
                          <span className="rounded-full border  px-2 py-0.5 text-[11px] border-slate-700 text-slate-400">
                            ID: {post.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
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
        onSave={handleSaveUser}
        onDelete={handleDeleteClick}
      />
      <AddPostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultUserId={selectedUserId}
      />
    </section>
  );
}
