<script>
  import { invalidateAll } from '$app/navigation';
</script>

<form
  method="post"
  action="/api/auth/logout"
  on:submit|preventDefault={async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        fromClientJs: 'true'
      }
    });
    if (response.ok) {
      invalidateAll();
    }
  }}
>
  <button type="submit">Logout</button>
</form>
