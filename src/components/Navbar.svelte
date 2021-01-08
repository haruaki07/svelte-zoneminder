<script>
  import {
    Container,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavLink,
    NavItem,
  } from "sveltestrap";
  import { router } from "tinro";
  import { startsWith } from "../libs/utils";

  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  const routes = [
    {
      text: "Console",
      path: "/",
    },
    {
      text: "Settings",
      path: "/settings",
    },
  ];

  const meta = router.meta();

  function isActive(path, pathNow) {
    if (path === "/") {
      return path === pathNow;
    }
    return startsWith(pathNow, path);
  }
</script>

<Navbar color="primary" dark expand="md" class="mb-3">
  <Container>
    <NavbarBrand href="/">Zoneminder</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse
      {isOpen}
      navbar
      expand="md"
      on:update={handleUpdate}
      class="justify-content-end">
      <Nav navbar class="mr-auto">
        {#each routes as { path, text }}
          <NavItem {path} active={isActive(path, $meta.url)}>
            <NavLink href={path}>{text}</NavLink>
          </NavItem>
        {/each}
      </Nav>
    </Collapse>
  </Container>
</Navbar>
