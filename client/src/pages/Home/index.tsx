import BackToTop from "@/components/back-to-top";
import Users from "./components/users";
import Posts from "./components/posts";

export default function Homepage() {
  return (
    <>
      <section className="mx-12 px-4 py-6 text-slate-100 min-h-[89vh]">
        <div className="flex flex-col">
          <div className="min-w-0">
            <Users />
          </div>

          <div className="min-w-0">
            <Posts />
          </div>
        </div>
      </section>
      <BackToTop />
    </>
  );
}
