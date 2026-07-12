export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full">
      <aside className="w-64 border-r">
        {/* admin sidebar nav */}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}