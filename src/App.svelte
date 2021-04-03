<script>
  import { Route, router } from "tinro";
  import Navbar from "./components/Navbar.svelte";
  import Content from "./components/Content.svelte";
  import Settings from "./pages/Settings";
  import Watch from "./pages/Watch";
  import Console from "./pages/Console";
  import { CreateMonitor } from "./pages/Create";
  import { refreshToken, login, webTheme } from "./stores";
  import Auth from "./libs/authStorage";

  if (!$refreshToken) {
    login.set(true);
  }

  router.subscribe((_) => {
    const auth = Auth.getInstance();
    const refreshTokenExp = auth.getRefreshTokenExp();
    if (
      !auth.getRefreshToken() ||
      !refreshTokenExp ||
      new Date(refreshTokenExp * 1000) <= Date.now()
    ) {
      console.log("Unauthenticated");
      login.set(true);
    }
  });
</script>

<svelte:head>
  <title>Zoneminder</title>
  <link
    rel="stylesheet {$webTheme !== 'light' ? 'alternate' : ''}"
    href="/assets/bootstrap-light.min.css"
  />
  <link
    rel="stylesheet {$webTheme !== 'dark' ? 'alternate' : ''}"
    href="/assets/bootstrap-dark.min.css"
  />
</svelte:head>

<Route>
  <Navbar />
  <Route path="/">
    <Content cmp={Console} />
  </Route>
  <Route path="/monitors/create">
    <CreateMonitor />
  </Route>
  <Route path="/watch" redirect="/" />
  <Route path="/watch/:id">
    <Watch />
  </Route>
  <Route path="/settings">
    <Settings />
  </Route>
  <Route fallback>404</Route>
</Route>
