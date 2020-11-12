<script>
import { onMount } from 'svelte';

    import {token} from '../stores/token'
    let user = {email: "", password: ""}
    $: error = ""

    async function login(){
        const response = await fetch("http://localhost:4000/api/user/login", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        if(response.status == 200){
            const body = await response.json()
            error = ""
            token.update((_) => {
                return body.accessToken
            })
        }else{
            const body = await response.json()
            error = body.message
        }

        
    }
    let states = ['Login', 'Register']
    let state = 'Login'
    function stateChange(s){
        error = ""
        state = s
    }
    async function register(){
        const response = await fetch("http://localhost:4000/api/user/register", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        if(response.status == 201){
            stateChange('Login')
        }else{
            const body = await response.json()
            error = body.message
        }
    }
</script>
{#if state === 'Login'}
    <form on:submit|preventDefault="{login}">
        <h1>Login</h1>
        <div>
            <input class="form-field" type="email" name="email" id="email" placeholder="Email" bind:value={user.email} required>
            <input class="form-field" type="password" name="password" id="password" placeholder="Password" bind:value={user.password} required>
            <button type="submit">Login</button>
        </div>
        <div class="error">{error}</div>

    </form>
    <p>Don't have an account? <button on:click="{() => stateChange('Register')}" class="change">Register</button></p>
{:else}
    <form on:submit|preventDefault="{register}">
        <h1>Register</h1>
        <div>
            <input class="form-field" type="email" name="email" id="email" placeholder="Email" bind:value={user.email} required>
            <input class="form-field" type="password" name="password" id="password" placeholder="Password" bind:value={user.password} required>
            <button type="submit">Register</button>
        </div>
        <div class="error">{error}</div>

    </form>
    <p>Already have an account? <button on:click="{() => stateChange('Login')}" class="change">Login</button></p>
{/if}



<style>
    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        margin: 20px auto;
    }
    form div{
        display: flex;
        flex-direction: column;
    }
    button{
        cursor: pointer;
    }
    .change{
        background-color: white;
        border: none;
        color: firebrick;
    }
    .change:hover{
        color: rgb(134, 38, 38);
    }
    .error{
        font-size: 14px;
        color: crimson;
        font-weight: bold;
    }
    @media only screen and (min-width: 450px){
        .form-field{
            width: 400px;
        }
        
    }
   
</style>