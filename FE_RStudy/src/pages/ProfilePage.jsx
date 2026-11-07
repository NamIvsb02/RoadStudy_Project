import AvatarUploader from "./profile/AvatarUploader";
import ChangePasswordForm from "./profile/ChangePasswordForm";
import ProfileForm from "./profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-ink">Thông tin cá nhân</h1>
      <AvatarUploader />
      <ProfileForm />
      <ChangePasswordForm />
    </div>
  );
}
