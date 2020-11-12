<script>
    export let id;
    export let note;
    export let date;
    let d = date.split("T")[0]
    let t = date.split("T")[1].split(".")[0]
    
</script>


    <!-- <h3>{id}</h3> -->
    <div>
        <p>{note}</p>
        <p id="date">{d} {t}</p>
    </div>
    


<style>
    .container{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    #date{
        font-size: 14px;
        font-style: italic;
        color: rgb(168, 166, 166);
    }
    
</style>