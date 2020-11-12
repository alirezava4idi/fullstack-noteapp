<script>
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()
    export let items = [];
    export let activeItem;
    function tabChange(tab){
        activeItem = tab
        dispatch('tabChange', tab)
    }
</script>
<div>
    <ul>
        {#each items as tab}
            <li class:active={tab === activeItem} on:click={() => tabChange(tab)}>{tab}</li>
        {/each}
    </ul>
</div>


<style>
    ul{
        margin: 0;
        display: flex;
        justify-content: center;
        list-style-type: none;
        
    }
    li{
        margin: 20px;
        padding: 15px;
        cursor: pointer;
        border-radius: 6px;
        border: 3px orange solid;
        font-weight: bold;
    }
    .active{
        background-color: orange;
        color: white;
        font-weight: bold;
    }
</style>