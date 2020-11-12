<script>
    import { token } from "../stores/token";
    import { notes } from "../stores/notes";
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()


    let note = {content: ""};
    async function newNote(){

        const response = await fetch("http://localhost:4000/api/notes/create", {
            method: 'POST',
            credentials: "include",
            headers:{
                "Content-Type": "application/json",
                "authorization": `bearer ${$token}`
            },
            body: JSON.stringify(note)
        })
        if(response.status == 201){
            dispatch('tabChange', 'Notes')
            response.json().then(data => {
                notes.update(d => { 
                return [...d, data]
            })
            })
            
        }
    }
</script>

<div>
    <h3>Add New Note</h3>
    <form on:submit|preventDefault={newNote}>
        <textarea name="content" id="content" cols="30" rows="10" bind:value="{note.content}" required></textarea>
        <button id="create" type="submit">Create</button>
    </form>
</div>

<style>
    div{
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        text-align: center;
        height: 100vh;
    }
    form{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    #content{
        max-width: 75%;
        resize: none;
    }
    #create{
        max-width: 75%;
        cursor: pointer;
        border-radius: 6px;
        border: 2px solid pink;
        font-weight: bold;
    }
</style>