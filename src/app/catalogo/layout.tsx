import PageBackground from '@/components/PageBackground';

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBackground color="#030303" />
      <div className="min-h-dvh flex flex-col bg-[#FAFAFA] text-[#111]">
        {children}
      </div>
    </>
  );
}
