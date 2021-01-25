<script>
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";
  import pretty from "pretty-bytes";
  import {
    Button,
    Spinner,
    Table,
    Modal,
    ModalBody,
    ModalHeader,
  } from "sveltestrap";
  import MonitorListItem from "./_MonitorListItem.svelte";
  import { useQuery } from "@sveltestack/svelte-query";
  import api from "../../libs/api";
  import { sumBy } from "../../libs/utils";
  import { webTheme } from "../../stores";

  const result = useQuery(
    "monitors",
    async () => {
      const { data } = await api.get("monitors.json");
      return data;
    },
    {
      refetchInterval: 1000 * 30,
    }
  );
  let modalOpen = false;

  const toggleModal = () => (modalOpen = !modalOpen);
</script>

<Button color="primary" class="mb-3" on:click={toggleModal}>Add Monitor</Button>
<Button color="info" class="mb-3" on:click={$result.refetch()}>Reload</Button>

<Table responsive hover dark={$webTheme === "dark"}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Stats</th>
      <th>Events</th>
      <th>Day</th>
      <th>Archived</th>
      <th>Zones</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {#if !$result.isLoading && $result.isSuccess}
      {#if $result.data.monitors.length}
        {#each $result.data.monitors as monitor}
          <MonitorListItem {monitor} />
        {/each}
        <tr>
          <td />
          <td>
            {pretty(
              sumBy(
                $result.data.monitors,
                (o) => +o.Monitor_Status["CaptureBandwidth"]
              )
            )}
          </td>
          <td>
            {pretty(
              sumBy(
                $result.data.monitors,
                (o) => +o.Monitor["TotalEventDiskSpace"]
              )
            )}
          </td>
          <td>
            {pretty(
              sumBy(
                $result.data.monitors,
                (o) => +o.Monitor["DayEventDiskSpace"]
              )
            )}
          </td>
          <td>
            {pretty(
              sumBy(
                $result.data.monitors,
                (o) => +o.Monitor["ArchivedEventDiskSpace"]
              )
            )}
          </td>
          <td>
            {sumBy($result.data.monitors, (o) => +o.Monitor["ZoneCount"])}
          </td>
          <td />
        </tr>
      {:else}
        <tr class="text-center">
          <td colspan="7">Empty</td>
        </tr>
      {/if}
    {:else}
      <tr>
        <td colspan="7" class="text-center py-3">
          <Spinner />
        </td>
      </tr>
    {/if}
  </tbody>
</Table>

<Modal
  size="lg"
  isOpen={modalOpen}
  toggle={toggleModal}
  transitionType={fly}
  transitionOptions={{ duration: 150, y: -100 }}
>
  <ModalHeader toggle={toggleModal}>Add Monitor</ModalHeader>
  <ModalBody>TODO : Can add monitor</ModalBody>
</Modal>
