<script>
  import { Button } from "sveltestrap";

  export let monitor;
</script>

<tr>
  <td>
    <div class="d-inline-block">
      <span
        class={!+monitor.Monitor_Status.CaptureFPS ? 'text-danger' : 'text-primary'}>
        status
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
    <Button href="/monitor/{monitor.Monitor.Id}" color="primary">edit</Button>
    <Button href="/watch/{monitor.Monitor.Id}" color="info">show</Button>
  </td>
</tr>
