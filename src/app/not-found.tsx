import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-6xl mb-4">🧳</div>
      <h1 className="text-2xl font-bold text-[#222222] mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-[#6a6a6a] mb-8 text-center">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="bg-sky-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-sky-600 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
