<template>
    <div class="mytest_container">
        <more-test :islist='true' ></more-test>
    </div>
</template>

<script>
import moreTest from '@components/moreTest'
export default {
    data(){
        return{
            
        }
    },
    mounted() {
        
    },
    components:{
        moreTest
    }
}
</script>

<style>
    body{
        overflow: auto;
        height:100vh;
        box-sizing: border-box;
        -webkit-overflow-scrolling: touch;
    }
</style>
