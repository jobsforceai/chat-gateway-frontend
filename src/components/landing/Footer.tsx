
export default function Footer() {
  return (
    <footer className="border-t border-slate-700/50 py-8">
      <div className="container mx-auto px-4 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} Bolt Chat. All rights reserved.</p>
      </div>
    </footer>
  );
}
