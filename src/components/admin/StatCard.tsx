import Link from "next/link";

type Props = {
  title: string;
  value: number;
  href?: string;
};

export default function StatCard({ title, value, href }: Props) {
  const inner = (
    <>
      <div className="text-gray-500">{title}</div>
      <div className="mt-3 text-4xl font-bold">{value}</div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl bg-white p-6 shadow transition hover:shadow-md"
      >
        {inner}
      </Link>
    );
  }

  return <div className="rounded-xl bg-white p-6 shadow">{inner}</div>;
}
