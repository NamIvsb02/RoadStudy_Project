import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import MainNav from "./MainNav";
import SearchBox from "./SearchBox";
import UserMenu from "./UserMenu";

const iconButton = "inline-flex size-10 items-center justify-center rounded-full bg-surface text-primary transition-colors hover:bg-line";

export default function Header() {
  const { account } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-card">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 lg:px-6">
        <Link to={ROUTES.HOME} className="shrink-0" aria-label="RoadStudy">
          <img src={logo} alt="RoadStudy" className="h-9 w-auto" />
        </Link>
        <SearchBox className="hidden w-56 lg:block" />
        <MainNav />
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button type="button" aria-label="Tìm kiếm" onClick={() => setSearchOpen((value) => !value)} className={`${iconButton} lg:hidden`}>
            <Search size={20} />
          </button>
          {account ? (
            <>
              {/* TODO: nối API thông báo */}
              <button type="button" aria-label="Thông báo" className={iconButton}>
                <Bell size={20} />
              </button>
              <UserMenu />
            </>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link to={ROUTES.REGISTER} className="text-sm font-medium text-primary transition-colors hover:text-primary-dark">
                Đăng ký
              </Link>
              <Link to={ROUTES.LOGIN} className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-line p-3 lg:hidden">
          <SearchBox autoFocus onSubmitted={() => setSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
