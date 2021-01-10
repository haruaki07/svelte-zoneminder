<script>
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

  import { Container, Spinner } from "sveltestrap";
  import Lazy from "../../components/Lazy.svelte";
  import api from "../../libs/api";

  let intv;
  let monitors = writable({ loaded: false, monitors: [] });
  setContext("monitors", monitors);

  async function getMonitors() {
    try {
      const { data } = await api.get("monitors.json");
      $monitors.monitors = data.monitors;
    } catch (err) {
      console.log(err.message);
    }
  }

  onMount(() => {
    getMonitors().then(() => {
      $monitors.loaded = true;
      intv = setInterval(getMonitors, 1000 * 30);
    });

    return () => clearInterval(intv);
  });
</script>

<Container>
  <Lazy
    component={() => import('./_MonitorList.svelte')}
    loadingContent={Spinner} />
</Container>
