<script>
  import axios from "axios";
  import jwtDecode from "jwt-decode";
  import { zmUrl } from "../config/env";
  import { accessToken, refreshToken, login, refreshTokenExp } from "../stores";

  export let cmp;

  const values = {
    user: "",
    pass: "",
  };

  async function auth() {
    if (values.user && values.pass) {
      const data = new URLSearchParams(values);
      const res = await axios.post(`${zmUrl}/api/host/login.json`, data);
      accessToken.set(res.data.access_token);
      refreshToken.set(res.data.refresh_token);
      refreshTokenExp.set(jwtDecode(res.data.refresh_token).exp);
      login.set(false);
    }
  }
</script>

{#if $login}
  <div class="container">
    <form on:submit|preventDefault={auth}>
      <div class="form-group">
        <label for="user">Username</label>
        <input
          required
          class="form-control"
          type="text"
          id="user"
          bind:value={values.user}
        />
      </div>
      <div class="form-group">
        <label for="pass">Password</label>
        <input
          required
          class="form-control"
          type="password"
          id="pass"
          bind:value={values.pass}
        />
      </div>
      <button type="submit" class="btn btn-primary btn-block">Login</button>
    </form>
  </div>
{:else}
  <svelte:component this={cmp} />
{/if}
