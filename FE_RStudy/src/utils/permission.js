import { ROLES } from "../constants/roles";

export const isLeader = (account) => account?.role === ROLES.ADMINISTRATOR && account.isLeader === true;

export const hasPermission = (account, name) => isLeader(account) || (account?.role === ROLES.ADMINISTRATOR && account.permissions?.includes(name) === true);
