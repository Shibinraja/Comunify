export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface profilePicInput {
  profilePic: string;
  fileName: string;
}

export interface userProfileDataInput {
  id: string | null | undefined;
  name: string;
  userName: string;
  fullName: string;
  domainSector: string | null;
  email: string;
  profilePhotoUrl: string;
  displayUserName: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  organization?: string;
}

export interface userProfileUpdateInput {
  userName: string;
  fullName: string | null;
  domainSector: string | null;
  organization?: string;
}
