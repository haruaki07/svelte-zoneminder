<script>
  import { Button, Tooltip } from "sveltestrap";
  import CircleFilled20 from "carbon-icons-svelte/lib/CircleFilled20";
  import Edit16 from "carbon-icons-svelte/lib/Edit16";
  import ViewFilled16 from "carbon-icons-svelte/lib/ViewFilled16";

  export let monitor;
</script>

<tr>
  <td>
    <div class="d-inline-block">
      <span
        class={!+monitor.Monitor_Status.CaptureFPS ? 'text-danger' : 'text-primary'}>
        <CircleFilled20 />
        {monitor.Monitor.Name}
      </span>
      <br />
      {monitor.Monitor.Host}
    </div>
  </td>

  <td>
    {monitor.Monitor.Function}
    {+monitor.Monitor_Status.CaptureFPS}
    fps
    <br />
    {0}/s
  </td>
  <td>{0}</td>
  <td>{0}</td>
  <td>{0}</td>
  <td>{monitor.Monitor.ZoneCount}</td>
  <td>
    <Button
      href="/monitor/{monitor.Monitor.Id}"
      id="btnEdit"
      size="sm"
      color="primary">
      <Edit16 />
      <Tooltip target="btnEdit">Edit</Tooltip>
    </Button>
    <Button
      href="/watch/{monitor.Monitor.Id}"
      id="btnWatch"
      size="sm"
      color="info">
      <ViewFilled16 />
      <Tooltip target="btnWatch">Watch</Tooltip>
    </Button>
  </td>
</tr>
