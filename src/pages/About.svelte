<script>
  import axios from "axios";
  import { onMount } from "svelte";

  let count = 0;
  let intervalId = null;

  async function getData() {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    count++;
  }

  onMount(() => {
    getData().then(() => {
      intervalId = setInterval(getData, 1000);
    });

    return () => clearInterval(intervalId);
  });
</script>

About Page
<p>fetch count : {count}</p>
<a href="/">home</a>
