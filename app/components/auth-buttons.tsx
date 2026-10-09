import { signIn, signOut } from "@/app/lib/auth";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="auth-controls">
        <span className="user-greeting">
          <span className="user-avatar" aria-hidden="true">
            {(userName ?? "ผู้").slice(0, 1)}
          </span>
          สวัสดี {userName ?? "ผู้ใช้งาน"}
        </span>
        <form
          className="auth-form"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="button button-secondary" type="submit">
            ออกจากระบบ
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      className="auth-form"
      action={async () => {
        "use server";
        // เติม: ชื่อ provider ของ Google (ตัวพิมพ์เล็ก)
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button className="button button-primary" type="submit">
        เข้าสู่ระบบด้วย Google
      </button>
    </form>
  );
}
