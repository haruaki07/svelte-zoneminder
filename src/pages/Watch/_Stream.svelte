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
    CMD_PAN,
  } from "../../config/cmd";

  export let id;

  let scale = "100";
  let state = CMD_PLAY;
  let connkey = Math.floor(Math.random() * 999999 + 1).toString();

  let query = useQuery("getMonitor", async () => {
    const { data } = await api.get(`monitors/${id}.json`);
    return data;
  });

  let request = async (opt) => {
    const { data } = await api({
      method: "GET",
      url: "index.php",
      baseURL: zmUrl,
      params: {
        view: "request",
        request: "stream",
        connkey,
        ...opt,
      },
    });
    return data;
  };

  let stream = useQuery(
    "streamMonitor",
    async () => {
      const data = await request({ command: CMD_QUERY });
      return data;
    },
    {
      refetchInterval: 1000,
    }
  );

  async function streamPlay() {
    state = CMD_PLAY;
    const data = await request({ command: CMD_PLAY });
    console.log(data);
    return data;
  }

  async function streamPause() {
    state = CMD_PAUSE;
    const data = await request({ command: CMD_PAUSE });
    console.log(data);
    return data;
  }

  async function streamZoomIn() {
    const data = await request({ command: CMD_ZOOMIN });
    console.log(data);
    return data;
  }

  async function streamZoomOut() {
    const data = await request({ command: CMD_ZOOMOUT });
    console.log(data);
    return data;
  }

  /**
   * @param {MouseEvent} e
   */
  async function streamZoomInCoor(e) {
    const x = e.pageX,
      y = e.pageY;

    if (e.ctrlKey) {
      const data = await request({ command: CMD_PAN, x, y });
      console.log(data);
      return data;
    }

    const data = await request({ command: CMD_ZOOMIN, x, y });
    console.log(data);
    return data;
  }

  /**
   * @param {MouseEvent} e
   */
  async function imgMouseMove(e) {
    e.target.style.cursor = e.ctrlKey ? "grab" : "zoom-in";
  }
</script>

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
            on:click={streamZoomInCoor}
            on:mousemove={imgMouseMove}
            alt="snapshot"
            class="rounded"
            draggable="false"
            height={$query.data.monitor.Monitor.Height * (+scale / 100)}
            width={$query.data.monitor.Monitor.Width * (+scale / 100)}
            src="{zmUrl}/cgi-bin/nph-zms?scale=100&mode=jpeg&maxfps=30&width={$query
              .data.monitor.Monitor.Width}px&height={$query.data.monitor.Monitor
              .Height}px&monitor={id}&connkey={connkey}&token={$accessToken}"
          />
          <div class="img-control">
            <ButtonGroup size="sm">
              <IconContext values={{ color: "#000", size: 14 }}>
                <Button title="Zoom Out" color="light" on:click={streamZoomOut}>
                  <MagnifyingGlassMinus />
                </Button>
                <Button title="Zoom In" color="light" on:click={streamZoomIn}>
                  <MagnifyingGlassPlus />
                </Button>
              </IconContext>
            </ButtonGroup>
          </div>
        </div>
        <ButtonGroup>
          <IconContext values={{ color: "#FFF", weight: "fill", size: 14 }}>
            <Button
              disabled={state === CMD_PLAY}
              title="Play"
              color="primary"
              on:click={streamPlay}
            >
              <Play />
            </Button>
            <Button
              disabled={state === CMD_PAUSE}
              title="Pause"
              color="primary"
              on:click={streamPause}
            >
              <Pause />
            </Button>
          </IconContext>
        </ButtonGroup>
      </div>
    </Col>
    <Col md="3">
      <!-- TODO: SHOW INFO STATUS -->
      {#if $stream.isSuccess && $stream.data.result === "Ok"}
        {JSON.stringify($stream.data)}
      {/if}
    </Col>
  </Row>
{:else}
  <div class="text-center">
    <Spinner />
  </div>
{/if}

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
