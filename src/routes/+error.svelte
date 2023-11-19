<script>
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import LogoutButton from '$lib/components/LogoutButton.svelte';
</script>

{#if $page.status === 401}
  <h1>{$page.status}: Session Expired</h1>
  <h4>Not signed in</h4>
  <LogoutButton />
  <Button element="a" style="solid" href="/api/auth/login">Login</Button>
{:else}
  <h1>{$page.status}: {$page.error?.message}</h1>
{/if}
