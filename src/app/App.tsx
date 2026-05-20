import { useRoutes } from 'react-router-dom';

import { routes } from '@/app/routes';

export function App() {
  const element = useRoutes(routes);

  return (
    <div className="mx-auto min-h-screen w-full min-w-[360px] max-w-[430px] bg-[var(--app-bg)]">
      {element}
    </div>
  );
}
