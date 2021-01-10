<script>
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";

  import {
    Button,
    Spinner,
    Table,
    Modal,
    ModalBody,
    ModalHeader,
  } from "sveltestrap";
  import MonitorListItem from "./_MonitorListItem.svelte";

  let modalOpen = false;

  const toggleModal = () => (modalOpen = !modalOpen);

  let monitors = getContext("monitors");
</script>

<Button color="primary" class="mb-3" on:click={toggleModal}>Add Monitor</Button>

<Table responsive hover>
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
    {#if $monitors.loaded}
      {#each $monitors.monitors as monitor}
        <MonitorListItem {monitor} />
      {/each}
      <tr>
        <td />
        <td>{0}</td>
        <td>{0}</td>
        <td>{0}</td>
        <td>{0}</td>
        <td>{0}</td>
        <td />
      </tr>
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
  transitionOptions={{ duration: 150, y: -100 }}>
  <ModalHeader toggle={toggleModal}>Add Monitor</ModalHeader>
  <ModalBody>TODO : Can add monitor</ModalBody>
</Modal>
