<script>
  import { useQuery } from "@sveltestack/svelte-query";
  import api from "../../libs/api";
  import { Row, Col, ButtonGroup, Button, Spinner } from "sveltestrap";
  import Play from "phosphor-svelte/lib/Play";
  import Pause from "phosphor-svelte/lib/Pause";
  import MagnifyingGlassPlus from "phosphor-svelte/lib/MagnifyingGlassPlus";
  import MagnifyingGlassMinus from "phosphor-svelte/lib/MagnifyingGlassMinus";
  import IconContext from "phosphor-svelte/lib/IconContext";
  import pretty from "pretty-bytes";
  import { accessToken } from "../../stores";
  import { zmUrl } from "../../config/env";
  import {
    CMD_PAUSE,
    CMD_PLAY,
    CMD_QUERY,
    CMD_ZOOMIN,
    CMD_ZOOMOUT,
  } from "../../config/cmd";

  export let id;

  let scale = "100";
  let command = CMD_QUERY;
  let state = CMD_PLAY;
  let connkey = Math.floor(Math.random() * 999999 + 1).toString();

  let query = useQuery("getMonitor", async () => {
    const { data } = await api.get(`monitors/${id}.json`);
    return data;
  });

  let request = async (cmd) => {
    const { data } = await api({
      method: "GET",
      url: "index.php",
      baseURL: zmUrl,
      params: {
        view: "request",
        request: "stream",
        connkey,
        command: cmd,
      },
    });
    return data;
  };

  let stream = useQuery(
    "streamMonitor",
    async () => {
      const data = await request(command);
      command = CMD_QUERY;
      return data;
    },
    {
      refetchInterval: 1000,
    }
  );

  async function streamPlay() {
    command = state = CMD_PLAY;
  }

  async function streamPause() {
    command = state = CMD_PAUSE;
  }

  // TODO: zoom in and zoom out control;
</script>

<style>
  .img-control {
    position: absolute;
    bottom: 5px;
    right: 5px;
    display: none;
  }

  .img-wrapper:hover .img-control {
    display: block;
  }
</style>

{#if !$query.isLoading}
  <Row>
    <Col md="12">
      <div class="w-100 d-flex flex-column align-items-center">
        <div class="form-group form-inline">
          <label for="scale">Scale:</label>
          <select
            id="scale"
            bind:value={scale}
            class="form-control form-control-sm ml-2">
            <option value="150">150%</option>
            <option value="100">100%</option>
            <option value="50">50%</option>
          </select>
        </div>
        <div class="img-wrapper position-relative mb-3">
          <img
            alt="snapshot"
            class="rounded"
            draggable="false"
            height={$query.data.monitor.Monitor.Height * (+scale / 100)}
            width={$query.data.monitor.Monitor.Width * (+scale / 100)}
            src="{zmUrl}/cgi-bin/nph-zms?scale=100&mode=jpeg&maxfps=30&width={$query.data.monitor.Monitor.Width}px&height={$query.data.monitor.Monitor.Height}px&monitor={id}&connkey={connkey}&token={$accessToken}" />
          <div class="img-control">
            <ButtonGroup size="sm">
              <IconContext values={{ color: '#000', size: 14 }}>
                <Button title="Zoom Out" color="light">
                  <MagnifyingGlassMinus />
                </Button>
                <Button title="Zoom In" color="light">
                  <MagnifyingGlassPlus />
                </Button>
              </IconContext>
            </ButtonGroup>
          </div>
        </div>
        <ButtonGroup>
          <IconContext values={{ color: '#FFF', weight: 'fill', size: 14 }}>
            <Button
              disabled={state === CMD_PLAY}
              title="Play"
              color="primary"
              on:click={streamPlay}>
              <Play />
            </Button>
            <Button
              disabled={state === CMD_PAUSE}
              title="Pause"
              color="primary"
              on:click={streamPause}>
              <Pause />
            </Button>
          </IconContext>
        </ButtonGroup>
      </div>
    </Col>
    <Col md="3">
      {#if $stream.isSuccess && $stream.data.result === 'Ok'}
        {JSON.stringify($stream.data)}
      {/if}
    </Col>
  </Row>
{:else}
  <div class="text-center">
    <Spinner />
  </div>
{/if}
