import { APP_FONT_FAMILY } from '@/lib/constants';

type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div
      className="flex min-h-full flex-col justify-center gap-2 bg-[var(--app-bg)] p-4"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <h1 className="text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
        {title}
      </h1>
      <p className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
        Work in progress.
      </p>
    </div>
  );
}
