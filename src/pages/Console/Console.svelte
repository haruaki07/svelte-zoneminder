<script>
  import { onMount } from "svelte";

  import { Container, Spinner } from "sveltestrap";
  import Lazy from "../../components/Lazy.svelte";
  import api from "../../libs/api";

  let intv;

  async function getMonitors() {
    try {
      const { data } = await api.get("monitors.json");
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  }

  onMount(() => {
    getMonitors().then(() => {
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
