<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Button from './Button.svelte';
  async function logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        fromClientJs: 'true'
      }
    });
    if (response.ok) {
      invalidateAll();
    }
  }
</script>

<form method="post" action="/api/auth/logout" on:submit|preventDefault={logout}>
  <Button element="button" style="danger" type="submit">Logout</Button>
</form>

<style>
  form {
    display: inline-block;
  }
</style>
