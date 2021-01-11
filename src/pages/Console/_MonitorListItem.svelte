<script>
  import { Button, Tooltip } from "sveltestrap";
  import Circle from "phosphor-svelte/lib/Circle";
  import PencilLine from "phosphor-svelte/lib/PencilLine";
  import Eye from "phosphor-svelte/lib/Eye";
  import pretty from "pretty-bytes";

  export let monitor;
</script>

<tr>
  <td>
    <div class="d-inline-block">
      <span
        class={!+monitor.Monitor_Status.CaptureFPS ? 'text-danger' : 'text-primary'}>
        <Circle weight="fill" />
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
    {pretty(+monitor.Monitor_Status.CaptureBandwidth)}/s
  </td>
  <td>{pretty(+monitor.Monitor.TotalEventDiskSpace)}</td>
  <td>{pretty(+monitor.Monitor.DayEventDiskSpace)}</td>
  <td>{pretty(+monitor.Monitor.ArchivedEventDiskSpace)}</td>
  <td>{monitor.Monitor.ZoneCount}</td>
  <td>
    <Button
      href="/monitor/{monitor.Monitor.Id}"
      id="btnEdit"
      size="sm"
      color="primary">
      <PencilLine weight="fill" />
      <Tooltip target="btnEdit">Edit</Tooltip>
    </Button>
    <Button
      href="/watch/{monitor.Monitor.Id}"
      id="btnWatch"
      size="sm"
      color="info">
      <Eye weight="fill" />
      <Tooltip target="btnWatch">Watch</Tooltip>
    </Button>
  </td>
</tr>
