<script>
    import {token} from '../stores/token'
    import {notes} from '../stores/notes'
    import {slide, scale} from 'svelte/transition'
    import {flip} from 'svelte/animate'
    import { onMount } from 'svelte'
    import Note from './Note.svelte';
    import Card from './Card.svelte';
    import AddNewNote from './AddNewNote.svelte';
    import Tabs from './Tabs.svelte';

    let items = ['Notes', 'Add New Note']
    let activeItem = 'Notes'

    onMount(async () => {
        const response = await fetch("http://localhost:4000/api/notes", {
            method: 'GET',
            credentials: "include",
            headers:{
                'Authorization': `bearer ${$token}`
            }
        })

        const ns = await response.json()
        
        notes.update(data => {
            return ns
        })
    })

    async function logout(){
        const response = await fetch("http://localhost:4000/api/user/logout", {
            method: "DELETE", 
            headers: {
                'authorization': `bearer ${$token}`
            }
        })
        if(response.status == 204){
            token.update(() => {
                return null
            })
        }

    }
    
    let cardState = 'Show'
    let card_edit_id = -1

    function tabChange(e){
        activeItem = e.detail
    }
    async function del(id){
        const response = await fetch("http://localhost:4000/api/notes/delete", {
            method: 'DELETE',
            credentials: "include",
            headers: {
                'authorization': `bearer ${$token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        })
        if(response.status == 200){
                notes.update(data => {
                data = data.filter(note => note.id != id)
                return data
            })
        }
        
    }
    function edit(id){
        cardState = 'Edit'
        card_edit_id = id
    }
    function showNote(){
        cardState = 'Show'
    }
    async function save(note){

        const content = document.querySelector("#editableContent").textContent
        if(content.trim().length < 1){
            document.querySelector("#editableContent").style.border = "3px solid red"
        }else{
            document.querySelector("#editableContent").style.border = ""
            let newNote = {content, id: note.id}
            const response = await fetch("http://localhost:4000/api/notes/update", {
                method: 'PUT',
                credentials: "include",
                headers:{
                    'authorization': `bearer ${$token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newNote)
            })
            if(response.status == 200){
                document.querySelector("#editableContent").style.border = ""
                    notes.update(data => {
                    const newObject = {id: note.id, content}
                    const n = data.find(o => o.id == newObject.id)
                    n.content = content
                    data = [...data]
                    return data
                })
                cardState = 'Show'
            }else{
                document.querySelector("#editableContent").style.border = "3px solid red"
            }
            
        }
    }
</script>
<button class="del" on:click="{logout}">Logout</button>
<h1>Home</h1>
<Tabs {items} {activeItem} on:tabChange={tabChange}/>
{#if activeItem === 'Notes'}
    <div class="notes" >
        {#each $notes as note (note.id)}
        <div in:slide out:scale|local animate:flip={{duration: 500}}>
            <Card>
                {#if cardState === 'Show' || cardState == 'Edit' && note.id != card_edit_id}
                <div class="note" >
                    <Note id={note.id} note={note.content} date={note.updated_at}/>
                </div>
                <div>
                    <button class="del" on:click={() => del(note.id)}>Delete</button>
                    <button class="edit" on:click={() => edit(note.id)}>Edit</button>
                </div>
                {:else if cardState === 'Edit' && note.id == card_edit_id}
                        <div>
                            <form on:submit|preventDefault="{() => save(note)}" class="save">
                                <!-- <textarea name="c" id="c"  value={note.content}></textarea> -->
                                
                                <div name="editableContent" id="editableContent" contenteditable required>{note.content}</div>
                                <button class="edit">Save</button>

                            </form>
                        </div>
                        <div>
                            <button class="edit" on:click={showNote}>Back</button>

                        </div>
                {/if}
            </Card>
        </div>
        {/each}
    </div>
{:else if activeItem === 'Add New Note'}
    <AddNewNote on:tabChange={tabChange}/>
{/if}
<style>
    h1{
        text-align: center;
    }
    .notes{
        margin: 0;
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
    .del{
        border: 2px solid crimson;
        color: crimson;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
        max-width: 100px;
    }
    .edit{
        border: 2px solid navy;
        color: navy;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
    }
    [contenteditable] {
		padding: 0.5em;
		border: 1px solid orange;
		border-radius: 4px;
	}
    .save{
        display: flex;
        flex-direction: column;
        
    }
    .save button{
        margin-top: 10px;
        border-color: goldenrod;
    }
    
</style>