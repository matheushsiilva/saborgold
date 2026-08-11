import PageBackground from '@/components/PageBackground';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBackground color="#050505" />
      <div className="min-h-dvh flex flex-col bg-[#050505] text-white">
        {children}
      </div>
    </>
  );
}
