import { Camera, Repeat, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { APP_FONT_FAMILY } from '@/lib/constants';

const features = [
  {
    icon: Camera,
    title: 'Scan receipts fast',
    description: 'Use OCR to capture expenses in seconds',
  },
  {
    icon: Users,
    title: 'Split fairly',
    description: 'Custom shares or equal splits per item',
  },
  {
    icon: Repeat,
    title: 'Settle with fewer transfers',
    description: 'Smart debt optimization reduces payment rounds',
  },
] as const;

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex h-full flex-1 flex-col bg-white"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <div className="flex flex-1 flex-col justify-center gap-6 px-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[var(--primary-100)]">
                <Icon size={24} className="text-primary" />
              </div>
              <h3 className="mb-2 text-[18px] font-semibold leading-[24px] text-[var(--neutral-900)]">
                {feature.title}
              </h3>
              <p className="text-[14px] leading-[20px] text-[var(--neutral-500)]">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6">
        <Button size="lg" className="w-full" onClick={() => navigate('/signin')}>
          Get started
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate('/signin')}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
