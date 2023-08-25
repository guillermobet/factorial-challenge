import Link from "next/link";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface Route {
  id: string;
  name: string;
}

const routes: Route[] = [
  {
    id: "overview",
    name: "Overview",
  },
  {
    id: "users",
    name: "Users",
  },
  {
    id: "transactions",
    name: "Transactions",
  },
];

export default function NavBar() {
  return (
    <nav>
      <Menubar>
        {routes.map((route: Route) => (
          <MenubarMenu key={route.id}>
            <MenubarTrigger>
              <Link href={`/${route.id}`}>{route.name}</Link>
            </MenubarTrigger>
          </MenubarMenu>
        ))}
      </Menubar>
    </nav>
  );
}
