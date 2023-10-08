<script>
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  export let data;
  $: user = data.user;
</script>

<h1>Welcome to SvelteKit</h1>
<h1>{user ? user.display_name : 'Not signed in'}</h1>
<a href="/api/auth/login">Login</a>
<LogoutButton />
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
