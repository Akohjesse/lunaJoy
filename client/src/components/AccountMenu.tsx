import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { LuChevronDown as ChevronDown, LuLogOut as LogOut, LuUserRound as UserRound } from "react-icons/lu";
import type { User } from "../types";

type AccountMenuProps = {
  user: User;
  onLogout(): Promise<void>;
};

function Avatar({ user }: { user: User }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [user.avatarUrl]);

  return (
    <span
      className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full
        bg-[#d2ded7] font-bold text-brand-dark"
    >
      {user.name.slice(0, 1)}
      {user.avatarUrl && !imageFailed && <img className="absolute inset-0 h-full w-full object-cover" src={user.avatarUrl} alt="" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} />}
    </span>
  );
}

export function AccountMenu({ user, onLogout }: AccountMenuProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="group flex cursor-pointer items-center gap-2.5 rounded-xl px-1.5 py-1
            text-left outline-none transition-[background-color,transform] duration-150
            ease-[cubic-bezier(.23,1,.32,1)] hover:bg-white/70 active:scale-[.98]
            data-[state=open]:bg-white/80"
          aria-label="Open account menu"
        >
          <Avatar user={user} />
          <span className="hidden min-w-0 flex-col min-[701px]:flex">
            <strong className="max-w-40 truncate text-xs">{user.name}</strong>
            <small className="max-w-44 truncate text-[11px] text-muted">{user.email}</small>
          </span>
          <ChevronDown
            className="hidden text-muted transition-transform duration-150
              group-data-[state=open]:rotate-180 min-[701px]:block"
            size={16}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-150 w-48 rounded-xl border border-line bg-panel p-1.5
            shadow-[0_20px_55px_rgba(31,64,60,.2)] outline-none
            [transform-origin:var(--radix-popover-content-transform-origin)]
            data-[state=open]:animate-[popover-in_180ms_cubic-bezier(.23,1,.32,1)]"
          align="end"
          sideOffset={9}
          collisionPadding={16}
        >
          <Popover.Close asChild>
            <button
              className="flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg
                border-0 bg-transparent px-3 text-sm font-bold text-ink hover:bg-[#f3f0e8]"
              type="button"
            >
              <UserRound size={17} />
              Profile
            </button>
          </Popover.Close>
          <button
            className="flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg
              border-0 bg-transparent px-3 text-sm font-bold text-[#9b493e] hover:bg-[#fae8e3]"
            type="button"
            onClick={() => void onLogout()}
          >
            <LogOut size={17} />
            Log out
          </button>
          <Popover.Arrow className="fill-panel" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
