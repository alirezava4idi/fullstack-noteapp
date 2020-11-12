<script>
    import {token} from './stores/token'
    import Login from './components/Login.svelte'
    import { onMount } from 'svelte';
    import Index from './components/Index.svelte';
    let loading = true
    onMount(async () => {
        let t = null
        const response = await fetch("http://localhost:4000/api/user/token", {
            method: 'POST',
            credentials: "include"
        })
        const body = await response.json()
        console.log(body)
        token.update(() => {
            loading = false

            return body.accessToken
        })
    })
    loading = false
    
</script>
<div class="container">
    {#if $token}  
        <Index/>
    {:else}
        <Login/>
    {/if}
</div>

<style>
    .container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        /* align-items: center; */
    }
    @media only screen and (max-width: 600px){
        .container{
            align-items: unset;
            text-align: center;
        }
    }
</style>