import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TranslationWorkspace from "@/components/translator/TranslationWorkspace";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <main className="flex-1 w-full min-w-0">
        <TranslationWorkspace />
      </main>
      <Footer />
    </>
  );
}
