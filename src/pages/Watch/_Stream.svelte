<script>
  import { useQuery } from "@sveltestack/svelte-query";
  import api from "../../libs/api";
  import { Row, Col, ButtonGroup, Button, Spinner } from "sveltestrap";
  import Play from "phosphor-svelte/lib/Play";
  import Pause from "phosphor-svelte/lib/Pause";
  import MagnifyingGlassPlus from "phosphor-svelte/lib/MagnifyingGlassPlus";
  import MagnifyingGlassMinus from "phosphor-svelte/lib/MagnifyingGlassMinus";
  import IconContext from "phosphor-svelte/lib/IconContext";
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
  import stateStrings from "../../config/state";

  export let id;

  let mode = "";
  let level = {
    color: "",
    value: "",
  };
  let scale = "100";
  let streamState = CMD_PLAY;
  let monitorState = "";
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

      if (data.result === "Ok" && data.status) {
        if (typeof data.status.state === "number")
          monitorState = stateStrings[data.status.state];

        if (data.status.paused) {
          mode = "Paused";
        } else if (data.status.delayed) {
          mode = "Replay";
        } else {
          mode = "Live";
        }

        level.value = data.status.level;
        if (data.status.level > 95) {
          level.color = "text-danger";
        } else if (data.status.level > 80) {
          level.color = "text-warning";
        } else {
          level.color = "text-info";
        }
      }

      return data;
    },
    {
      refetchInterval: 1000,
    }
  );

  async function streamPlay() {
    streamState = CMD_PLAY;
    const data = await request({ command: CMD_PLAY });
    console.log(data);
    return data;
  }

  async function streamPause() {
    streamState = CMD_PAUSE;
    const data = await request({ command: CMD_PAUSE });
    console.log(data);
    return data;
  }

  async function streamZoomIn(x, y) {
    let param = { command: CMD_ZOOMIN };
    if (x && y) {
      param.x = x;
      param.y = y;
    }
    const data = await request(param);
    console.log(data);
    return data;
  }

  async function streamZoomOut() {
    const data = await request({ command: CMD_ZOOMOUT });
    console.log(data);
    return data;
  }

  async function streamPan(x, y) {
    const data = await request({ command: CMD_PAN, x, y });
    console.log(data);
    return data;
  }

  /**
   * @param {MouseEvent} e
   */
  async function imgMouseClick(e) {
    /** @type {DOMRect} */
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    if (e.ctrlKey) {
      return streamPan(x, y);
    }

    return streamZoomIn(x, y);
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
            on:click={imgMouseClick}
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
                <Button
                  title="Zoom In"
                  color="light"
                  on:click={() => streamZoomIn()}
                >
                  <MagnifyingGlassPlus />
                </Button>
              </IconContext>
            </ButtonGroup>
          </div>
        </div>
        <ButtonGroup>
          <IconContext values={{ color: "#FFF", weight: "fill", size: 14 }}>
            <Button
              disabled={streamState === CMD_PLAY}
              title="Play"
              color="primary"
              on:click={streamPlay}
            >
              <Play />
            </Button>
            <Button
              disabled={streamState === CMD_PAUSE}
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
      {#if $stream.isSuccess && $stream.data.result === "Ok" && $stream.data.status}
        <dl class="row">
          <dt class="col-sm-3">State</dt>
          <dd class="col-sm-9">
            {monitorState} - {$stream.data.status.fps} fps
          </dd>

          <dt class="col-sm-3">Mode</dt>
          <dd class="col-sm-9">{mode}</dd>

          <dt class="col-sm-3">Zoom</dt>
          <dd class="col-sm-9">{$stream.data.status.zoom}x</dd>

          {#if mode !== "Live"}
            {#if mode === "Replay"}
              <dt class="col-sm-3">Rate</dt>
              <dd class="col-sm-9">{$stream.data.status.rate}x</dd>
            {/if}

            <dt class="col-sm-3">Delay</dt>
            <dd class="col-sm-9">{$stream.data.status.delay}s</dd>

            <dt class="col-sm-3">Buffer</dt>
            <dd class="col-sm-9 {level.color}">{level.value}%</dd>
          {/if}
        </dl>
        <!-- {JSON.stringify($stream.data)} -->
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
