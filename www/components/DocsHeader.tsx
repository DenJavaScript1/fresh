import DocsTitle from "./DocsTitle.tsx";
import NavigationBar from "./NavigationBar.tsx";

export default function DocsHeader(props: { title: string; active: string }) {
  return (
    <div>
      <header class="mx-auto max-w-screen-lg flex gap-3 justify-between">
        <div class="p-4 flex items-center">
          <Logo />
          <DocsTitle title={props.title} />
        </div>
        <NavigationBar class="hidden md:flex" active={props.active} />
      </header>
      <NavigationBar class="md:hidden pb-3" active={props.active} />
    </div>
  );
}

function Logo() {
  return (
    <a href="/" class="flex mr-3 items-center">
      <img
        src="/logo.svg"
        alt="Fresh logo"
        width={40}
        height={40}
      />
    </a>
  );
}
