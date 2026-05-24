import { Plus, Receipt, Search, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AmountText } from '@/components/AmountText';
import { GroupListItem } from '@/components/groups/GroupListItem';
import { pageHeaderStyles, PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/contexts/AppDataContext';
import { APP_FONT_FAMILY } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';

type Section = 'personal' | 'groups';

export function ExpensesPage() {
  const navigate = useNavigate();
  const { groups, listPersonalExpenses, createGroup, joinGroup, setActiveGroup } =
    useAppData();
  const [section, setSection] = useState<Section>('personal');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const personalExpenses = listPersonalExpenses();

  const filteredPersonal = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return personalExpenses;
    return personalExpenses.filter((e) => e.name.toLowerCase().includes(query));
  }, [personalExpenses, search]);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;
    return groups.filter((g) => g.name.toLowerCase().includes(query));
  }, [groups, search]);

  const handleCreateGroup = () => {
    try {
      const group = createGroup(groupName);
      setShowCreateModal(false);
      setGroupName('');
      toast.success(`Group "${group.name}" created`);
      navigate('/group-dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create group');
    }
  };

  const handleJoinGroup = () => {
    try {
      const group = joinGroup(inviteCode);
      setShowJoinModal(false);
      setInviteCode('');
      toast.success(`Joined "${group.name}"`);
      navigate('/group-dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not join group');
    }
  };

  const openGroup = (groupId: string) => {
    setActiveGroup(groupId);
    navigate('/group-dashboard');
  };

  const searchPlaceholder =
    section === 'personal' ? 'Search personal expenses...' : 'Search groups...';
  const searchLabel =
    section === 'personal' ? 'Search personal expenses' : 'Search groups';

  return (
    <div
      className="flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <PageHeader title="Expenses">
        <div className="flex border-b border-border" role="tablist">
          {(['personal', 'groups'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={section === tab}
              onClick={() => {
                setSection(tab);
                setSearch('');
              }}
              className={`flex-1 border-b-2 pb-2 text-[14px] font-semibold leading-[20px] ${
                section === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-[var(--neutral-500)]'
              }`}
            >
              {tab === 'personal' ? 'Personal' : 'Groups'}
            </button>
          ))}
        </div>
        <div className={pageHeaderStyles.footer}>
          <div className="relative">
            <Search
              size={20}
              className="pointer-events-none absolute left-3 top-3 text-[var(--neutral-500)]"
              aria-hidden
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10"
              aria-label={searchLabel}
            />
          </div>
        </div>
      </PageHeader>

      <div className="flex-1 overflow-auto">
        {section === 'personal' ? (
          <>
            {filteredPersonal.length > 0 ? (
              <div className="flex flex-col gap-3 p-4">
                <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  {filteredPersonal.map((expense) => (
                    <div
                      key={expense.id}
                      className="border-b border-border p-4 last:border-b-0"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[14px] font-semibold leading-[20px] text-[var(--neutral-900)]">
                          {expense.name}
                        </span>
                        <AmountText value={expense.amount} size="md" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] leading-[16px] capitalize text-[var(--neutral-500)]">
                          {expense.type}
                        </span>
                        <span className="text-[12px] leading-[16px] text-[var(--neutral-400)]">
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-16">
                <Receipt size={48} className="mb-4 text-border" aria-hidden />
                <p className="mb-2 text-center text-[16px] leading-[24px] text-[var(--neutral-500)]">
                  {search ? 'No expenses match your search' : 'No personal expenses yet'}
                </p>
                <p className="text-center text-[14px] leading-[20px] text-[var(--neutral-400)]">
                  Add a receipt to track your personal spending
                </p>
              </div>
            )}

            <div className="px-4 pb-4">
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={() => navigate('/add-receipt')}
              >
                <Plus size={20} />
                Add expense
              </Button>
            </div>
          </>
        ) : (
          <>
            {filteredGroups.length > 0 ? (
              <div className="flex flex-col gap-3 p-4">
                {filteredGroups.map((group) => (
                  <GroupListItem
                    key={group.id}
                    group={group}
                    onClick={() => openGroup(group.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-16">
                <Users size={48} className="mb-4 text-border" aria-hidden />
                <p className="mb-2 text-center text-[16px] leading-[24px] text-[var(--neutral-500)]">
                  {search ? 'No groups match your search' : 'No groups yet'}
                </p>
                <p className="text-center text-[14px] leading-[20px] text-[var(--neutral-400)]">
                  Create a group or join with an invite code (try DEMO, LUNCH, TRIP)
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 px-4 pb-4">
              <Button size="lg" className="w-full gap-2" onClick={() => setShowCreateModal(true)}>
                <Plus size={20} />
                Create group
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowJoinModal(true)}
              >
                Join with invite code
              </Button>
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCreateModal(false)}
          role="presentation"
        >
          <div
            className="mx-4 w-full max-w-[328px] rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="create-group-title"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="create-group-title"
                className="text-[20px] font-bold leading-[28px] text-[var(--neutral-900)]"
              >
                Create group
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex size-8 items-center justify-center"
                aria-label="Close"
              >
                <X size={20} className="text-[var(--neutral-500)]" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="group-name"
                  className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
                >
                  Group name
                </label>
                <Input
                  id="group-name"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Weekend Trip"
                />
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
              >
                Create group
              </Button>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowJoinModal(false)}
          role="presentation"
        >
          <div
            className="mx-4 w-full max-w-[328px] rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="join-group-title"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="join-group-title"
                className="text-[20px] font-bold leading-[28px] text-[var(--neutral-900)]"
              >
                Join group
              </h2>
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="flex size-8 items-center justify-center"
                aria-label="Close"
              >
                <X size={20} className="text-[var(--neutral-500)]" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="invite-code"
                  className="mb-2 block text-[14px] font-semibold leading-[18px] text-[var(--neutral-900)]"
                >
                  Invite code
                </label>
                <Input
                  id="invite-code"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="e.g. DEMO"
                />
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleJoinGroup}
                disabled={!inviteCode.trim()}
              >
                Join group
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
