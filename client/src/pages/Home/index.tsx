import BackToTop from "@/components/back-to-top";
import Posts from "./components/posts";
import Users from "./components/users";

export default function Homepage() {
  return (
    <>
      <section className="mx-12 px-4 py-6 text-slate-100 min-h-[89vh]">
        <div className="flex flex-col">
          <div className="min-w-0">
            <Users />
          </div>

          <div className="min-w-0" id="Posts">
            <Posts />
          </div>
        </div>
      </section>
      <BackToTop />
    </>
  );
}
