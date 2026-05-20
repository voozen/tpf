import { AmountText } from '@/components/AmountText';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function UiShowcasePage() {
  return (
    <div
      className="min-h-full bg-[var(--app-bg)] p-4 pb-8"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <h1 className="mb-1 text-[24px] font-bold text-[var(--neutral-900)]">
        Design system
      </h1>
      <p className="mb-6 text-[14px] text-[var(--neutral-500)]">
        Tokens and shared components
      </p>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Colors</CardTitle>
            <CardDescription>Primary, semantic, neutral</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {[
              ['Primary 700', 'bg-[var(--primary-700)]'],
              ['Success', 'bg-[var(--success-600)]'],
              ['Danger', 'bg-[var(--danger-600)]'],
              ['Warning', 'bg-[var(--warning-500)]'],
              ['Neutral 500', 'bg-[var(--neutral-500)]'],
            ].map(([label, cls]) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className={`h-10 w-10 rounded-lg ${cls}`} />
                <span className="text-[11px] text-[var(--neutral-500)]">{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button size="lg">Primary CTA (52px)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Email address" type="email" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amounts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <AmountText value={-24.25} />
            <AmountText value={45.0} size="lg" />
            <AmountText value={0} showSign={false} size="md" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <StatusBadge status="success" label="Settled" />
            <StatusBadge status="danger" label="Over limit" />
            <StatusBadge status="warning" label="Due soon" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
