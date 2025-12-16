import { auth, isAuthenticated } from '@/auth/auth';
import { HeaderClient } from './header-client';

export async function Header() {
  const isAuth = await isAuthenticated()
  const session = isAuth ? await auth() : null
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out bg-white text-black shadow-md`}
      style={{ backdropFilter: "saturate(180%) blur(8px)" }}
    >
      <HeaderClient user={session?.user} isAuthenticated={isAuth} />
    </header>
  )
}