<script>
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  import Button from '$lib/components/Button.svelte';
  export let data;
  $: user = data.user;
</script>

<h1>Welcome to SvelteKit</h1>
<h4>{user ? user.display_name : 'Not signed in'}</h4>
<LogoutButton />
<Button element="a" style="solid" href="/api/auth/login">Login</Button>

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
