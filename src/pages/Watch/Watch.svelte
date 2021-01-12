<script>
  import { router } from "tinro";
  import { Container } from "sveltestrap";
  import { QueryClientProvider, QueryClient } from "@sveltestack/svelte-query";
  import Stream from "./_Stream.svelte";

  const client = new QueryClient();

  const meta = router.meta();

  let id = $meta.params.id;
</script>

<QueryClientProvider>
  <Container>
    <Stream {id} />
  </Container>
</QueryClientProvider>