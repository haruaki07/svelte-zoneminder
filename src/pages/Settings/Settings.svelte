<script>
  import { Button, Container } from "sveltestrap";
  import { webTheme } from "../../stores";

  function changeTheme(theme) {
    webTheme.set(theme);
  }
</script>

<Container>
  <div class="mb-5">
    <h4>Web Theme</h4>
    <div>
      <Button color="dark" on:click={() => changeTheme("dark")}>Dark</Button>
      <Button color="light" on:click={() => changeTheme("light")}>Light</Button>
    </div>
  </div>
</Container>
