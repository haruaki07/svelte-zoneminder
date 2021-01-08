<script>
  import { Route, router } from "tinro";
  import Navbar from "./components/Navbar.svelte";
  import Content from "./components/Content.svelte";
  import About from "./pages/About.svelte";
  import Console from "./pages/Console";
  import { refreshToken, login, refreshTokenExp, accessToken } from "./stores";
  import { onMount } from "svelte";
  import axios from "axios";

  if (!$refreshToken) {
    login.set(true);
  }

  // onMount(async () => {
  //   try {
  //     const data = new URLSearchParams({token:accessToken});
  //     const res = await axios.post(
  //     `${import.meta.env.SNOWPACK_PUBLIC_ZM_URL}api/host/login.json`,
  //     data
  //   );
  //   if (res.status === 401) {

  //   }
  //   } catch (err) {

  //   }
  // });

  router.subscribe((_) => {
    if (!$refreshTokenExp || new Date($refreshTokenExp * 1000) <= Date.now()) {
      console.log("need login!");
      login.set(true);
    }
  });
</script>

<svelte:head>
  <title>Zoneminder</title>
  <link rel="stylesheet" href="/assets/bootstrap-light.min.css" />
</svelte:head>

<Route>
  <Navbar />
  <Route path="/">
    <Content cmp={Console} />
  </Route>
  <Route path="/about">
    <Content cmp={About} />
  </Route>
  <Route fallback>404</Route>
</Route>
