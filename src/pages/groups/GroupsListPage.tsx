import { Plus, Search, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { GroupListItem } from '@/components/groups/GroupListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/contexts/AppDataContext';
import { APP_FONT_FAMILY } from '@/lib/constants';

export function GroupsListPage() {
  const navigate = useNavigate();
  const { groups, createGroup, joinGroup, setActiveGroup } = useAppData();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

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

  return (
    <div
      className="flex h-full flex-col bg-[var(--app-bg)]"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      <header className="border-b border-border bg-white px-4 pb-4 pt-4">
        <h1 className="mb-4 text-[24px] font-bold leading-[32px] text-[var(--neutral-900)]">
          Groups
        </h1>
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
            placeholder="Search groups..."
            className="pl-10"
            aria-label="Search groups"
          />
        </div>
      </header>

      <div className="flex-1 overflow-auto">
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
