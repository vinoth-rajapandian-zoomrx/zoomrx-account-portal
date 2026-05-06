import accessConfig from "@/config/access.json";

type Member = {
  email: string;
  name: string;
  role: string;
  canEdit: boolean;
};

type AOGroup = {
  label: string;
  accounts: string[];
  members: Member[];
};

type Admin = {
  email: string;
  name: string;
  accounts: string[];
  canEdit: boolean;
};

type AccessConfig = {
  aoGroups: Record<string, AOGroup>;
  admins: Admin[];
  defaultAccess: { accounts: string[]; canEdit: boolean };
};

const config = accessConfig as AccessConfig;

export type UserAccess = {
  email: string;
  name: string;
  role: string;
  accounts: string[];
  canEdit: boolean;
  isAdmin: boolean;
  aoGroup: string | null;
};

export function getUserAccess(email: string): UserAccess {
  const emailLower = email.toLowerCase();

  // Check admins
  const admin = config.admins.find(
    (a) => a.email.toLowerCase() === emailLower
  );
  if (admin) {
    return {
      email: admin.email,
      name: admin.name,
      role: "admin",
      accounts: admin.accounts,
      canEdit: admin.canEdit,
      isAdmin: true,
      aoGroup: null,
    };
  }

  // Check AO groups
  for (const [groupKey, group] of Object.entries(config.aoGroups)) {
    const member = group.members.find(
      (m) => m.email.toLowerCase() === emailLower
    );
    if (member) {
      return {
        email: member.email,
        name: member.name,
        role: member.role,
        accounts: group.accounts,
        canEdit: member.canEdit,
        isAdmin: false,
        aoGroup: groupKey,
      };
    }
  }

  // Default access
  return {
    email,
    name: email.split("@")[0],
    role: "viewer",
    accounts: config.defaultAccess.accounts,
    canEdit: config.defaultAccess.canEdit,
    isAdmin: false,
    aoGroup: null,
  };
}

export function canAccessAccount(userAccess: UserAccess, accountSlug: string): boolean {
  if (userAccess.accounts.includes("*")) return true;
  return userAccess.accounts.includes(accountSlug);
}
