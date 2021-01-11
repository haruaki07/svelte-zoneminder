<script>
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
  import { Container, Spinner } from "sveltestrap";
  import Lazy from "../../components/Lazy.svelte";

  const client = new QueryClient();
</script>

<QueryClientProvider {client}>
  <Container>
    <Lazy
      component={() => import('./_MonitorList.svelte')}
      loadingContent={Spinner} />
  </Container>
</QueryClientProvider>
